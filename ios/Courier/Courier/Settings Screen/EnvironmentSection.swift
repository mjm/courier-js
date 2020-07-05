import SwiftUI
import RelaySwiftUI

private let allEnvironments = ["production", "staging"]

struct EnvironmentSection: View {
    @CurrentEndpoint var endpoint
    @Binding var isPresented: Bool

    var body: some View {
        Section(header: Text("Developer Settings").padding(.top, 44)) {
            Picker("Environment", selection: environmentBinding) {
                ForEach(allEnvironments, id: \.self) { Text($0) }
            }
            #if os(iOS)
            NavigationLink("Inspect Relay Store", destination: RelaySwiftUI.Inspector())
            #endif
        }.onChange(of: endpoint.environment) { newValue in
            if newValue != endpoint.environment {
                isPresented = false
            }
        }
    }

    var environmentBinding: Binding<String> {
        Binding(
            get: { endpoint.environment },
            set: { newValue in
                isPresented = false
                DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(100)) {
                    endpoint = newValue == "production" ? .production : .staging
                }
            }
        )
    }
}
