import Combine
import SwiftUI
import CourierGenerated

class ScreenCoordinator: ObservableObject {
    @Published var filter: TweetFilter? = .upcoming
    @Published var selectedTweetID: String?
}
