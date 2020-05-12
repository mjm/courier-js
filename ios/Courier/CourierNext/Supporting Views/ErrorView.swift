import Foundation
import SwiftUI

struct ErrorView: View {
    let error: Error

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundColor(.red)
                .font(.system(size: 40))
                .padding(.bottom, 10)
            Text(error.localizedDescription)
                .font(.headline)
                .foregroundColor(.red)
            if error is LocalizedError {
                if (error as! LocalizedError).failureReason != nil {
                    Text((error as! LocalizedError).failureReason!)
                        .font(.body)
                        .foregroundColor(.red)
                }
            }
        }.padding(.bottom, 200)
    }
}

struct ErrorView_Previews: PreviewProvider {
    static var previews: some View {
        ErrorView(error: FakeError(desc: "No Data Found", reason: "We couldn't load data from the network."))
    }
}

struct FakeError: LocalizedError {
    let desc: String
    let reason: String?

    var errorDescription: String? {
        return desc
    }

    var failureReason: String? {
        return reason
    }
}
