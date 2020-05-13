import Auth0
import Combine
import Relay
import SwiftUI
import struct SwiftUI.Environment

struct EnvironmentProvider<Content: View>: View {
    @Environment(\.credentials) var credentials: Auth0.Credentials

    let content: () -> Content

    private let store = Store(source: DefaultRecordSource())

    var body: some View {
        Group {
            if credentials.accessToken != nil {
                content().environment(\.relayEnvironment, Relay.Environment(
                    network: MyNetwork(credentials: credentials, endpoint: Endpoint.current),
                    store: store))
            } else {
                Text("Credentials aren't valid, they don't have an access token.")
            }
        }
    }
}

let store = Store(source: DefaultRecordSource())

//let environment = Environment(
//    network: MyNetwork(),
//    store: store
//)

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

        return URLSession.shared.dataTaskPublisher(for: req)
            .map { $0.data }
            .mapError { $0 as Error }
//            .handleEvents(receiveOutput: { print(String(data: $0, encoding: .utf8)!) })
            .eraseToAnyPublisher()
    }
}

struct RequestPayload: Encodable {
    var query: String
    var operationName: String
    var variables: VariableData
}
