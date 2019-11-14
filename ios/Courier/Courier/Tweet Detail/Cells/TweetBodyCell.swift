//
//  TweetBodyCell.swift
//  Courier
//
//  Created by Matt Moriarity on 11/13/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import CombinableUI
import UIKit

final class TweetBodyCell: CombinableTableViewCell {
    let textView = UITextView()

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)

        textView.translatesAutoresizingMaskIntoConstraints = false
        textView.font = .preferredFont(forTextStyle: .body)
        textView.isScrollEnabled = false
        textView.delegate = self

        contentView.addSubview(textView)

        NSLayoutConstraint.activate([
            textView.topAnchor.constraint(equalTo: contentView.layoutMarginsGuide.topAnchor),
            textView.bottomAnchor.constraint(equalTo: contentView.layoutMarginsGuide.bottomAnchor),
            textView.leadingAnchor.constraint(equalTo: contentView.readableContentGuide.leadingAnchor),
            textView.trailingAnchor.constraint(equalTo: contentView.readableContentGuide.trailingAnchor),
        ])
    }

    required init?(coder: NSCoder) {
        fatalError("TweetBodyCell should be created in code, not in a XIB or storyboard")
    }

    fileprivate var model: TweetBodyCellViewModel?

    func bind(to model: TweetBodyCellViewModel) {
        self.model = model

        model.$body.assign(to: \.text, on: textView).store(in: &cancellables)
    }
}

extension TweetBodyCell: UITextViewDelegate {
    func textViewDidChange(_ textView: UITextView) {
        model?.body = textView.text
    }
}
