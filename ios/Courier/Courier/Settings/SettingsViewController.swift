//
//  SettingsViewController.swift
//  Courier
//
//  Created by Matt Moriarity on 11/20/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import CombinableUI
import UIKit

final class SettingsViewController: UITableViewController {
    let viewModel: SettingsViewModel

    init(viewModel: SettingsViewModel = .init()) {
        self.viewModel = viewModel
        super.init(style: .insetGrouped)
    }

    required init?(coder: NSCoder) {
        fatalError("SettingsViewController should be created in code, not in a XIB or storyboard")
    }

    typealias DataSource = CombinableTableViewDataSource<SettingsViewModel.Section, SettingsViewModel.Item>
    private var dataSource: DataSource!
    var cancellables = Set<AnyCancellable>()

    override func viewDidLoad() {
        super.viewDidLoad()

        navigationItem.title = NSLocalizedString("Settings", comment: "")

        let doneItem = UIBarButtonItem(barButtonSystemItem: .done, target: self, action: #selector(done))
        navigationItem.leftBarButtonItem = doneItem

        viewModel.presenter = self

        dataSource
            = DataSource(tableView)
                .bound(to: viewModel.snapshot, animate: false)
    }

    @objc func done() {
        navigationController?.dismiss(animated: true)
    }

    override func tableView(_ tableView: UITableView, willSelectRowAt indexPath: IndexPath) -> IndexPath? {
        guard let item = dataSource.itemIdentifier(for: indexPath) else {
            return nil
        }

        switch item {
        case .environment, .logout, .login: return indexPath
        case .user: return nil
        }
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard let item = dataSource.itemIdentifier(for: indexPath) else {
            return
        }

        tableView.deselectRow(at: indexPath, animated: true)

        switch item {
        case .environment(let model):
            model.toggle()
        case .logout:
            viewModel.logout()
        case .login:
            viewModel.login()
        default: return
        }
    }
}

extension SettingsViewModel.Item: BindableCell {
    enum Identifier: String, CellIdentifier, CaseIterable {
        case user
        case environment
        case action

        var cellType: RegisteredCellType<UITableViewCell> {
            switch self {
            case .user: return .class(UserCell.self)
            case .environment: return .class(EnvironmentCell.self)
            case .action: return .class(SettingsActionCell.self)
            }
        }
    }

    var cellIdentifier: Identifier {
        switch self {
        case .user: return .user
        case .environment: return .environment
        case .logout, .login: return .action
        }
    }

    func bind(to cell: UITableViewCell) {
        switch self {
        case .user(let model):
            (cell as! UserCell).bind(to: model)
        case .environment(let model):
            (cell as! EnvironmentCell).bind(to: model)
        case .logout:
            let cell = cell as! SettingsActionCell
            cell.actionLabel = NSLocalizedString("Sign Out", comment: "")
        case .login:
            let cell = cell as! SettingsActionCell
            cell.actionLabel = NSLocalizedString("Sign In", comment: "")
        }
    }
}
