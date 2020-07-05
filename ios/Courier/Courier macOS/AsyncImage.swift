import SwiftUI
import Combine

struct AsyncImage<Placeholder: View>: View {
    let url: URL
    private let placeholder: Placeholder?

    init(url: URL, placeholder: Placeholder? = nil) {
        self.url = url
        self.placeholder = placeholder
    }

    var body: some View {
        placeholder
    }
}
