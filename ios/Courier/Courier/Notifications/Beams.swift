//
//  Beams.swift
//  Courier
//
//  Created by Matt Moriarity on 2/22/20.
//  Copyright © 2020 Matt Moriarity. All rights reserved.
//

import Auth0
import Dispatch
import PushNotifications

extension BeamsTokenProvider {
    static let shared: BeamsTokenProvider = BeamsTokenProvider(authURL: Endpoint.current.pusherAuthURL.absoluteString) {
        var token = ""
        let sema = DispatchSemaphore(value: 0)

        CredentialsManager.shared.credentials { error, creds in
            if let error = error {
                print(error)
            } else if let creds = creds {
                token = creds.accessToken ?? ""
            }
        }

        let headers = ["Authorization": "Bearer \(token)"]
        return AuthData(headers: headers, queryParams: [:])
    }
}
