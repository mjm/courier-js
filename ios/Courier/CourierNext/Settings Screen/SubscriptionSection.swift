import SwiftUI
import RelaySwiftUI

private let userFragment = graphql("""
fragment SubscriptionSection_user on Viewer {
  customer {
    creditCard {
      brand
      lastFour
    }
  }
  subscription {
    status
    periodEnd
  }
  subscriptionStatusOverride
}
""")

struct SubscriptionSection: View {
    let user: SubscriptionSection_user_Key

    var body: some View {
        RelayFragment(fragment: SubscriptionSection_user(), key: user, content: Content.init)
    }

    struct Content: View {
        let data: SubscriptionSection_user.Data?

        var body: some View {
            Group {
                if data == nil {
                    EmptyView()
                } else {
                    if data!.subscription == nil && data!.subscriptionStatusOverride == nil {
                        Section(
                            footer: Text("Posting imported tweets to Twitter requires an active subscription.")
                        ) {
                            Button("Subscribe to Courier") {}
                        }
                    }

                    subscriptionStatusView
                }
            }
        }

        var subscriptionStatusView: some View {
            let status = data!.subscription?.status ?? data!.subscriptionStatusOverride!
            return Group {
                if status == .active {
                    activeSubscriptionView
                }
            }
        }

        var activeSubscriptionView: some View {
            Group {
                if data!.subscription != nil {
                    Section(
                        header: Text("YOUR SUBSCRIPTION"),
                        footer: Text("If you cancel, you can keep using Courier until your existing subscription expires.")
                    ) {
                        HStack{
                            Text("Status")
                            Spacer()
                            Text("Active")
                                .foregroundColor(.secondary)
                        }
                        HStack {
                            Text("Renews")
                            Spacer()
                            Text(verbatim: "\(data!.subscription!.periodEnd.asDate!, relativeTo: Date())")
                                .foregroundColor(.secondary)
                        }
                        Button(action: {}, label: {
                            HStack {
                                Spacer()
                                Text("Cancel Subscription")
                                Spacer()
                            }
                        })
                    }
                } else {
                    Section(
                        header: Text("YOUR SUBSCRIPTION"),
                        footer: Text("You are subscribed indefinitely.")
                    ) {
                        HStack{
                            Text("Status")
                            Spacer()
                            Text("Active")
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
        }
    }
}
