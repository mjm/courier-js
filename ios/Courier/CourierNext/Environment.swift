import Auth0
import Combine
import Relay
import SwiftUI
import struct SwiftUI.Environment

struct EnvironmentProvider<Content: View>: View {
    @Environment(\.endpoint) var endpoint
    @Environment(\.credentials) var credentials

    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        Group {
            if credentials.accessToken != nil {
                content.relayEnvironment(Relay.Environment(
                    network: MyNetwork(credentials: credentials, endpoint: endpoint),
                    store: Store(source: DefaultRecordSource())))
            } else {
                Text("Credentials aren't valid, they don't have an access token.")
            }
        }
    }
}

class MyNetwork: Network {
    let credentials: Auth0.Credentials
    let endpoint: Endpoint

    init(credentials: Auth0.Credentials, endpoint: Endpoint) {
        self.credentials = credentials
        self.endpoint = endpoint
    }

    func execute(request: RequestParameters, variables: VariableData, cacheConfig: CacheConfig) -> AnyPublisher<Data, Error> {
        var req = URLRequest(url: endpoint.url)
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
    }
}

struct RequestPayload: Encodable {
    var query: String
    var operationName: String
    var variables: VariableData
}
