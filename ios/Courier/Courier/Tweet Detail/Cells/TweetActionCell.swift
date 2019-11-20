//
//  TweetActionCell.swift
//  Courier
//
//  Created by Matt Moriarity on 11/19/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import CombinableUI
import UIKit

final class TweetActionCell: CombinableTableViewCell {
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)

        accessoryType = .disclosureIndicator
    }

    required init?(coder: NSCoder) {
        fatalError("TweetActionCell should be created in code, not in a XIB or storyboard")
    }

    func bind(to model: TweetActionCellViewModel) {
        model.$action.map { $0?.title }.assign(to: \.text, on: textLabel!).store(in: &cancellables)
    }
}
