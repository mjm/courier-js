//
//  LinkLabel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/19/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import UIKit

let linkDetector = try! NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue)

class LinkLabel: UILabel, UIGestureRecognizerDelegate {
    private var linkRanges: [NSRange] = []

    override init(frame: CGRect) {
        super.init(frame: frame)

        isUserInteractionEnabled = true
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(didTapLabel(_:)))
        tapGesture.delegate = self
        addGestureRecognizer(tapGesture)

        textContainer.lineFragmentPadding = 0
        textContainer.lineBreakMode = lineBreakMode
        textContainer.maximumNumberOfLines = numberOfLines
        layoutManager.addTextContainer(textContainer)
    }

    required init?(coder: NSCoder) {
        fatalError("LinkLabel should be created in code, not in a XIB or storyboard")
    }

    var foregroundColor: UIColor = .label {
        didSet {
            updateAttributedText(text)
        }
    }

    override var text: String? {
        get {
            attributedText?.string
        }
        set {
            if let text = newValue {
                let nsText = text as NSString

                // find the ranges of the string that have URLs
                let wholeString = NSRange(location: 0, length: nsText.length)
                let result = linkDetector.matches(in: text, options: [], range: wholeString)
                linkRanges = result.compactMap { $0.range }
            } else {
                linkRanges = []
            }

            updateAttributedText(newValue)
        }
    }

    private let layoutManager = NSLayoutManager()
    private let textContainer = NSTextContainer(size: .zero)
    private var textStorage: NSTextStorage?

    override var attributedText: NSAttributedString? {
        didSet {
            if let attributedText = attributedText {
                textStorage = NSTextStorage(attributedString: attributedText)
                textStorage!.addLayoutManager(layoutManager)
            } else {
                textStorage = nil
            }
        }
    }

    override var lineBreakMode: NSLineBreakMode {
        didSet {
            textContainer.lineBreakMode = lineBreakMode
        }
    }

    override var numberOfLines: Int {
        didSet {
            textContainer.maximumNumberOfLines = numberOfLines
        }
    }

    override func layoutSubviews() {
        super.layoutSubviews()

        textContainer.size = bounds.size
    }

    private func updateAttributedText(_ text: String?) {
        guard let text = text else {
            attributedText = nil
            return
        }

        let attributed = NSMutableAttributedString(string: text, attributes: [.foregroundColor: foregroundColor])
        for range in linkRanges {
            attributed.addAttributes([
                .foregroundColor: UIColor.link,
                .underlineStyle: true as NSNumber,
            ], range: range)
        }

        attributedText = attributed.copy() as? NSAttributedString
    }

    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
        let location = touch.location(in: self)
        let range = linkRange(at: location)
        return range != nil
    }

    @objc func didTapLabel(_ gesture: UITapGestureRecognizer) {
        guard let text = text else {
            return
        }

        let location = gesture.location(in: self)
        guard let range = linkRange(at: location) else {
            return
        }

        guard let strRange = Range(range, in: text) else {
            return
        }

        let urlString = String(text[strRange])
        guard let url = URL(string: urlString) else {
            return
        }

        UIApplication.shared.open(url, options: [:], completionHandler: nil)
    }

    private func linkRange(at point: CGPoint) -> NSRange? {
        guard !linkRanges.isEmpty else {
            return nil
        }

        let boundingBox = layoutManager.usedRect(for: textContainer)
        let textContainerOffset = CGPoint(
            x: (textContainer.size.width - boundingBox.size.width) * 0.5 - boundingBox.origin.x,
            y: (textContainer.size.height - boundingBox.size.height) * 0.5 - boundingBox.origin.y
        )
        let locationOfTouchInTextContainer = CGPoint(
            x: point.x - textContainerOffset.x,
            y: point.y - textContainerOffset.y
        )
        let indexOfCharacter = layoutManager.characterIndex(
            for: locationOfTouchInTextContainer,
            in: textContainer,
            fractionOfDistanceBetweenInsertionPoints: nil
        )

        return linkRanges.first { $0.contains(indexOfCharacter) }
    }
}
