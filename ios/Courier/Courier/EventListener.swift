import Combine
import Foundation
import os
import PusherSwift
import Relay

private let logger = Logger(subsystem: "blog.courier.Courier", category: "push")

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
        logger.debug("Reconnect")
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
        logger.debug("Connect")
        pusher.connect()

        self.pusher = pusher
        resubscribe()
    }

    private func resubscribe() {
        guard let pusher = pusher, let userID = userID else {
            return
        }

        let channelName = "private-events-\(userID.replacingOccurrences(of: "|", with: "_"))"
        logger.debug("Resubscribe:  \(channelName)")
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

        logger.debug("Register handler:  \(eventName)")
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
                logger.error("Event decode failure:  \(eventName)  \(error as NSError)")
            }
        }
    }
}

extension EventListener: PusherDelegate {
    func debugLog(message: String) {
        logger.debug("\(message, privacy: .public)")
    }

    func subscribedToChannel(name: String) {
        logger.debug("Subscribed:  \(name)")
    }

    func changedConnectionState(from old: ConnectionState, to new: ConnectionState) {
        logger.debug("Connection state transition:  \(old.stringValue()) -> \(new.stringValue())")
    }

    func failedToSubscribeToChannel(name: String, response: URLResponse?, data: String?, error: NSError?) {
        if let error = error {
            logger.error("Subscribe failure:  \(name)  \(error as NSError)")
        } else {
            logger.error("Subscribe failure:  \(name)")
        }
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
                logger.error("Credentials failure:  \(error as NSError)")
                completionHandler(nil)
            } else {
                var request = URLRequest(url: self.endpoint.pusherAuthURL)
                request.httpMethod = "POST"
                request.httpBody = "socket_id=\(socketID)&channel_name=\(channelName)".data(using: .utf8)
                request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
                request.setValue("Bearer \(creds?.accessToken ?? "")", forHTTPHeaderField: "Authorization")

                let task = URLSession.shared.dataTask(with: request) { data, response, error in
                    if let error = error {
                        logger.error("Auth failure: \(error as NSError)")
                        completionHandler(nil)
                        return
                    }

                    guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                        logger.error("Auth failure: unexpected status code for auth token request")
                        completionHandler(nil)
                        return
                    }

                    guard let data = data else {
                        logger.error("Auth failure: nil data for auth token request")
                        completionHandler(nil)
                        return
                    }

                    do {
                        let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)
                        completionHandler(PusherAuth(auth: authResponse.auth))
                    } catch {
                        logger.error("Auth failure: \(error as NSError)")
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
