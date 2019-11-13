//
//  TweetCell.swift
//  Courier
//
//  Created by Matt Moriarity on 11/11/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import CombinableUI
import UIKit

final class TweetCell: CombinableTableViewCell {
    private let bodyLabel = UILabel()
    private let statusLabel = UILabel()

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)

        let stackView = UIStackView()
        stackView.translatesAutoresizingMaskIntoConstraints = false
        stackView.axis = .vertical
        stackView.spacing = 16

        contentView.addSubview(stackView)
        NSLayoutConstraint.activate([
            stackView.topAnchor.constraint(equalTo: contentView.layoutMarginsGuide.topAnchor),
            stackView.bottomAnchor.constraint(equalTo: contentView.layoutMarginsGuide.bottomAnchor),
            stackView.leadingAnchor.constraint(equalTo: contentView.readableContentGuide.leadingAnchor),
            stackView.trailingAnchor.constraint(equalTo: contentView.readableContentGuide.trailingAnchor),
        ])

        bodyLabel.numberOfLines = 0
        bodyLabel.font = .preferredFont(forTextStyle: .body)
        stackView.addArrangedSubview(bodyLabel)

        statusLabel.font = .preferredFont(forTextStyle: .caption1)
        stackView.addArrangedSubview(statusLabel)
    }

    required init?(coder: NSCoder) {
        fatalError("TweetCell should be created in code, not in a XIB or storyboard")
    }

    private let relativeDateFormatter: RelativeDateTimeFormatter = {
        let formatter = RelativeDateTimeFormatter()
        formatter.dateTimeStyle = .numeric
        formatter.unitsStyle = .spellOut
        formatter.formattingContext = .middleOfSentence
        return formatter
    }()

    func bind(to model: TweetCellViewModel) {
        model.body.optionally().assign(to: \.text, on: bodyLabel).store(in: &cancellables)

        let statusText = model.status.combineLatest(model.postedAt).map { [relativeDateFormatter] input -> String? in
            let (status, postedAt) = input

            switch status {
            case .canceled: return NSLocalizedString("Canceled", comment: "")
            case .posted:
                if let postedAt = postedAt {
                    let dateString = relativeDateFormatter.localizedString(for: postedAt, relativeTo: Date())
                    return String(format: NSLocalizedString("Posted %@", comment: ""), dateString)
                } else {
                    return NSLocalizedString("Posted", comment: "")
                }
            default: return nil
            }
        }

        statusText.assign(to: \.text, on: statusLabel).store(in: &cancellables)
        statusText.map { $0 == nil }.assign(to: \.isHidden, on: statusLabel).store(in: &cancellables)

        model.status.map { status -> UIColor? in
            status == .canceled ? .secondarySystemBackground : .systemBackground
        }.assign(to: \.backgroundColor, on: self, weak: true).store(in: &cancellables)

        let textColor = model.status.map { status -> UIColor? in
            status == .canceled ? .secondaryLabel : .label
        }
        textColor.assign(to: \.textColor, on: bodyLabel).store(in: &cancellables)
        textColor.assign(to: \.textColor, on: statusLabel).store(in: &cancellables)
    }
}
