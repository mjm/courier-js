import {
  SqlSqlTokenType,
  sql,
  DatabasePoolType,
  PrimitiveValueExpressionType,
  ValueExpressionType,
} from "../db"
import { PagingOptions } from "./types"

type MakeEdgeFn<ResultType, RowType> = (row: RowType) => PagerEdge<ResultType>
type CursorValueFn = (cursor: string) => PrimitiveValueExpressionType

interface CountResult {
  count: number
}

export interface PagerOptions<ResultType, RowType = any> {
  db: DatabasePoolType
  query: SqlSqlTokenType<RowType>
  orderColumn: string
  totalQuery: SqlSqlTokenType<CountResult>
  variables: PagingOptions
  makeEdge: MakeEdgeFn<ResultType, RowType>
  getCursorValue: CursorValueFn
}

export class Pager<ResultType, RowType = any> {
  private db: DatabasePoolType
  private query: SqlSqlTokenType<RowType>
  private orderColumn: string
  private totalQuery: SqlSqlTokenType<CountResult>
  private makeEdge: MakeEdgeFn<ResultType, RowType>

  private limit: number
  private direction: "ASC" | "DESC"
  private cursor: PrimitiveValueExpressionType | undefined
  private results: Promise<PagerEdge<ResultType>[]>

  constructor({
    db,
    query,
    orderColumn,
    totalQuery,
    variables,
    makeEdge,
    getCursorValue,
  }: PagerOptions<ResultType, RowType>) {
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

    this.db = db
    this.query = query
    this.orderColumn = orderColumn
    this.totalQuery = totalQuery
    this.makeEdge = makeEdge

    // prefetch the results once, and use the same promise for all things
    this.results = this.fetchResults()
  }

  async totalCount(): Promise<number> {
    return await this.db.oneFirst(this.totalQuery)
  }

  async pageInfo(): Promise<PageInfo> {
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
    result.endCursor = edges[Math.min(edges.length, this.limit) - 1].cursor

    return result
  }

  async nodes(): Promise<ResultType[]> {
    const edges = await this.edges()
    return edges.map(edge => edge.node)
  }

  async edges(): Promise<PagerEdge<ResultType>[]> {
    const results = await this.results
    return results.slice(0, this.limit)
  }

  private async fetchResults(): Promise<PagerEdge<ResultType>[]> {
    const query = this.buildQuery()
    const rows = await this.db.any(query)

    return rows.map(this.makeEdge)
  }

  private buildQuery(): SqlSqlTokenType<RowType> {
    const orderColumn = sql.identifier([this.orderColumn])

    let filter: ValueExpressionType = sql``
    if (this.cursor) {
      const condition = sql.comparisonPredicate(
        orderColumn,
        this.direction === "ASC" ? ">" : "<",
        this.cursor
      )
      filter = sql`${this.whereJoiner} ${condition}`
    }

    const direction = this.direction === "ASC" ? sql`ASC` : sql`DESC`

    return sql`
      ${this.query}
      ${filter}
      ORDER BY ${orderColumn} ${direction}
      LIMIT ${this.limit + 1}
    `
  }

  private get whereJoiner(): ValueExpressionType {
    const sqlString = this.query.sql.toUpperCase()
    return sqlString.includes("WHERE") ? sql`AND` : sql`WHERE`
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
