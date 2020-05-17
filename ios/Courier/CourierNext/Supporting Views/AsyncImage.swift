import SwiftUI
import Combine

struct AsyncImage<Placeholder: View>: View {
    @ObservedObject private var loader: ImageLoader
    @Environment(\.imageCache) var cache: ImageCache
    private let placeholder: Placeholder?

    init(url: URL, placeholder: Placeholder? = nil) {
        loader = ImageLoader(url: url)
        self.placeholder = placeholder
    }

    var body: some View {
        loader.load(cache: cache)
        return image
    }

    private var image: some View {
        Group {
            if loader.image != nil {
                Image(uiImage: loader.image!)
                    .resizable()
            } else {
                placeholder
            }
        }
    }
}

struct AsyncImage_Previews: PreviewProvider {
    static var previews: some View {
        AsyncImage(
            url: URL(string: "https://cdn.sanity.io/images/u6863i7d/production/e6ffdba1019f35fb50a70f77f54ad91e60428dbe-1080x810.jpg?w=1013&h=760&fit=crop")!,
            placeholder: Text("Loading image…")
        )
    }
}

class ImageLoader: ObservableObject {
    var image: UIImage? {
        willSet {
            objectWillChange.send()
        }
    }
    let url: URL

    private(set) var isLoaded = false
    private var cancellable: AnyCancellable?
    private static let imageQueue = DispatchQueue(label: "image-loader")

    init(url: URL) {
        self.url = url
    }

    func load(cache: ImageCache? = nil) {
        guard !isLoaded else { return }

        isLoaded = true

        if image != nil {
            return
        }

        if let image = cache?[url] {
            self.image = image
            return
        }

        cancellable = URLSession.shared.dataTaskPublisher(for: url)
            .subscribe(on: Self.imageQueue)
            .map { UIImage(data: $0.data) }
            .replaceError(with: nil)
            .handleEvents(
                receiveOutput: { [url] image in
                    if let image = image {
                        cache?[url] = image
                    }
                }
            )
            .receive(on: DispatchQueue.main)
            .assign(to: \.image, on: self)
    }

    func cancel() {
        cancellable = nil
    }
}

protocol ImageCache: class {
    subscript(_ url: URL) -> UIImage? { get set }
}

class TemporaryImageCache: ImageCache {
    private let cache = NSCache<NSURL, UIImage>()

    subscript(url: URL) -> UIImage? {
        get {
            cache.object(forKey: url as NSURL)
        }
        set {
            if let newValue = newValue {
                cache.setObject(newValue, forKey: url as NSURL)
            } else {
                cache.removeObject(forKey: url as NSURL)
            }
        }
    }
}

struct ImageCacheKey: EnvironmentKey {
    static let defaultValue: ImageCache = TemporaryImageCache()
}

extension EnvironmentValues {
    var imageCache: ImageCache {
        get {
            self[ImageCacheKey.self]
        }
        set {
            self[ImageCacheKey.self] = newValue
        }
    }
}
