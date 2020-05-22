import Auth0
import Combine
import Relay
import SwiftUI
import struct SwiftUI.Environment

struct EnvironmentProvider<Content: View>: View {
    @Environment(\.endpoint) var endpoint
    @EnvironmentObject var authContext: AuthContext

    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        content.relayEnvironment(createEnvironment())
    }

    func createEnvironment() -> Relay.Environment {
        let environment = Relay.Environment(
            network: Network(credentialsManager: authContext.credentialsManager, endpoint: endpoint),
            store: Store(source: DefaultRecordSource()))

        NotificationHandler.shared.environment = environment

        return environment
    }
}

class Network: Relay.Network {
    let credentialsManager: CredentialsManager
    let endpoint: Endpoint

    init(credentialsManager: CredentialsManager, endpoint: Endpoint) {
        self.credentialsManager = credentialsManager
        self.endpoint = endpoint
    }

    func execute(request: RequestParameters, variables: VariableData, cacheConfig: CacheConfig) -> AnyPublisher<Data, Error> {
        return Future<Credentials, Error> { promise in
            self.credentialsManager.credentials { error, creds in
                if let error = error {
                    promise(.failure(error as Error))
                } else {
                    promise(.success(creds!))
                }
            }
        }.flatMap { credentials -> AnyPublisher<Data, Error> in
            var req = URLRequest(url: self.endpoint.url)
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.httpMethod = "POST"
            req.setValue("Bearer \(credentials.accessToken!)", forHTTPHeaderField: "Authorization")

            do {
                let payload = RequestPayload(query: request.text ?? "", operationName: request.name, variables: variables)
                req.httpBody = try JSONEncoder().encode(payload)
            } catch {
                return Fail(error: error).eraseToAnyPublisher()
            }

            NSLog("Executing \(request.operationKind) \(request.name)")
            return URLSession.shared.dataTaskPublisher(for: req)
                .map { $0.data }
                .mapError { $0 as Error }
                .handleEvents(receiveOutput: { _ in
                    NSLog("Received response for \(request.operationKind) \(request.name)")
                })
                .eraseToAnyPublisher()
        }.eraseToAnyPublisher()
    }
}

struct RequestPayload: Encodable {
    var query: String
    var operationName: String
    var variables: VariableData
}
