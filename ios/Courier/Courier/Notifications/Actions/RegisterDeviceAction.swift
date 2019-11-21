//
//  RegisterDeviceAction.swift
//  Courier
//
//  Created by Matt Moriarity on 11/17/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Combinable
import Foundation
import UserActions

struct RegisterDeviceAction: ReactiveUserAction {
    let token: Data

    var undoActionName: String? { nil }
    var displayName: String? { "Register for Notifications" }

    func publisher(context: UserActions.Context<RegisterDeviceAction>) -> AnyPublisher<(), Error> {
        let tokenString = token.base64EncodedString()

        var input = AddDeviceInput(token: tokenString)
        #if DEBUG
        input.environment = .sandbox
        #else
        input.environment = .production
        #endif
        return context.apolloClient.publisher(mutation: RegisterDeviceMutation(input: input))
            .map { _ in }
            .eraseToAnyPublisher()
    }
}
