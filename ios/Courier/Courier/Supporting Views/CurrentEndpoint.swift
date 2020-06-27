import Combine
import SwiftUI

@propertyWrapper
struct CurrentEndpoint: DynamicProperty {
    @AppStorage("siteEnvironment") var environment = "production"

    var wrappedValue: Endpoint {
        get {
            if environment == "production" {
                return .production
            } else {
                return .staging
            }
        }
        nonmutating set {
            environment = newValue.environment
        }
    }

    var projectedValue: Binding<Endpoint> {
        Binding {
            wrappedValue
        } set: { newValue in
            wrappedValue = newValue
        }
    }
}
