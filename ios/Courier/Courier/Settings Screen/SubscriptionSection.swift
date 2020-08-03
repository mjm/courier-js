import SwiftUI
import RelaySwiftUI
import CourierGenerated

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
    @Fragment<SubscriptionSection_user> var user

    var body: some View {
        if let user = user {
            if user.subscription == nil && user.subscriptionStatusOverride == nil {
                Section(
                    footer: Text("Posting imported tweets to Twitter requires an active subscription.")
                ) {
                    Button("Subscribe to Courier") {}
                }
            } else {
                subscriptionStatusView(user)
            }
        } else {
            EmptyView()
        }
    }

    @ViewBuilder func subscriptionStatusView(_ user: SubscriptionSection_user.Data) -> some View {
        let status = user.subscription?.status ?? user.subscriptionStatusOverride!
        if status == .active {
            activeSubscriptionView(user)
        }
    }

    @ViewBuilder func activeSubscriptionView(_ user: SubscriptionSection_user.Data) -> some View {
        if let subscription = user.subscription {
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
                    (Text("in ") + Text(subscription.periodEnd.asDate!, style: .relative))
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
