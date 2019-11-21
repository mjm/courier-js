//
//  CredentialsManager.swift
//  Courier
//
//  Created by Matt Moriarity on 11/10/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Auth0

extension CredentialsManager {
    static let shared: CredentialsManager = CredentialsManager(
        authentication: Endpoint.current.authentication,
        storeKey: Endpoint.environment
    )
}
