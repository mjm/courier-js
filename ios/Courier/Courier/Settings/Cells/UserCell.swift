//
//  UserCell.swift
//  Courier
//
//  Created by Matt Moriarity on 11/23/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import CombinableUI
import UIKit

final class UserCell: CombinableTableViewCell {
    private let stackView = UIStackView().usingAutoLayout()
    private let avatarImageView = UIImageView().usingAutoLayout()
    private let displayNameLabel = UILabel().usingAutoLayout()
    private let usernameLabel = UILabel().usingAutoLayout()

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)

        stackView.axis = .horizontal
        stackView.spacing = 16
        stackView.alignment = .top

        avatarImageView.contentMode = .scaleAspectFill
        avatarImageView.layer.cornerRadius = 4
        avatarImageView.layer.masksToBounds = true
        NSLayoutConstraint.activate([
            avatarImageView.widthAnchor.constraint(equalTo: avatarImageView.heightAnchor),
            avatarImageView.heightAnchor.constraint(equalToConstant: 50),
        ])
        stackView.addArrangedSubview(avatarImageView)

        let labelStackView = UIStackView().usingAutoLayout()
        labelStackView.axis = .vertical
        labelStackView.spacing = 4

        displayNameLabel.font = .preferredFont(forTextStyle: .headline)
        labelStackView.addArrangedSubview(displayNameLabel)

        usernameLabel.font = .preferredFont(forTextStyle: .subheadline)
        labelStackView.addArrangedSubview(usernameLabel)

        stackView.addArrangedSubview(labelStackView)

        contentView.addSubview(stackView)
        NSLayoutConstraint.activate([
            stackView.topAnchor.constraint(equalTo: contentView.layoutMarginsGuide.topAnchor),
            stackView.bottomAnchor.constraint(equalTo: contentView.layoutMarginsGuide.bottomAnchor),
            stackView.leadingAnchor.constraint(equalTo: contentView.readableContentGuide.leadingAnchor),
            stackView.trailingAnchor.constraint(equalTo: contentView.readableContentGuide.trailingAnchor),
        ])
    }

    required init?(coder: NSCoder) {
        fatalError("UserCell should be created in code, not in a XIB or storyboard")
    }

    func bind(to model: UserCellViewModel) {
        model.avatar.assign(to: \.image, on: avatarImageView).store(in: &cancellables)
        model.displayName.assign(to: \.text, on: displayNameLabel).store(in: &cancellables)
        model.username.assign(to: \.text, on: usernameLabel).store(in: &cancellables)
    }
}
