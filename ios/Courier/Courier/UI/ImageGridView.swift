//
//  ImageGridView.swift
//  Courier
//
//  Created by Matt Moriarity on 11/23/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import UIKit

final class ImageGridView: UIView {
    var images: [UIImage?] = [] {
        didSet {
            updateImageViews()
        }
    }

    private let stackView = UIStackView().usingAutoLayout()

    override init(frame: CGRect) {
        super.init(frame: frame)

        stackView.axis = .vertical
        stackView.spacing = 2
        stackView.alignment = .fill

        addSubview(stackView)
        NSLayoutConstraint.activate([
            stackView.topAnchor.constraint(equalTo: layoutMarginsGuide.topAnchor),
            stackView.bottomAnchor.constraint(equalTo: layoutMarginsGuide.bottomAnchor),
            stackView.leadingAnchor.constraint(equalTo: layoutMarginsGuide.leadingAnchor),
            stackView.trailingAnchor.constraint(equalTo: layoutMarginsGuide.trailingAnchor),
        ])
    }

    required init?(coder: NSCoder) {
        fatalError("ImageGridView should be created in code, not in a XIB or storyboard")
    }

    private func updateImageViews() {
        let previousCount = stackView.arrangedSubviews.count

        if images.count > previousCount {
            for _ in 0..<(images.count - previousCount) {
                stackView.addArrangedSubview(makeImageView())
            }
        } else {
            for _ in 0..<(previousCount - images.count) {
                let lastView = stackView.arrangedSubviews.last!
                lastView.removeFromSuperview()
            }
        }

        for (image, view) in zip(images, stackView.arrangedSubviews) {
            let imageView = view as! UIImageView
            imageView.image = image
        }
    }

    private func makeImageView() -> UIImageView {
        let imageView = UIImageView().usingAutoLayout()
        imageView.contentMode = .scaleAspectFill
        imageView.widthAnchor.constraint(equalTo: imageView.heightAnchor).isActive = true
        return imageView
    }
}
