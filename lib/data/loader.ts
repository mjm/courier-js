import DataLoader from "dataloader"
import {
  sql,
  DatabasePoolType,
  TaggedTemplateLiteralInvocationType,
  SqlTokenType,
} from "../db"
import keyBy from "lodash/keyBy"
import { injectable } from "inversify"

type LoaderBatch<T> = Promise<(T | null)[]>
type LoaderIDConditional = (table: string) => SqlTokenType
export type LoaderQueryFn<T> = (
  cond: LoaderIDConditional
) => Promise<TaggedTemplateLiteralInvocationType<T>>

@injectable()
abstract class Loader<
  ValueType extends { id: IdType },
  RowType,
  IdType extends string = string
> {
  private loader: DataLoader<IdType, ValueType | null>

  constructor(private db: DatabasePoolType) {
    this.loader = new DataLoader(ids => this.fetch(ids))
  }

  async fetch(ids: IdType[]): LoaderBatch<ValueType> {
    const condition = (table: string) =>
      sql`${sql.identifier([table, "id"])} = ANY(${sql.array(ids, "int4")})`
    const rows = await this.db.any(await this.query(condition))
    const byId = keyBy(rows.map(this.fromRow), x => x.id.toString())
    return ids.map(id => byId[id.toString()] || null)
  }

  abstract query: LoaderQueryFn<RowType>
  abstract readonly fromRow: (row: RowType) => ValueType

  async load(id: IdType): Promise<ValueType | null> {
    return await this.loader.load(id)
  }

  async reload(id: IdType): Promise<ValueType | null> {
    return await this.loader.clear(id).load(id)
  }

  prime(id: IdType, value: ValueType): this {
    this.loader.prime(id, value)
    return this
  }

  replace(id: IdType, value: ValueType): this {
    this.loader.clear(id).prime(id, value)
    return this
  }
}

export default Loader
