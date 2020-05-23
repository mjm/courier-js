import SwiftUI

struct WithDelay: ViewModifier {
    private let delayer: Delayer

    init(_ delay: TimeInterval, action: @escaping () -> Void) {
        delayer = Delayer(delay: delay, action: action)
    }

    func body(content: Content) -> some View {
        content
            .onAppear(perform: delayer.onAppear)
            .onDisappear(perform: delayer.onDisappear)
    }
}

extension View {
    func onAppear(delay: TimeInterval, perform: @escaping () -> Void) -> some View {
        modifier(WithDelay(delay, action: perform))
    }
}

private class Delayer {
    let delay: TimeInterval
    let action: () -> Void
    var timer: Timer?

    init(delay: TimeInterval, action: @escaping () -> Void) {
        self.delay = delay
        self.action = action
    }

    func onAppear() {
        timer?.invalidate()

        timer = Timer.scheduledTimer(withTimeInterval: delay, repeats: false) { _ in
            self.action()
        }
    }

    func onDisappear() {
        timer?.invalidate()
    }
}
