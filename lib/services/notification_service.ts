import { injectable, inject } from "inversify"
import DeviceTokenRepository from "../repositories/device_token_repository"
import { NewDeviceTokenInput, UserId, DeviceToken } from "../data/types"
import * as keys from "../key"

@injectable()
class NotificationService {
  constructor(
    private deviceTokens: DeviceTokenRepository,
    @inject(keys.UserId) private getUserId: () => Promise<UserId>
  ) {}

  async addDevice(input: NewDeviceTokenInput): Promise<DeviceToken> {
    return await this.deviceTokens.create(await this.getUserId(), input)
  }
}

export default NotificationService
