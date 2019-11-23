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
        URLSession.shared.dataTaskPublisher(for: url)
            .map { (data, response) in
                UIImage(data: data)
            }
            .mapError { $0 as Error }
            .eraseToAnyPublisher()
    }
}
