//
//  LoadingView.swift
//  RelayStarWars
//
//  Created by Matt Moriarity on 5/8/20.
//  Copyright © 2020 Matt Moriarity. All rights reserved.
//

import SwiftUI

struct LoadingView: View {
    var text = "Loading…"

    @State private var isVisible = false

    var body: some View {
        Group {
            if isVisible {
                VStack(spacing: 10.0) {
                    ActivityIndicator(isAnimating: .constant(true), style: .large)

                    Text(text)
                        .font(.headline)
                        .foregroundColor(.secondary)
                }
            } else {
                Spacer().onAppear {
                    DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(500)) {
                        self.isVisible = true
                    }
                }
            }
        }
    }
}

struct LoadingView_Previews: PreviewProvider {
    static var previews: some View {
        LoadingView()
    }
}

private struct ActivityIndicator: UIViewRepresentable {
    @Binding var isAnimating: Bool
    let style: UIActivityIndicatorView.Style

    func makeUIView(context: UIViewRepresentableContext<ActivityIndicator>) -> UIActivityIndicatorView {
        return UIActivityIndicatorView(style: style)
    }

    func updateUIView(_ uiView: UIActivityIndicatorView, context: UIViewRepresentableContext<ActivityIndicator>) {
        isAnimating ? uiView.startAnimating() : uiView.stopAnimating()
    }
}
