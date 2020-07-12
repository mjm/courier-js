import SwiftUI

struct Badge<Label: View, Image: View>: View {
    var label: Label
    var image: Image?
    var color: Color = .gray

    init(label: Label, image: Image, color: Color = .gray) {
        self.label = label
        self.image = image
        self.color = color
    }

    var body: some View {
        HStack(spacing: 6) {
            if let image = image {
                image
            }
            label
        }
            .font(Font.caption.weight(.medium))
            .foregroundColor(.white)
            .padding(.vertical, 4)
            .padding(.horizontal, 8)
            .background(color.cornerRadius(8))
    }
}

extension Badge where Image == EmptyView {
    init(label: Label, color: Color = .gray) {
        self.label = label
        self.color = color
    }
}

struct Badge_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            Badge(
                label: Text("Draft")
                    .foregroundColor(.black),
                image: Image(systemName: "questionmark.folder.fill")
                    .foregroundColor(.black),
                color: .green
            )
            Badge(
                label: Text("Canceled"),
                image: Image(systemName: "trash.fill")
            )
            Badge(
                label: Text("Posted"),
                image: Image(systemName: "checkmark.circle.fill"),
                color: .purple
            )
        }
        .previewLayout(.fixed(width: 300, height: 100))
    }
}
