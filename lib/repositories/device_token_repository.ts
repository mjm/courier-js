import { inject,injectable } from "inversify"

import { LoaderQueryFn,QueryLoader } from "lib/data/loader"

import * as table from "../data/dbTypes"
import {
  DeviceToken,
  DeviceTokenEnvironment,
  NewDeviceTokenInput,
  UserId,
} from "../data/types"
import { DatabasePoolType,sql } from "../db"
import * as keys from "../key"

@injectable()
class DeviceTokenRepository {
  constructor(@inject(keys.DB) private db: DatabasePoolType) {}

  async findAllByUser(userId: UserId): Promise<DeviceToken[]> {
    const rows = await this.db.any(sql<table.device_tokens>`
      SELECT *
        FROM device_tokens
       WHERE user_id = ${userId}
    `)

    return rows.map(DeviceTokenRepository.fromRow)
  }

  async create(
    userId: UserId,
    input: NewDeviceTokenInput
  ): Promise<DeviceToken> {
    const row = await this.db.one(sql<table.device_tokens>`
      INSERT INTO device_tokens (user_id, token, environment)
      VALUES (${userId}, ${input.token}, ${input.environment})
      ON CONFLICT (user_id, token)
      DO UPDATE SET environment = ${input.environment},
                    updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `)

    return DeviceTokenRepository.fromRow(row)
  }

  static fromRow(row: table.device_tokens): DeviceToken {
    return {
      id: row.id.toString(),
      userId: row.user_id,
      environment: row.environment as DeviceTokenEnvironment,
      token: row.token,
    }
  }
}

@injectable()
export class DeviceTokenLoader extends QueryLoader<
  DeviceToken,
  table.device_tokens
> {
  constructor(
    @inject(keys.DB) db: DatabasePoolType,
    @inject(keys.UserId) private getUserId: () => Promise<UserId>
  ) {
    super(db)
  }

  query: LoaderQueryFn<table.device_tokens> = async cond => {
    try {
      const userId = await this.getUserId()
      return sql`SELECT * FROM device_tokens WHERE user_id = ${userId} AND ${cond(
        "events"
      )}`
    } catch (_e) {
      return sql`SELECT * FROM device_tokens WHERE ${cond("events")}`
    }
  }
  fromRow = DeviceTokenRepository.fromRow
}

export default DeviceTokenRepository
