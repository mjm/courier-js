//
//  UserCellViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/23/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Combinable
import UIKit

final class UserCellViewModel {
    @Published var user: UserInfo?

    var displayName: AnyPublisher<String?, Never> {
        $user.map { $0?.name }.eraseToAnyPublisher()
    }

    var username: AnyPublisher<String?, Never> {
        $user.map { $0?.nickname }.eraseToAnyPublisher()
    }

    var avatar: AnyPublisher<UIImage?, Never> {
        $user.map { $0?.picture }
            .removeDuplicates()
            .flatMap { picture -> AnyPublisher<UIImage?, Never> in
                if let url = picture.flatMap(URL.init(string:)) {
                    return UIImage.publisher(url: url).ignoreError().eraseToAnyPublisher()
                } else {
                    return Empty().eraseToAnyPublisher()
                }
            }
            .receive(on: RunLoop.main)
            .eraseToAnyPublisher()
    }
}

extension UserCellViewModel: Hashable {
    static func == (lhs: UserCellViewModel, rhs: UserCellViewModel) -> Bool {
        ObjectIdentifier(lhs) == ObjectIdentifier(rhs)
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(ObjectIdentifier(self))
    }
}
