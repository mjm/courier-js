//
//  ContentView.swift
//  CourierNext
//
//  Created by Matt Moriarity on 5/10/20.
//  Copyright © 2020 Matt Moriarity. All rights reserved.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        WithCurrentEndpoint {
            CurrentUser {
                EnvironmentProvider {
                    TweetsScreen()
                }
            }
        }.accentColor(.purple)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
