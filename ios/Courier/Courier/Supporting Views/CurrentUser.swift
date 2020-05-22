import Auth0
import Combine
import PushNotifications
import SwiftUI

struct CurrentUser<Content: View>: View {
    @Environment(\.endpoint) var endpoint
    @ObservedObject private var authContext: AuthContext
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
        self.authContext = AuthContext()
    }

    var body: some View {
        authContext.startIfNeeded(endpoint: self.endpoint)
        return Group {
            if authContext.isLoggedIn {
                content.environmentObject(authContext)
            } else if authContext.didLoginFail {
                ErrorView(error: authContext.error!) {
                    self.authContext.login()
                }
            } else if authContext.isLoggingIn {
                LoadingView(text: "Logging in…")
            } else if authContext.isLoginNeeded {
                VStack(spacing: 12) {
                    Text("Welcome to Courier")
                        .font(.title)
                    Button(action: { self.authContext.login() }) {
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

class AuthContext: ObservableObject {
    private enum AuthState {
        case unstarted
        // Initial state: we haven't figured out if the user has credentials or not, so
        // we don't want to prompt them into a particular action yet.
        case started
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
        case loggedIn(Auth0.Credentials, Auth0.UserInfo)
    }

    private var endpoint: Endpoint! {
        didSet {
            credentialsManager = CredentialsManager(authentication: endpoint.authentication, storeKey: endpoint.environment)
            beamsTokenProvider = BeamsTokenProvider(authURL: endpoint.pusherAuthURL.absoluteString) {
                var token = ""
                let sema = DispatchSemaphore(value: 0)

                self.credentialsManager.credentials { error, creds in
                    if let error = error {
                        NSLog("failed to get credentials for push notifications: \(error)")
                    } else if let creds = creds {
                        token = creds.accessToken ?? ""
                    }
                    sema.signal()
                }

                sema.wait()

                let headers = ["Authorization": "Bearer \(token)"]
                return AuthData(headers: headers, queryParams: [:])
            }
        }
    }
    var credentialsManager: CredentialsManager!
    private var beamsTokenProvider: BeamsTokenProvider!

    private var state: AuthState = .unstarted {
        willSet {
            objectWillChange.send()
        }
    }

    fileprivate var isLoggedIn: Bool {
        if case .loggedIn = state {
            return true
        }
        return false
    }

    fileprivate var didLoginFail: Bool {
        if case .loginFailed = state {
            return true
        }
        return false
    }

    fileprivate var isLoginNeeded: Bool {
        if case .loginNeeded = state {
            return true
        }
        return false
    }

    fileprivate var isLoggingIn: Bool {
        if case .loggingIn = state {
            return true
        }
        return false
    }

    fileprivate var error: Error? {
        if case .loginFailed(let error) = state {
            return error
        }
        return nil
    }

    var credentials: Auth0.Credentials? {
        if case .loggedIn(let credentials, _) = state {
            return credentials
        }
        return nil
    }

    var userInfo: Auth0.UserInfo? {
        if case .loggedIn(_, let userInfo) = state {
            return userInfo
        }
        return nil
    }

    func logout() {
        endpoint.webAuth.clearSession(federated: false) { result in
            DispatchQueue.main.async {
                _ = self.credentialsManager.clear()
                self.endpoint.pushNotifications.clearAllState { }
                self.state = .loginNeeded
            }
        }
    }

    fileprivate func startIfNeeded(endpoint: Endpoint) {
        if let currentEndpoint = self.endpoint, endpoint.environment != currentEndpoint.environment {
            state = .unstarted
        }

        if case .unstarted = state {
            self.state = .started
            self.endpoint = endpoint
            getExistingCredentials()
        }
    }

    private func getExistingCredentials() {
        credentialsManager.credentials { error, creds in
            DispatchQueue.main.async {
                if let error = error {
                    NSLog("Could not load existing credentials: \(error)")
                    self.state = .loginNeeded
                } else if let creds = creds {
                    self.setLoggedIn(with: creds)
                } else {
                    self.state = .loginNeeded
                }
            }
        }
    }

    fileprivate func login() {
        state = .loggingIn
        endpoint.webAuth
            .logging(enabled: true)
            .scope("offline_access openid profile email https://courier.blog/customer_id https://courier.blog/subscription_id")
            .audience(endpoint.apiIdentifier)
            .start { result in
                DispatchQueue.main.async { self.handleLoginResult(result) }
            }
    }

    private func handleLoginResult(_ result: Auth0.Result<Auth0.Credentials>) {
        switch result {
        case .failure(error: let error):
            state = .loginFailed(error)
        case .success(result: let creds):
            process(credentials: creds)
        }
    }

    private func process(credentials: Auth0.Credentials) {
        guard credentialsManager.store(credentials: credentials) else {
            state = .loginFailed(AuthError.storeCredsFailed)
            return
        }

        setLoggedIn(with: credentials)
    }

    private func setLoggedIn(with credentials: Auth0.Credentials) {
        endpoint.authentication.userInfo(withAccessToken: credentials.accessToken!).start { result in
            DispatchQueue.main.async {
                switch result {
                case .failure(error: let error):
                    self.state = .loginFailed(error)
                case .success(result: let userInfo):
                    NSLog("user info: name=\(userInfo.name ?? "<none>") nickname=\(userInfo.nickname ?? "<none>")")
                    self.endpoint.pushNotifications.setUserId(userInfo.sub, tokenProvider: self.beamsTokenProvider) { error in
                        if let error = error {
                            NSLog("failed to set user ID for push notifications: \(error)")
                        } else {
                            NSLog("set user ID for push notifications")
                        }
                    }
                    self.state = .loggedIn(credentials, userInfo)
                }
            }
        }
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
