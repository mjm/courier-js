//
//  ContentStateView.swift
//  Courier
//
//  Created by Matt Moriarity on 11/21/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import UIKit

final class ContentStateView: UIView {
    private let stackView = UIStackView()
    private let activityIndicator = UIActivityIndicatorView()
    private let iconView = UIImageView()
    private let textLabel = UILabel()

    var emptyImage: UIImage? {
        get { iconView.image }
        set { iconView.image = newValue }
    }

    var emptyText: String? {
        get { textLabel.text }
        set { textLabel.text = newValue }
    }

    override init(frame: CGRect) {
        super.init(frame: frame)

        isHidden = true

        translatesAutoresizingMaskIntoConstraints = false
        stackView.translatesAutoresizingMaskIntoConstraints = false
        iconView.translatesAutoresizingMaskIntoConstraints = false
        textLabel.translatesAutoresizingMaskIntoConstraints = false

        stackView.axis = .vertical
        stackView.spacing = 16

        activityIndicator.style = .large
        stackView.addArrangedSubview(activityIndicator)

        iconView.contentMode = .scaleAspectFit
        iconView.tintColor = .systemGray2
        iconView.preferredSymbolConfiguration = UIImage.SymbolConfiguration(pointSize: 60)
        stackView.addArrangedSubview(iconView)

        textLabel.numberOfLines = 0
        textLabel.textAlignment = .center
        textLabel.textColor = .systemGray2
        stackView.addArrangedSubview(textLabel)

        addSubview(stackView)

        NSLayoutConstraint.activate([
            stackView.centerXAnchor.constraint(equalTo: centerXAnchor),
            stackView.centerYAnchor.constraint(equalTo: centerYAnchor),
            stackView.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 16),
            stackView.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -16),
        ])
    }

    required init?(coder: NSCoder) {
        fatalError("ContentStateView should be created in code, not in a XIB or storyboard")
    }

    func showLoading() {
        activityIndicator.isHidden = false
        activityIndicator.startAnimating()

        textLabel.isHidden = true
        iconView.isHidden = true

        isHidden = false
    }

    func showEmpty() {
        activityIndicator.isHidden = true

        textLabel.isHidden = false
        iconView.isHidden = false

        isHidden = false
    }

    func hide() {
        isHidden = true
    }

    func apply(to tableView: UITableView) {
        tableView.backgroundView = self
        NSLayoutConstraint.activate([
            self.leadingAnchor.constraint(
                equalTo: tableView.safeAreaLayoutGuide.leadingAnchor),
            self.trailingAnchor.constraint(
                equalTo: tableView.safeAreaLayoutGuide.trailingAnchor),
            self.topAnchor.constraint(equalTo: tableView.safeAreaLayoutGuide.topAnchor),
            self.bottomAnchor.constraint(
                equalTo: tableView.safeAreaLayoutGuide.bottomAnchor),
        ])
    }
}
