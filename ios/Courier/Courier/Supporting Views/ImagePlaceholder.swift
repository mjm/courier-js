import SwiftUI

struct ImagePlaceholder: View {
    var body: some View {
        Image(systemName: "photo")
            .font(.system(size: 40))
            .frame(maxWidth: .infinity)
            .padding(50)
            .foregroundColor(Color(white: 0.4))
            .background(Color(white: 0.8))
            .cornerRadius(8)
    }
}

struct ImagePlaceholder_Previews: PreviewProvider {
    static var previews: some View {
        ImagePlaceholder()
            .padding(10)
    }
}
