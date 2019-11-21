import { injectable, inject } from "inversify"
import { DB } from "../key"
import { sql, DatabasePoolType } from "../db"
import {
  NewDeviceTokenInput,
  DeviceToken,
  UserId,
  DeviceTokenEnvironment,
} from "../data/types"
import * as table from "../data/dbTypes"

@injectable()
class DeviceTokenRepository {
  constructor(@inject(DB) private db: DatabasePoolType) {}

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

export default DeviceTokenRepository
