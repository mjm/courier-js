//
//  TweetDetailViewController.swift
//  Courier
//
//  Created by Matt Moriarity on 11/12/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import CombinableUI
import UIKit

final class TweetDetailViewController: UITableViewController {
    let viewModel: TweetDetailViewModel

    init(viewModel: TweetDetailViewModel = .init()) {
        self.viewModel = viewModel
        super.init(style: .insetGrouped)
    }

    required init?(coder: NSCoder) {
        fatalError("TweetDetailViewController should be created in code, not in a XIB or storyboard")
    }

    typealias DataSource = CombinableTableViewDataSource<TweetDetailViewModel.Section, TweetDetailViewModel.Item>
    private var dataSource: DataSource!
    var cancellables = Set<AnyCancellable>()

    override func viewDidLoad() {
        super.viewDidLoad()

        tableView.rowHeight = UITableView.automaticDimension
        tableView.keyboardDismissMode = .interactive

        viewModel.presenter = self

        viewModel.title.assign(to: \.title, on: navigationItem).store(in: &cancellables)

        dataSource = DataSource(tableView)
            .bound(to: viewModel.snapshot, animate: $animate, on: RunLoop.main)
    }

    @Published private var animate = false

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        animate = true
    }
}

extension TweetDetailViewModel.Item: BindableCell {
    enum Identifier: String, CellIdentifier, CaseIterable {
        case body

        var cellType: RegisteredCellType<UITableViewCell> {
            switch self {
            case .body: return .class(TweetBodyCell.self)
            }
        }
    }

    var cellIdentifier: Identifier {
        switch self {
        case .body: return .body
        }
    }

    func bind(to cell: UITableViewCell) {
        switch self {
        case .body(let model):
            (cell as! TweetBodyCell).bind(to: model)
        }
    }
}
