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
    func bind(to model: TweetCellViewModel) {
        model.body.optionally().assign(to: \.text, on: textLabel!).store(in: &cancellables)
    }
}
