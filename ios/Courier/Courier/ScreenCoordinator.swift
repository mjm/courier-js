import Combine
import SwiftUI

class ScreenCoordinator: ObservableObject {
    @Published var filter: TweetFilter? = .upcoming
    @Published var selectedTweetID: String?
}
