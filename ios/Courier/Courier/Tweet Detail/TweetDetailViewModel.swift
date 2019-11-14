//
//  TweetDetailViewModel.swift
//  Courier
//
//  Created by Matt Moriarity on 11/12/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Combinable
import UIKit

final class TweetDetailViewModel: ViewModel {
    @Published var tweet: AllTweetsFields?

    init(tweet: AllTweetsFields? = nil, client: ApolloClient = .main) {
        self.tweet = tweet
        super.init(client: client)
    }

    var title: AnyPublisher<String?, Never> {
        $tweet.map { ($0?.body.prefix(20)).flatMap(String.init) }.eraseToAnyPublisher()
    }
}
