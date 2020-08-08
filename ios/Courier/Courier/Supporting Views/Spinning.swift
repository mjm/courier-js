import SwiftUI

struct Spinning: ViewModifier {
    func body(content: Content) -> some View {
        _Spinning(content: content)
    }
}

extension View {
    func spinning() -> some View {
        modifier(Spinning())
    }
}

fileprivate struct _Spinning<Content: View>: View {
    let content: Content
    @State private var isAnimating = false

    var body: some View {
        content
            .rotationEffect(.degrees(isAnimating ? 360 : 0))
            .animation(Animation.linear
                        .repeatForever(autoreverses: false)
                        .speed(0.25))
            .onAppear { isAnimating = true }
            .onDisappear { isAnimating = false }
    }
}

struct Spinning_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            Image(systemName: "arrow.triangle.2.circlepath.circle.fill")
                .spinning()

            Label {
                Text("Some text")
            } icon: {
                Image(systemName: "arrow.triangle.2.circlepath.circle.fill")
                    .spinning()
            }
        }
    }
}
