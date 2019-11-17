import { injectable, inject } from "inversify"
import { DB } from "../key"
import { sql, DatabasePoolType } from "../db"
import { NewDeviceTokenInput, DeviceToken, UserId } from "../data/types"
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
      INSERT INTO device_tokens (user_id, token)
      VALUES (${userId}, ${input.token})
      ON CONFLICT (user_id, token)
      DO UPDATE SET updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `)

    return DeviceTokenRepository.fromRow(row)
  }

  static fromRow(row: table.device_tokens): DeviceToken {
    return {
      id: row.id.toString(),
      userId: row.user_id,
      token: row.token,
    }
  }
}

export default DeviceTokenRepository
