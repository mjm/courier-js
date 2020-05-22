import Combine
import SwiftUI

struct WithCurrentEndpoint<Content: View>: View {
    @ObservedObject private var observer = CurrentEndpointObserver()
    let content: () -> Content

    init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content
    }

    var body: some View {
        content().environment(\.endpoint, observer.currentEndpoint)
    }
}

extension UserDefaults {
    @objc var siteEnvironment: String {
        get {
            string(forKey: "siteEnvironment")!
        }
        set {
            set(newValue, forKey: "siteEnvironment")
        }
    }
}

struct EndpointEnvironmentKey: EnvironmentKey {
    static let defaultValue = Endpoint.production
}

extension EnvironmentValues {
    var endpoint: Endpoint {
        get { self[EndpointEnvironmentKey.self] }
        set { self[EndpointEnvironmentKey.self] = newValue }
    }
}

private class CurrentEndpointObserver: ObservableObject {
    var currentEndpoint: Endpoint {
        if UserDefaults.standard.string(forKey: "siteEnvironment") == "production" {
            return .production
        } else {
            return .staging
        }
    }

    var cancellable: AnyCancellable?

    init() {
        cancellable = UserDefaults.standard.publisher(for: \.siteEnvironment)
            .sink { [weak self] _ in
                self?.objectWillChange.send()
            }
    }
}
