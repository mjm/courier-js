//
//  TweetTimestampCell.swift
//  Courier
//
//  Created by Matt Moriarity on 11/21/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import CombinableUI
import UIKit

private let relativeDateFormatter: RelativeDateTimeFormatter = {
    let formatter = RelativeDateTimeFormatter()
    formatter.dateTimeStyle = .numeric
    formatter.unitsStyle = .spellOut
    formatter.formattingContext = .middleOfSentence
    return formatter
}()

final class TweetTimestampCell: CombinableTableViewCell {
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: .value1, reuseIdentifier: reuseIdentifier)
    }

    required init?(coder: NSCoder) {
        fatalError("TweetTimestampCell should be created in code, not in a XIB or storyboard")
    }

    func bind(to model: TweetTimestampCellViewModel, label: String) {
        accessoryType = model.hasAction ? .disclosureIndicator : .none
        textLabel!.text = label

        let currentTime = Timer.publish(every: 10, on: .main, in: .common).autoconnect().prepend(Date())
        model.date.combineLatest(currentTime) { date, now -> String? in
            if let date = date {
                return relativeDateFormatter.localizedString(for: date, relativeTo: now)
            } else {
                return nil
            }
        }.removeDuplicates().assign(to: \.text, on: detailTextLabel!).store(in: &cancellables)
    }
}
