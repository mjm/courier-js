//
//  SplitViewController.swift
//  Courier
//
//  Created by Matt Moriarity on 11/12/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import UIKit

final class SplitViewController: UISplitViewController {
    let viewModel: SplitViewModel

    let tweetsViewController: TweetsViewController
    let masterNavController: UINavigationController

    let detailViewController: TweetDetailViewController
    let detailNavController: UINavigationController

    init(viewModel: SplitViewModel = .init()) {
        self.viewModel = viewModel

        // create master view controller
        tweetsViewController = TweetsViewController(viewModel: viewModel.masterViewModel)
        masterNavController = UINavigationController(rootViewController: tweetsViewController)

        // create detail view controller
        detailViewController = TweetDetailViewController(viewModel: viewModel.detailViewModel)
        detailNavController = UINavigationController(rootViewController: detailViewController)

        super.init(nibName: nil, bundle: nil)

        viewControllers = [masterNavController, detailNavController]

        detailViewController.navigationItem.leftBarButtonItem = displayModeButtonItem
        detailViewController.navigationItem.leftItemsSupplementBackButton = true
    }

    required init?(coder: NSCoder) {
        fatalError("SplitViewController should be created in code, not in a XIB or storyboard")
    }
}
