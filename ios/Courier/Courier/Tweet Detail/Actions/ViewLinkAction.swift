//
//  ViewLinkAction.swift
//  Courier
//
//  Created by Matt Moriarity on 11/19/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Events
import Foundation
import SafariServices
import UserActions

struct ViewLinkAction: SyncUserAction {
    let url: URL

    var undoActionName: String? { nil }

    func perform(_ context: UserActions.Context<ViewLinkAction>) throws {
        Event.current[.url] = url

        let viewController = SFSafariViewController(url: url)
        context.present(viewController)
    }
}

extension AllTweetsFields {
    var viewPostAction: ViewLinkAction? {
        URL(string: post.url).flatMap(ViewLinkAction.init(url:))
    }
}