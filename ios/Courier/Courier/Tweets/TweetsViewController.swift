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
    private var cancellables = Set<AnyCancellable>()

    let sectionChooser = UISegmentedControl(items: [
        NSLocalizedString("Upcoming Tweets", comment: ""),
        NSLocalizedString("Past Tweets", comment: ""),
    ])

    private let settingsButtonItem = UIBarButtonItem(
        image: UIImage(systemName: "gear"),
        style: .plain,
        target: self,
        action: #selector(showSettings)
    )

    private let contentStateView = ContentStateView()

    override func viewDidLoad() {
        super.viewDidLoad()

        navigationItem.titleView = sectionChooser
        navigationItem.leftBarButtonItems = [settingsButtonItem]

        settingsButtonItem.target = self

        refreshControl = UIRefreshControl()

        contentStateView.emptyImage = UIImage(systemName: "paperplane.fill")
        contentStateView.apply(to: tableView)

        viewModel.presenter = self

        dataSource = DataSource(tableView)
            .editable()
            .bound(to: viewModel.snapshot, animate: $animate)

        viewModel.isLoading.combineLatest(viewModel.isEmpty).sink { [weak self] (loading, empty) in
            self?.updateContentState(loading: loading, empty: empty)
        }.store(in: &cancellables)

        viewModel.selectedItem.combineLatest(viewModel.$selectedSection) { model, _ in model }.sink { [weak self] model in
            guard let self = self else { return }

            if !self.splitViewController!.isCollapsed {
                if let model = model, let indexPath = self.dataSource.indexPath(for: model) {
                    self.tableView.selectRow(at: indexPath, animated: false, scrollPosition: .none)
                } else if let indexPath = self.tableView.indexPathForSelectedRow {
                    self.tableView.deselectRow(at: indexPath, animated: false)
                }
            }
        }.store(in: &cancellables)

        viewModel.$selectedSection.map { section in
            switch section {
            case .upcoming: return NSLocalizedString("You don't have any upcoming tweets.", comment: "")
            case .past: return NSLocalizedString("You haven't posted or canceled any tweets.", comment: "")
            }
        }.optionally().assign(to: \.emptyText, on: contentStateView).store(in: &cancellables)

        viewModel.$selectedSection
            .map(\.rawValue)
            .assign(to: \.selectedSegmentIndex, on: sectionChooser)
            .store(in: &cancellables)

        sectionChooser.selectionDidChange
            .compactMap { TweetsViewModel.Section(rawValue: $0) }
            .sink { [viewModel, weak self] section in
                self?.animate = false
                viewModel.selectedSection = section
                self?.animate = true
            }
            .store(in: &cancellables)

        refreshControl!.valueDidChange.sink { [viewModel] _ in
            viewModel.refreshCurrentSection()
        }.store(in: &cancellables)

        viewModel.isRefreshingCurrentSection.sink { [refreshControl] isRefreshing in
            if isRefreshing {
                refreshControl?.beginRefreshing()
            } else {
                refreshControl?.endRefreshing()
            }
        }.store(in: &cancellables)
    }

    override func viewWillAppear(_ animated: Bool) {
        clearsSelectionOnViewWillAppear = splitViewController!.isCollapsed
        super.viewWillAppear(animated)
    }

    @Published private var animate = false

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        animate = true
    }

    @objc func showSettings() {
        viewModel.showSettings()
    }

    private func updateContentState(loading: Bool, empty: Bool) {
        if loading {
            contentStateView.showLoading()
            tableView.tableFooterView = UIView()
        } else if empty {
            contentStateView.showEmpty()
            tableView.tableFooterView = UIView()
        } else {
            contentStateView.hide()
            tableView.tableFooterView = nil
        }
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard let model = dataSource.itemIdentifier(for: indexPath) else {
            return
        }

        selectAndShow(model)
    }

    override func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        guard let model = dataSource.itemIdentifier(for: indexPath) else {
            return nil
        }

        let cancel = model.cancelAction?.contextualAction()
        let uncancel = model.uncancelAction?.contextualAction()
        uncancel?.backgroundColor = .systemTeal

        return UISwipeActionsConfiguration(actions: [
            cancel,
            uncancel,
        ].compactMap { $0 })
    }

    override func tableView(_ tableView: UITableView, leadingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        guard let model = dataSource.itemIdentifier(for: indexPath) else {
            return nil
        }

        guard let post = model.postAction?.contextualAction() else {
            return nil
        }

        post.backgroundColor = .systemGreen

        return UISwipeActionsConfiguration(actions: [post])
    }

    override func tableView(_ tableView: UITableView, contextMenuConfigurationForRowAt indexPath: IndexPath, point: CGPoint) -> UIContextMenuConfiguration? {
        guard let model = dataSource.itemIdentifier(for: indexPath) else {
            return nil
        }

        return UIContextMenuConfiguration(identifier: model.tweet.id as NSString, previewProvider: nil) { _ in
            var actions = [UIMenuElement]()

            if let cancel = model.cancelAction {
                actions.append(cancel.menuAction(image: UIImage(systemName: "nosign")))
            }

            if let uncancel = model.uncancelAction {
                actions.append(uncancel.menuAction(image: UIImage(systemName: "arrowshape.turn.up.left")))
            }

            if let post = model.postAction {
                actions.append(post.menuAction(image: UIImage(systemName: "text.bubble")))
            }

            return UIMenu(title: "", children: actions)
        }
    }

    override func tableView(_ tableView: UITableView, willPerformPreviewActionForMenuWith configuration: UIContextMenuConfiguration, animator: UIContextMenuInteractionCommitAnimating) {
        guard let id = configuration.identifier as? String, let model = viewModel.item(for: id) else {
            return
        }

        animator.addAnimations {
            self.selectAndShow(model)
        }
    }

    private func selectAndShow(_ model: TweetsViewModel.Item) {
        viewModel.selection = model.tweet.id
        if let detailViewController = (splitViewController as? SplitViewController)?.detailNavController {
            self.splitViewController?.showDetailViewController(detailViewController, sender: self)
        }
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
