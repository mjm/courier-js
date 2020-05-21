import SwiftUI

private let allEnvironments = ["production", "staging"]

struct EnvironmentSection: View {
    @Environment(\.endpoint) var endpoint
    @Binding var isPresented: Bool

    var body: some View {
        Section {
            Picker("Environment", selection: environmentBinding) {
                ForEach(allEnvironments, id: \.self) { Text($0) }
            }
        }
    }

    var environmentBinding: Binding<String> {
        Binding(
            get: { self.endpoint.environment },
            set: { newValue in
                self.isPresented = false
                UserDefaults.standard.siteEnvironment = newValue
            }
        )
    }
}
