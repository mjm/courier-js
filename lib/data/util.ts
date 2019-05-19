import db, {
  SqlTokenType,
  TaggedTemplateLiteralInvocationType,
  sql,
} from "../db"
import keyBy from "lodash/keyBy"

interface GetByIdOptions<ResultType, RowType, IdType = string> {
  query: (
    condition: SqlTokenType
  ) => TaggedTemplateLiteralInvocationType<RowType>
  ids: IdType[]
  fromRow: (row: RowType) => ResultType
}

export async function getByIds<ResultType, RowType>({
  query,
  ids,
  fromRow,
}: GetByIdOptions<ResultType, RowType>): Promise<(ResultType | null)[]> {
  const condition = sql`id = ANY(${sql.array(ids, "int4")})`
  const rows = await db.any(query(condition))
  const byId = keyBy(rows.map(fromRow), "id")
  return ids.map(id => byId[id] || null)
}
