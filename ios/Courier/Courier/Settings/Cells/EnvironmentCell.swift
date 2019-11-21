//
//  EnvironmentCell.swift
//  Courier
//
//  Created by Matt Moriarity on 11/20/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import CombinableUI
import UIKit

final class EnvironmentCell: CombinableTableViewCell {
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: .value1, reuseIdentifier: reuseIdentifier)

        accessoryType = .disclosureIndicator
    }

    required init?(coder: NSCoder) {
        fatalError("EnvironmentCell should be created in code, not in a XIB or storyboard")
    }

    func bind(to model: EnvironmentCellViewModel) {
        textLabel!.text = NSLocalizedString("Environment", comment: "")
        model.$value.optionally().assign(to: \.text, on: detailTextLabel!).store(in: &cancellables)
    }
}
