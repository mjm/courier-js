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

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard let item = dataSource.itemIdentifier(for: indexPath) else {
            return
        }

        switch item {
        case .environment(let model):
            model.toggle()
            tableView.deselectRow(at: indexPath, animated: true)
        }
    }
}

extension SettingsViewModel.Item: BindableCell {
    enum Identifier: String, CellIdentifier, CaseIterable {
        case environment

        var cellType: RegisteredCellType<UITableViewCell> {
            switch self {
            case .environment: return .class(EnvironmentCell.self)
            }
        }
    }

    var cellIdentifier: Identifier {
        switch self {
        case .environment: return .environment
        }
    }

    func bind(to cell: UITableViewCell) {
        switch self {
        case .environment(let model):
            (cell as! EnvironmentCell).bind(to: model)
        }
    }
}
