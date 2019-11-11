//
//  TweetsViewController.swift
//  Courier
//
//  Created by Matt Moriarity on 11/11/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import CombinableUI
import UIKit

final class TweetsViewController: UITableViewController {
    let viewModel: TweetsViewModel

    init(viewModel: TweetsViewModel = .init()) {
        self.viewModel = viewModel
        super.init(style: .plain)
    }

    required init?(coder: NSCoder) {
        fatalError("TweetsViewController should be created in code, not in a XIB or storyboard")
    }

    typealias DataSource = CombinableTableViewDataSource<TweetsViewModel.Section, TweetsViewModel.Item>
    private var dataSource: DataSource!

    override func viewDidLoad() {
        super.viewDidLoad()

        title = NSLocalizedString("Tweets", comment: "")

        viewModel.presenter = self

        dataSource = DataSource(tableView)
            .titled([
                .upcoming: NSLocalizedString("Upcoming Tweets", comment: ""),
                .past: NSLocalizedString("Past Tweets", comment: ""),
            ])
            .bound(to: viewModel.snapshot, animate: $animate)
    }

    @Published private var animate = false

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        animate = true
    }
}

extension TweetsViewModel.Item: BindableCell {
    enum Identifier: String, CellIdentifier, CaseIterable {
        case tweet

        var cellType: RegisteredCellType<UITableViewCell> {
            .class(TweetCell.self)
        }
    }

    var cellIdentifier: Identifier { .tweet }

    func bind(to cell: UITableViewCell) {
        let cell = cell as! TweetCell
        cell.bind(to: self)
    }
}
