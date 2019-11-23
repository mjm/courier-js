//
//  UIImage.swift
//  Courier
//
//  Created by Matt Moriarity on 11/23/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable
import UIKit

extension UIImage {
    class func publisher(url: URL) -> AnyPublisher<UIImage?, Error> {
        ImageCache.shared.publisher(url: url)
    }
}

final class ImageCache {
    static let shared = ImageCache(session: .shared)

    let session: URLSession
    let cache = NSCache<NSURL, UIImage>()

    init(session: URLSession) {
        self.session = session
    }

    func publisher(url: URL) -> AnyPublisher<UIImage?, Error> {
        if let image = self[url] {
            return Just(image as UIImage?).setFailureType(to: Error.self).eraseToAnyPublisher()
        }

        return URLSession.shared.dataTaskPublisher(for: url)
            .receive(on: RunLoop.main)
            .map { [weak self] (data, response) in
                if let image = UIImage(data: data) {
                    self?[url] = image
                    return image
                }
                return nil
            }
            .mapError { $0 as Error }
            .eraseToAnyPublisher()
    }

    subscript(_ url: URL) -> UIImage? {
        get {
            cache.object(forKey: url as NSURL)
        }
        set {
            if let newValue = newValue {
                let cost = Int(newValue.size.width * newValue.size.height)
                cache.setObject(newValue, forKey: url as NSURL, cost: cost)
            }
        }
    }
}
