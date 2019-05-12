import db from "../db"
import { PagingOptions } from "./types"

type MakeEdgeFn<T> = (row: any) => PagerEdge<T>
type CursorValueFn<C> = (cursor: string) => C

export interface PagerOptions<T, C> {
  query: string
  orderColumn: string
  totalQuery: string
  variables: PagingOptions
  makeEdge: MakeEdgeFn<T>
  getCursorValue: CursorValueFn<C>
}

export class Pager<T, C> {
  private query: string
  private orderColumn: string
  private totalQuery: string
  private makeEdge: MakeEdgeFn<T>

  private limit: number
  private direction: "ASC" | "DESC"
  private cursor: C | undefined
  private results: Promise<PagerEdge<T>[]>

  constructor({
    query,
    orderColumn,
    totalQuery,
    variables,
    makeEdge,
    getCursorValue,
  }: PagerOptions<T, C>) {
    if ("first" in variables) {
      this.limit = variables.first
      this.direction = "ASC"
      this.cursor = variables.after
        ? getCursorValue(variables.after)
        : undefined
    } else if ("last" in variables) {
      this.limit = variables.last
      this.direction = "DESC"
      this.cursor = variables.before
        ? getCursorValue(variables.before)
        : undefined
    } else {
      this.limit = 100
      this.direction = "ASC"
    }

    this.query = query
    this.orderColumn = orderColumn
    this.totalQuery = totalQuery
    this.makeEdge = makeEdge

    // prefetch the results once, and use the same promise for all things
    this.results = this.fetchResults()
  }

  async getTotalCount(): Promise<number> {
    const { rows } = await db.query({
      text: this.totalQuery,
      rowMode: "array",
    })

    return rows[0][0]
  }

  async getPageInfo(): Promise<PageInfo> {
    const result: PageInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    }

    const edges = await this.results
    const hasMore = edges.length > this.limit
    if (this.direction === "ASC") {
      result.hasNextPage = hasMore
    } else {
      result.hasPreviousPage = hasMore
    }

    if (!edges.length) {
      return result
    }

    result.startCursor = edges[0].cursor
    result.endCursor = edges[edges.length - 1].cursor

    return result
  }

  async getNodes(): Promise<T[]> {
    const results = await this.results
    return results.map(edge => edge.node)
  }

  async getEdges(): Promise<PagerEdge<T>[]> {
    return this.results
  }

  private async fetchResults(): Promise<PagerEdge<T>[]> {
    const [query, args] = this.buildQuery()
    const { rows } = await db.query(query, args)

    return rows.map(this.makeEdge)
  }

  private buildQuery(): [string, any[]] {
    const queryClauses = [this.query]
    const args = []
    if (this.cursor) {
      args.push(this.cursor)
      queryClauses.push(
        `WHERE ${this.orderColumn} ${this.direction === "ASC" ? ">" : "<"} $${
          args.length
        }`
      )
    }
    queryClauses.push(`ORDER BY ${this.orderColumn} ${this.direction}`)

    args.push(this.limit + 1)
    queryClauses.push(`LIMIT $${args.length}`)

    return [queryClauses.join("\n"), args]
  }
}

export interface PagerEdge<T> {
  node: T
  cursor: string
}

export interface PageInfo {
  startCursor: string | null
  endCursor: string | null
  hasNextPage: boolean
  hasPreviousPage: boolean
}
