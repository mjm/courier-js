//
//  ShowSettingsAction.swift
//  Courier
//
//  Created by Matt Moriarity on 11/20/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import UIKit
import UserActions

struct ShowSettingsAction: SyncUserAction {
    var undoActionName: String? { nil }

    func perform(_ context: UserActions.Context<ShowSettingsAction>) throws {
        let navController = UINavigationController(rootViewController: SettingsViewController())
        context.present(navController)
    }
}
