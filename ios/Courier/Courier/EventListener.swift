import Combine
import Foundation
import PusherSwift
import Relay

class EventListener {
    static let shared = EventListener()

    var endpoint: Endpoint? {
        didSet {
            if (endpoint?.environment ?? "") != (oldValue?.environment ?? "") {
                reconnect()
            }
        }
    }
    var userID: String? {
        didSet {
            if userID != oldValue {
                resubscribe()
            }
        }
    }
    var environment: Environment?

    private var pusher: Pusher?
    private var eventsChannel: PusherChannel?

    private func reconnect() {
        NSLog("Reconnect event listener")
        eventsChannel = nil
        pusher?.disconnect()
        pusher = nil

        guard let endpoint = endpoint else {
            return
        }

        let authorizer = Authorizer(endpoint: endpoint)
        let options = PusherClientOptions(
            authMethod: AuthMethod.authorizer(authorizer: authorizer),
            autoReconnect: true,
            host: .cluster("us2"))

        let pusher = Pusher(key: endpoint.pusherAppKey, options: options)
        pusher.delegate = self
        NSLog("Connecting event listener")
        pusher.connect()

        self.pusher = pusher
        resubscribe()
    }

    private func resubscribe() {
        guard let pusher = pusher, let userID = userID else {
            return
        }

        let channelName = "private-events-\(userID.replacingOccurrences(of: "|", with: "_"))"
        NSLog("Resubscribing to events on channel \(channelName)")
        eventsChannel = pusher.subscribe(channelName)

        registerEventHandler(handleTweetPosted)
        registerEventHandler(handleTweetCanceled)
        registerEventHandler(handleTweetUncanceled)
        registerEventHandler(handleTweetEdited)
        registerEventHandler(handleFeedRefreshed)
    }

    private func registerEventHandler<Event: Decodable>(_ handler: @escaping (Environment, Event) -> AnyPublisher<Never, Error>) {
        var eventName = String(describing: Event.self)
        if eventName.hasSuffix("Event") {
            eventName = String(eventName.prefix(eventName.count - 5))
        }

        NSLog("Registering handler for \(eventName) events")
        eventsChannel!.bind(eventName: eventName) { [weak self] (pusherEvent: PusherEvent) in
            guard let environment = self?.environment else {
                return
            }

            let data = pusherEvent.data?.data(using: .utf8) ?? Data()
            do {
                let event = try JSONDecoder().decode(Event.self, from: data)
                var cancellable: AnyCancellable?
                cancellable = handler(environment, event).sink(receiveCompletion: { _ in
                    cancellable?.cancel()
                    cancellable = nil
                }, receiveValue: { _ in })
            } catch {
                NSLog("Failed to decode \(eventName) event: \(error)")
            }
        }
    }
}

extension EventListener: PusherDelegate {
    func debugLog(message: String) {
        NSLog("\(message)")
    }

    func subscribedToChannel(name: String) {
        NSLog("Subscribed to channel \(name)")
    }

    func changedConnectionState(from old: ConnectionState, to new: ConnectionState) {
        NSLog("Connection state changed from \(old.stringValue()) to \(new.stringValue())")
    }

    func failedToSubscribeToChannel(name: String, response: URLResponse?, data: String?, error: NSError?) {
        NSLog("Failed to subscribe to channel \(name)")
    }
}


private class Authorizer: PusherSwift.Authorizer {
    let endpoint: Endpoint

    init(endpoint: Endpoint) {
        self.endpoint = endpoint
    }

    func fetchAuthValue(socketID: String, channelName: String, completionHandler: @escaping (PusherAuth?) -> ()) {
        endpoint.credentialsManager.credentials { error, creds in
            if let error = error {
                NSLog("Error reading credentials for push event listener: \(error)")
                completionHandler(nil)
            } else {
                var request = URLRequest(url: self.endpoint.pusherAuthURL)
                request.httpMethod = "POST"
                request.httpBody = "socket_id=\(socketID)&channel_name=\(channelName)".data(using: .utf8)
                request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
                request.setValue("Bearer \(creds?.accessToken ?? "")", forHTTPHeaderField: "Authorization")

                let task = URLSession.shared.dataTask(with: request) { data, response, error in
                    if let error = error {
                        NSLog("Error requesting pusher auth token: \(error)")
                        completionHandler(nil)
                        return
                    }

                    guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                        NSLog("Did not get a 200 response fetching Pusher auth token")
                        completionHandler(nil)
                        return
                    }

                    guard let data = data else {
                        NSLog("Got nil data fetching pusher auth token")
                        completionHandler(nil)
                        return
                    }

                    do {
                        let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)
                        completionHandler(PusherAuth(auth: authResponse.auth))
                    } catch {
                        NSLog("Error decoding Pusher auth response: \(error)")
                        completionHandler(nil)
                    }
                }

                task.resume()
            }
        }
    }
}

private struct AuthResponse: Decodable {
    var auth: String
}
