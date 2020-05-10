//
//  TweetsScreen.swift
//  CourierNext
//
//  Created by Matt Moriarity on 5/10/20.
//  Copyright © 2020 Matt Moriarity. All rights reserved.
//

import SwiftUI

struct TweetsScreen: View {
    @State private var selectedTag = 0

    var body: some View {
        NavigationView {
            VStack {
                Picker(selection: $selectedTag, label: EmptyView()) {
                    Text("Upcoming").tag(0)
                    Text("Past").tag(1)
                }
                    .pickerStyle(SegmentedPickerStyle())
                    .padding()

                Divider()

                if selectedTag == 0 {
                    List {
                        Text("abc")
                    }
                } else {
                    List {
                        Text("def")
                    }
                }
            }.navigationBarTitle("Tweets", displayMode: .inline)
        }
    }
}

struct TweetsScreen_Previews: PreviewProvider {
    static var previews: some View {
        TweetsScreen()
    }
}
