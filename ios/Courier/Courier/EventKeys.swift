//
//  EventKeys.swift
//  Courier
//
//  Created by Matt Moriarity on 11/11/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Events

extension Event.Key {
    // remote notifications keys
    static let registerTime: Event.Key = "register_ms"
    static let tokenLength: Event.Key = "token_length"
    static let authorized: Event.Key = "authorized"
    static let environment: Event.Key = "environment"

    // tweet keys
    static let tweetId: Event.Key = "tweet_id"

    static let url: Event.Key = "url"
}
