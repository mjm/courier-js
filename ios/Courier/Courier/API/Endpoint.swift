//
//  Endpoint.swift
//  Courier
//
//  Created by Matt Moriarity on 11/12/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Auth0
import Foundation

struct Endpoint {
    var url: URL
    var apiIdentifier: String
    var webAuth: WebAuth
    var authentication: Authentication

    init(url: String, apiIdentifier: String, clientId: String, domain: String) {
        self.url = URL(string: url)!
        self.apiIdentifier = apiIdentifier
        self.webAuth = Auth0.webAuth(clientId: clientId, domain: domain)
        self.authentication = Auth0.authentication(clientId: clientId, domain: domain)
    }

    static let staging = Endpoint(
        url: "https://staging.courier.blog",
        apiIdentifier: "https://courier.mjm.now.sh/api/",
        clientId: "8c0TcS4ucF3PIPiqDY7FNYx1DE2jx9hL",
        domain: "courier-staging.auth0.com"
    )

    static let production = Endpoint(
        url: "https://courier.blog",
        apiIdentifier: "https://courier.blog/api/",
        clientId: "zG8153IA65HklO6ctzcWSRJAg6xe3SlO",
        domain: "courier-prod.auth0.com"
    )

    static let current: Endpoint = .staging
}
