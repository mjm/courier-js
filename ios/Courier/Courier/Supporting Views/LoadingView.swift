import SwiftUI

struct LoadingView: View {
    var text = "Loading…"

    @State private var isVisible = false

    var body: some View {
        Group {
            if isVisible {
                VStack(spacing: 10.0) {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                        .scaleEffect(x: 2, y: 2, anchor: .center)
                        .frame(width: 50, height: 50)

                    Text(text)
                        .font(.headline)
                        .foregroundColor(.secondary)
                }
            } else {
                Spacer()
                    .onAppear(delay: 0.5) {
                        self.isVisible = true
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
