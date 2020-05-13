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
    @Fragment(SubscriptionSection_user.self) var user

    init(user: SubscriptionSection_user.Key) {
        self.user = user
    }

    var body: some View {
        Group {
            if $user == nil {
                EmptyView()
            } else {
                if $user!.subscription == nil && $user!.subscriptionStatusOverride == nil {
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
        let status = $user!.subscription?.status ?? $user!.subscriptionStatusOverride!
        return Group {
            if status == .active {
                activeSubscriptionView
            }
        }
    }

    var activeSubscriptionView: some View {
        Group {
            if $user!.subscription != nil {
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
                        Text(verbatim: "\($user!.subscription!.periodEnd.asDate!, relativeTo: Date())")
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
