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

    private let saveButtonItem = UIBarButtonItem(title: NSLocalizedString("Save", comment: ""),
                                                 style: .plain,
                                                 target: self,
                                                 action: #selector(saveTweet))

    private let contentStateView = ContentStateView()

    override func viewDidLoad() {
        super.viewDidLoad()

        tableView.rowHeight = UITableView.automaticDimension
        tableView.keyboardDismissMode = .interactive

        contentStateView.apply(to: tableView)

        viewModel.presenter = self

        viewModel.status.map { status in
            switch status {
            case .draft: return NSLocalizedString("Draft Tweet", comment: "")
            case .canceled: return NSLocalizedString("Canceled Tweet", comment: "")
            case .posted: return NSLocalizedString("Posted Tweet", comment: "")
            default: return nil
            }
        }.assign(to: \.title, on: navigationItem).store(in: &cancellables)

        dataSource = DataSource(tableView)
            .bound(to: viewModel.snapshot, animate: Just(false), on: RunLoop.main)

        // trigger animated updates when typing in the text view
        viewModel.draftBody.sink { [dataSource] _ in
            let currentSnapshot = dataSource!.snapshot()
            dataSource!.apply(currentSnapshot, animatingDifferences: true)
        }.store(in: &cancellables)

        viewModel.isLoading.sink { [weak self] loading in
            self?.updateContentState(loading: loading)
        }.store(in: &cancellables)

        viewModel.showSaveButton.map { [saveButtonItem] showSave in
            showSave ? [saveButtonItem] : []
        }.assign(to: \.rightBarButtonItems, on: navigationItem).store(in: &cancellables)
        viewModel.canSave.assign(to: \.isEnabled, on: saveButtonItem).store(in: &cancellables)
    }

    private func updateContentState(loading: Bool) {
        if loading {
            contentStateView.showLoading()
        } else {
            contentStateView.hide()
        }
    }

    @objc func saveTweet() {
        viewModel.saveAction?.perform()
    }

    override func tableView(_ tableView: UITableView, willSelectRowAt indexPath: IndexPath) -> IndexPath? {
        guard let item = dataSource.itemIdentifier(for: indexPath) else {
            return nil
        }

        switch item {
        case .timestamp(let model, _):
            return model.hasAction ? indexPath : nil
        case .action:
            return indexPath
        default:
            return nil
        }
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard let item = dataSource.itemIdentifier(for: indexPath) else {
            return
        }

        switch item {
        case .timestamp(let model, _):
            model.action?.perform()
            tableView.deselectRow(at: indexPath, animated: true)
        case .action(let model):
            model.action?.perform()
            tableView.deselectRow(at: indexPath, animated: true)
        default:
            return
        }
    }
}

extension TweetDetailViewModel.Item: BindableCell {
    enum Identifier: String, CellIdentifier, CaseIterable {
        case body
        case action
        case timestamp

        var cellType: RegisteredCellType<UITableViewCell> {
            switch self {
            case .body: return .class(TweetBodyCell.self)
            case .action: return .class(TweetActionCell.self)
            case .timestamp: return .class(TweetTimestampCell.self)
            }
        }
    }

    var cellIdentifier: Identifier {
        switch self {
        case .body: return .body
        case .action: return .action
        case .timestamp: return .timestamp
        }
    }

    func bind(to cell: UITableViewCell) {
        switch self {
        case .body(let model):
            (cell as! TweetBodyCell).bind(to: model)
        case .action(let model):
            (cell as! TweetActionCell).bind(to: model)
        case .timestamp(let model, let label):
            (cell as! TweetTimestampCell).bind(to: model, label: label)
        }
    }
}
