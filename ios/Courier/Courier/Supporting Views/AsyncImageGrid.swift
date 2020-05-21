import SwiftUI

struct AsyncImageGrid<Placeholder: View>: View {
    let urls: [URL]
    let placeholder: () -> Placeholder

    var body: some View {
        Group {
            if urls.isEmpty {
                EmptyView()
            } else {
                VStack {
                    ForEach(urls, id: \.self) { url in
                        AsyncImage(url: url, placeholder: self.placeholder())
                            .aspectRatio(contentMode: .fit)
                            .cornerRadius(8)
                    }
                }
            }
        }
    }
}

struct AsyncImageGrid_Previews: PreviewProvider {
    static var previews: some View {
        AsyncImageGrid(urls: [
            URL(string: "https://cdn.sanity.io/images/u6863i7d/production/e6ffdba1019f35fb50a70f77f54ad91e60428dbe-1080x810.jpg?w=1013&h=760&fit=crop")!
        ], placeholder: { Image(systemName: "photo").font(.system(size: 30)) })
    }
}
