import SwiftUI
import RelaySwiftUI

private let query = graphql("""
query TweetsScreenQuery($filter: TweetFilter!) {
  viewer {
    ...TweetsList_tweets @arguments(filter: $filter)
  }
}
""")

struct TweetsScreen: View {
    @State private var selectedTag = 0

    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                Picker(selection: $selectedTag, label: EmptyView()) {
                    Text("Upcoming").tag(0)
                    Text("Past").tag(1)
                }
                    .pickerStyle(SegmentedPickerStyle())
                    .padding()

                Divider()

                RelayQuery(
                    op: TweetsScreenQuery(),
                    variables: .init(filter: selectedTag == 0 ? .upcoming : .past),
                    loadingContent: Text("Loading…"),
                    errorContent: { Text($0.localizedDescription) },
                    dataContent: { data in
                        Group {
                            if data == nil {
                                EmptyView()
                            } else {
                                TweetsList(tweets: data!.viewer!)
                            }
                        }
                    }
                ).frame(maxHeight: .infinity)
            }.navigationBarTitle("Tweets", displayMode: .inline)
        }
    }
}

struct TweetsScreen_Previews: PreviewProvider {
    static var previews: some View {
        TweetsScreen()
    }
}
