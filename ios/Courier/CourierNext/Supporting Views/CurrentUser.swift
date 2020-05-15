import Auth0
import Combine
import SwiftUI

struct CurrentUser<Content: View>: View {
    @Environment(\.endpoint) var endpoint
    @ObservedObject private var userLoader: CurrentUserLoader
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
        self.userLoader = CurrentUserLoader()
    }

    var body: some View {
        self.userLoader.startIfNeeded(endpoint: self.endpoint)
        return Group {
            if userLoader.isLoggedIn {
                content
                    .environment(\.credentials, userLoader.credentials!)
                    .environment(\.authActions, userLoader.authActions)
            } else if userLoader.didLoginFail {
                ErrorView(error: userLoader.error!) {
                    self.userLoader.login()
                }
            } else if userLoader.isLoggingIn {
                LoadingView(text: "Logging in…")
            } else if userLoader.isLoginNeeded {
                VStack(spacing: 12) {
                    Text("Welcome to Courier")
                        .font(.title)
                    Button(action: { self.userLoader.login() }) {
                        Text("Log In")
                            .fontWeight(.bold)
                    }
                }
            } else {
                LoadingView()
            }
        }
    }
}

struct AuthActions {
    let logout: () -> Void
}

struct CredentialsEnvironmentKey: EnvironmentKey {
    static let defaultValue = Auth0.Credentials()
}

struct AuthActionsEnvironmentKey: EnvironmentKey {
    static let defaultValue = AuthActions(logout: {})
}

extension EnvironmentValues {
    var credentials: Auth0.Credentials {
        get { self[CredentialsEnvironmentKey.self] }
        set { self[CredentialsEnvironmentKey.self] = newValue }
    }
    var authActions: AuthActions {
        get { self[AuthActionsEnvironmentKey.self] }
        set { self[AuthActionsEnvironmentKey.self] = newValue }
    }
}

private class CurrentUserLoader: ObservableObject {
    enum AuthState {
        // Initial state: we haven't figured out if the user has credentials or not, so
        // we don't want to prompt them into a particular action yet.
        case unknown
        // We've checked for credentials and don't have any, so we want to prompt the user
        // to log in.
        case loginNeeded
        // The user has initiated a login process and it hasn't completed yet. We want to
        // show some kind of progress indicator.
        case loggingIn
        // The user attempted a login and it failed.
        case loginFailed(Error)
        // The user has successfully logged in and we've stored the credentials. The rest of
        // the app should be ready to use.
        case loggedIn(Auth0.Credentials)
    }

    var endpoint: Endpoint! {
        didSet {
            credentialsManager = CredentialsManager(authentication: endpoint.authentication, storeKey: endpoint.environment)
        }
    }
    var credentialsManager: CredentialsManager!

    var state: AuthState = .unknown {
        willSet {
            objectWillChange.send()
        }
    }

    var isLoggedIn: Bool {
        if case .loggedIn = state {
            return true
        }
        return false
    }

    var didLoginFail: Bool {
        if case .loginFailed = state {
            return true
        }
        return false
    }

    var isLoginNeeded: Bool {
        if case .loginNeeded = state {
            return true
        }
        return false
    }

    var isLoggingIn: Bool {
        if case .loggingIn = state {
            return true
        }
        return false
    }

    var error: Error? {
        if case .loginFailed(let error) = state {
            return error
        }
        return nil
    }

    var credentials: Auth0.Credentials? {
        if case .loggedIn(let credentials) = state {
            return credentials
        }
        return nil
    }

    var authActions: AuthActions {
        return AuthActions(logout: self.logout)
    }

    func logout() {
        endpoint.webAuth.clearSession(federated: false) { result in
            DispatchQueue.main.async {
                _ = self.credentialsManager.clear()
                self.state = .loginNeeded
            }
//                Endpoint.current.pushNotifications.clearAllState {
//                    promise(.success(()))
//                }
        }
    }

    func startIfNeeded(endpoint: Endpoint) {
        if let currentEndpoint = self.endpoint, endpoint.environment != currentEndpoint.environment {
            state = .unknown
        }

        if case .unknown = state {
            self.endpoint = endpoint
            getExistingCredentials()
        }
    }

    func getExistingCredentials() {
        credentialsManager.credentials { error, creds in
            DispatchQueue.main.async {
                if let error = error {
                    NSLog("Could not load existing credentials: \(error)")
                    self.state = .loginNeeded
                } else if let creds = creds {
                    self.state = .loggedIn(creds)
                } else {
                    self.state = .loginNeeded
                }
            }
        }
    }

    func login() {
        state = .loggingIn
        endpoint.webAuth
            .logging(enabled: true)
            .scope("offline_access openid profile email https://courier.blog/customer_id https://courier.blog/subscription_id")
            .audience(endpoint.apiIdentifier)
            .start { result in
                DispatchQueue.main.async { self.handleLoginResult(result) }
            }
    }

    func handleLoginResult(_ result: Auth0.Result<Auth0.Credentials>) {
        switch result {
        case .failure(error: let error):
            state = .loginFailed(error)
        case .success(result: let creds):
            process(credentials: creds)
        }
    }

    func process(credentials: Auth0.Credentials) {
        guard credentialsManager.store(credentials: credentials) else {
            state = .loginFailed(AuthError.storeCredsFailed)
            return
        }

        state = .loggedIn(credentials)
    }
}

enum AuthError: LocalizedError {
    case storeCredsFailed

    var errorDescription: String? {
        "Login Error"
    }

    var failureReason: String? {
        switch self {
        case .storeCredsFailed:
            return "Could not store credentials in the keychain."
        }
    }
}
