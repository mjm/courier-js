import Auth0
import Combine
import SwiftUI

struct CurrentUser<Content: View>: View {
    @ObservedObject private var userLoader: CurrentUserLoader

    let content: () -> Content

    init(content: @escaping () -> Content) {
        self.content = content
        self.userLoader = CurrentUserLoader()
    }

    var body: some View {
        Group {
            if userLoader.isLoggedIn {
                content().environment(\.credentials, userLoader.credentials!)
            } else if userLoader.didLoginFail {
                Text(userLoader.error!.localizedDescription)
            } else if userLoader.isLoggingIn {
                // TODO use a spinner
                Text("Logging in…")
            } else if userLoader.isLoginNeeded {
                VStack {
                    Text("You are not logged in yet.")
                    Button("Log In") { self.userLoader.login() }
                }
            } else {
                // TODO this should probably be a spinner
                EmptyView()
            }
        }.onAppear { self.userLoader.start() }
    }
}

struct CredentialsEnvironmentKey: EnvironmentKey {
    static let defaultValue = Auth0.Credentials()
}

extension EnvironmentValues {
    var credentials: Auth0.Credentials {
        get { self[CredentialsEnvironmentKey.self] }
        set { self[CredentialsEnvironmentKey.self] = newValue }
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

    @Published var state: AuthState = .unknown

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

    func start() {
        if case .unknown = state {
            getExistingCredentials()
        }
    }

    func getExistingCredentials() {
        CredentialsManager.shared.credentials { error, creds in
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
        Endpoint.current.webAuth.logging(enabled: true).start { result in
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
        guard CredentialsManager.shared.store(credentials: credentials) else {
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
