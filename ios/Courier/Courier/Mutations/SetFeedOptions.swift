import RelaySwiftUI
import CourierGenerated

private let mutation = graphql("""
mutation SetFeedOptionsMutation($input: SetFeedOptionsInput!) {
  setFeedOptions(input: $input) {
    feed {
      id
      autopost
    }
  }
}
""")

extension Mutation.Mutator where Operation == SetFeedOptionsMutation {
    func commit(id: String, autopost: Bool) {
        commit(
            variables: .init(input: .init(id: id, autopost: autopost)),
            optimisticResponse: [
                "setFeedOptions": [
                    "feed": [
                        "id": id,
                        "autopost": autopost,
                    ],
                ],
            ]
        )
    }
}
