//
//  LogoutCell.swift
//  Courier
//
//  Created by Matt Moriarity on 11/23/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import CombinableUI
import UIKit

final class SettingsActionCell: CombinableTableViewCell {
    private let label = UILabel().usingAutoLayout()

    var actionLabel: String? {
        get { label.text }
        set { label.text = newValue }
    }

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)

        label.text = NSLocalizedString("Sign Out", comment: "")
        label.textColor = .systemRed

        contentView.addSubview(label)
        NSLayoutConstraint.activate([
            label.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            label.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            label.leadingAnchor.constraint(greaterThanOrEqualToSystemSpacingAfter: contentView.layoutMarginsGuide.leadingAnchor, multiplier: 1),
            label.trailingAnchor.constraint(lessThanOrEqualToSystemSpacingAfter: contentView.layoutMarginsGuide.trailingAnchor, multiplier: 1),
            contentView.heightAnchor.constraint(greaterThanOrEqualToConstant: 44),
        ])
    }

    required init?(coder: NSCoder) {
        fatalError("SettingsActionCell should be created in code, not in a XIB or storyboard")
    }
}
