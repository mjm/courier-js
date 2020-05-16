import Auth0
import Foundation
import PushNotifications

struct Endpoint {
    var environment: String
    var url: URL
    var apiIdentifier: String
    var webAuth: WebAuth
    var authentication: Authentication
    var pushNotifications: PushNotifications

    init(environment: String,
         url: String,
         apiIdentifier: String,
         clientId: String,
         domain: String,
         beamInstanceId: String
    ) {
        self.environment = environment
        self.url = URL(string: url)!
        self.apiIdentifier = apiIdentifier
        self.webAuth = Auth0.webAuth(clientId: clientId, domain: domain)
        self.authentication = Auth0.authentication(clientId: clientId, domain: domain)
        self.pushNotifications = PushNotifications(instanceId: beamInstanceId)
    }

    static let staging = Endpoint(
        environment: "staging",
        url: "https://al8c1ew7lc.execute-api.us-east-2.amazonaws.com/staging/graphql",
        apiIdentifier: "https://courier.mjm.now.sh/api/",
        clientId: "8c0TcS4ucF3PIPiqDY7FNYx1DE2jx9hL",
        domain: "courier-staging.auth0.com",
        beamInstanceId: "d644cf81-b5bd-4e54-b1b8-2ff495e0d0ef"
    )

    static let production = Endpoint(
        environment: "production",
        url: "https://coxrrpuv3e.execute-api.us-east-2.amazonaws.com/production/graphql",
        apiIdentifier: "https://courier.blog/api/",
        clientId: "zG8153IA65HklO6ctzcWSRJAg6xe3SlO",
        domain: "courier-prod.auth0.com",
        beamInstanceId: "b608001a-0722-48e3-a2b3-1b2a7b2d6fed"
    )

    static var current: Endpoint {
        UserDefaults.standard.siteEnvironment == "staging" ? .staging : .production
    }

    var pusherAuthURL: URL {
        URL(string: url.absoluteString.replacingOccurrences(of: "graphql", with: "pusherauth"))!
    }
}
