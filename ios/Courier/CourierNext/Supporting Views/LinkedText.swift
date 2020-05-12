import SwiftUI

private let linkDetector = try! NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue)

struct LinkedText: View {
    enum Component {
        case text(String)
        case link(String, URL)
    }

    let text: String
    let components: [Component]

    init(_ text: String) {
        self.text = text

        let nsText = text as NSString

        // find the ranges of the string that have URLs
        let wholeString = NSRange(location: 0, length: nsText.length)
        let results = linkDetector.matches(in: text, options: [], range: wholeString)

        var components: [Component] = []
        var index = 0
        for result in results {
            if result.range.location > index {
                components.append(.text(nsText.substring(with: NSRange(location: index, length: result.range.location - index))))
            }
            components.append(.link(nsText.substring(with: result.range), result.url!))
            index = result.range.location + result.range.length
        }

        if index < nsText.length {
            components.append(.text(nsText.substring(from: index)))
        }

        self.components = components
    }

    @GestureState private var isDetectingTap = false

    var body: some View {
        components.map { component in
            switch component {
            case .text(let text):
                return Text(text)
            case .link(let text, _):
                return Text(text)
                    .foregroundColor(.accentColor)
            }
        }.reduce(Text(""), +)
        // TODO actually make the links tappable
    }
}

struct LinkedText_Previews: PreviewProvider {
    static var previews: some View {
        LinkedText("This is some text with a link https://www.mattmoriarity.com/foo/bar and some more text")
    }
}
