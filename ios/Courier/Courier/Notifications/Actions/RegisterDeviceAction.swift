//
//  RegisterDeviceAction.swift
//  Courier
//
//  Created by Matt Moriarity on 11/17/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Combinable
import Events
import Foundation
import UserActions

struct RegisterDeviceAction: MutationUserAction {
    let token: Data

    var undoActionName: String? { nil }
    var displayName: String? { "Register for Notifications" }

    func mutation(context: UserActions.Context<RegisterDeviceAction>) -> RegisterDeviceMutation {
        let tokenString = token.base64EncodedString()

        var input = AddDeviceInput(token: tokenString)
        #if DEBUG
        input.environment = .sandbox
        #else
        input.environment = .production
        #endif

        Event.current[.environment] = input.environment!

        return RegisterDeviceMutation(input: input)
    }
}

extension NotificationEnvironment: Encodable {}
