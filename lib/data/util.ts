import defaultDB, {
  SqlTokenType,
  TaggedTemplateLiteralInvocationType,
  sql,
} from "../db"
import keyBy from "lodash/keyBy"
import { DatabasePoolType } from "slonik"

interface GetByIdOptions<ResultType, RowType, IdType = string> {
  db?: DatabasePoolType
  query: (
    condition: (table: string) => SqlTokenType
  ) => TaggedTemplateLiteralInvocationType<RowType>
  ids: IdType[]
  fromRow: (row: RowType) => ResultType
}

export async function getByIds<ResultType, RowType>({
  db = defaultDB,
  query,
  ids,
  fromRow,
}: GetByIdOptions<ResultType, RowType>): Promise<(ResultType | null)[]> {
  const condition = (table: string) =>
    sql`${sql.identifier([table, "id"])} = ANY(${sql.array(ids, "int4")})`
  const rows = await db.any(query(condition))
  const byId = keyBy(rows.map(fromRow), "id")
  return ids.map(id => byId[id] || null)
}

export function isSameDate(d1: Date | null, d2: Date | null): boolean {
  if (!d1) {
    return !d2
  }
  if (!d2) {
    return false
  }

  return d1.getTime() === d2.getTime()
}
