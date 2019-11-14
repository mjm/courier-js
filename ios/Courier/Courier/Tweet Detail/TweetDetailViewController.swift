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

    var cancellables = Set<AnyCancellable>()

    override func viewDidLoad() {
        super.viewDidLoad()

        viewModel.presenter = self

        viewModel.title.assign(to: \.title, on: navigationItem).store(in: &cancellables)
    }
}
