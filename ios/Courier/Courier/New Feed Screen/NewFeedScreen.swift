import SwiftUI
import RelaySwiftUI
import CourierGenerated

struct NewFeedScreen: View {
    @State private var inputURL = ""
    @State private var watchURL = ""
    @State private var canSave = false

    @Binding var isPresented: Bool

    @Mutation<AddFeedMutation> var addFeed

    var body: some View {
        Form {
            Section(footer: Text("This can be either a web page URL or a feed URL.")) {
                TextField("URL", text: $inputURL, onCommit: {
                    watchURL = inputURL
                })
                .textContentType(.URL)
                .keyboardType(.URL)
                .disableAutocorrection(true)
                .autocapitalization(.none)
            }

            FeedPreviewContent(url: watchURL, canSave: $canSave)
        }
        .navigationTitle("Watch New Feed")
        .navigationBarItems(
            trailing: Button {
                addFeed.commit(url: watchURL) { _ in
                    isPresented = false
                }
            } label: {
                Text("Save")
                    .fontWeight(.bold)
            }
            .disabled(addFeed.isInFlight || !canSave)
        )
    }
}

struct NewFeedScreen_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            NewFeedScreen(isPresented: .constant(true))
                .navigationBarTitleDisplayMode(.inline)
        }
    }
}
