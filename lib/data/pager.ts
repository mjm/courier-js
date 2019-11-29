import {
  SqlSqlTokenType,
  sql,
  DatabasePoolType,
  RawSqlTokenType,
  PrimitiveValueExpressionType,
  ValueExpressionType,
} from "../db"
import { PagingOptions } from "./types"

type MakeEdgeFn<ResultType, RowType> = (row: RowType) => PagerEdge<ResultType>
type CursorValueFn = (cursor: string) => PrimitiveValueExpressionType

interface CountResult {
  count: number
}

interface OrderBy {
  column: string
  direction: "ASC" | "DESC"
}

export interface PagerOptions<ResultType, RowType = any> {
  db: DatabasePoolType
  query: SqlSqlTokenType<RowType>
  orderBy: OrderBy
  totalQuery: SqlSqlTokenType<CountResult>
  variables: PagingOptions
  makeEdge: MakeEdgeFn<ResultType, RowType>
  getCursorValue: CursorValueFn
}

export class Pager<ResultType, RowType = any> {
  private db: DatabasePoolType
  private query: SqlSqlTokenType<RowType>
  private orderBy: OrderBy
  private totalQuery: SqlSqlTokenType<CountResult>
  private makeEdge: MakeEdgeFn<ResultType, RowType>

  private limit: number
  private isReversed: boolean
  private cursor: PrimitiveValueExpressionType | undefined
  private results: Promise<PagerEdge<ResultType>[]>

  constructor({
    db,
    query,
    orderBy,
    totalQuery,
    variables,
    makeEdge,
    getCursorValue,
  }: PagerOptions<ResultType, RowType>) {
    this.isReversed = false

    if ("first" in variables) {
      this.limit = variables.first
      this.cursor = variables.after
        ? getCursorValue(variables.after)
        : undefined
    } else if ("last" in variables) {
      this.limit = variables.last
      this.isReversed = true
      this.cursor = variables.before
        ? getCursorValue(variables.before)
        : undefined
    } else {
      this.limit = 100
    }

    this.db = db
    this.query = query
    this.orderBy = orderBy
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
    if (this.isReversed) {
      result.hasPreviousPage = hasMore
    } else {
      result.hasNextPage = hasMore
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
    const limitedResults = results.slice(0, this.limit)
    if (this.isReversed) {
      return limitedResults.reverse()
    } else {
      return limitedResults
    }
  }

  private async fetchResults(): Promise<PagerEdge<ResultType>[]> {
    const query = this.buildQuery()
    const rows = await this.db.any(query)

    return rows.map(this.makeEdge)
  }

  private buildQuery(): SqlSqlTokenType<RowType> {
    const orderColumn = sql.identifier([this.orderBy.column])
    let actualDirection = this.orderBy.direction
    if (this.isReversed) {
      actualDirection = actualDirection === "ASC" ? "DESC" : "ASC"
    }

    let filter: ValueExpressionType = sql.raw("")
    if (this.cursor) {
      const condition = sql.comparisonPredicate(
        orderColumn,
        actualDirection === "ASC" ? ">" : "<",
        this.cursor
      )
      filter = sql`${this.whereJoiner} ${condition}`
    }

    return sql`
      ${this.query}
      ${filter}
      ORDER BY ${orderColumn} ${sql.raw(actualDirection)}
      LIMIT ${this.limit + 1}
    `
  }

  private get whereJoiner(): RawSqlTokenType {
    const sqlString = this.query.sql.toUpperCase()
    return sql.raw(sqlString.includes("WHERE") ? "AND" : "WHERE")
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
