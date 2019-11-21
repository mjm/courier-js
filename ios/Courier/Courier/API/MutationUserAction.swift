//
//  MutationUserAction.swift
//  Courier
//
//  Created by Matt Moriarity on 11/20/19.
//  Copyright © 2019 Matt Moriarity. All rights reserved.
//

import Apollo
import Combinable
import UserActions

protocol MutationUserAction: ReactiveUserAction {
    associatedtype Mutation: GraphQLMutation

    func mutation(context: UserActions.Context<Self>) -> Mutation

    func transform(data: Mutation.Data) -> ResultType
}

extension MutationUserAction {
    func publisher(context: UserActions.Context<Self>) -> AnyPublisher<ResultType, Error> {
        context.apolloClient.publisher(mutation: mutation(context: context))
            .map(transform)
            .eraseToAnyPublisher()
    }
}

extension MutationUserAction where Mutation.Data == ResultType {
    func transform(data: Mutation.Data) -> ResultType {
        return data
    }
}

extension MutationUserAction where ResultType == Void {
    func transform(data: Mutation.Data) -> () {
        return ()
    }
}
