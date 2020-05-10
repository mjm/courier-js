import Auth0

extension CredentialsManager {
    static let shared: CredentialsManager = CredentialsManager(
        authentication: Endpoint.current.authentication,
        storeKey: Endpoint.environment
    )
}
