import SwiftUI
import RelaySwiftUI
import CourierGenerated

struct EditTweetList: View {
    let original: EditTweetInput
    @State private var draftTweetGroup: EditTweetInput?
    @Binding private var isEditing: Bool

    @Mutation(EditTweetMutation.self) var editTweet

    init(tweetGroup: EditTweetForm_tweetGroup.Data, isEditing: Binding<Bool>) {
        self._isEditing = isEditing
        self.original = EditTweetInput(existingData: tweetGroup)
    }

    var draft: EditTweetInput {
        get {
            if let draft = draftTweetGroup {
                return draft
            }
            return original
        }
        nonmutating set {
            if newValue == original {
                draftTweetGroup = nil
            } else {
                draftTweetGroup = newValue
            }
        }
    }

    var draftBinding: Binding<EditTweetInput> {
        Binding(
            get: { self.draft },
            set: { self.draft = $0 }
        )
    }

    var hasChanges: Bool {
        draftTweetGroup != nil
    }

    @ViewBuilder var body: some View {
        #if os(iOS)
        Form {
            ForEach(draft.tweets.indices, id: \.self) { idx in
                Section(header: Text("TWEET #\(idx + 1)")) {
                    EditTweetSection(tweet: draftBinding.tweets[idx])
                }
            }
        }
        .navigationBarBackButtonHidden(true)
        .navigationBarItems(
            leading: Button("Cancel") {
                isEditing = false
            },
            trailing: Button("Done") {
                editTweet.commit(draft)
                isEditing = false
            }.disabled(!hasChanges || editTweet.isInFlight)
        )
        #else
        Form {
            ForEach(draft.tweets.indices, id: \.self) { idx in
                Section(header: Text("TWEET #\(idx + 1)")) {
                    EditTweetSection(tweet: draftBinding.tweets[idx])
                }
            }
        }
        .overlay(savingOverlay)
        #endif
    }

    @ViewBuilder var savingOverlay: some View {
        if editTweet.isInFlight {
            LoadingView(text: "Saving tweets…")
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color.black.opacity(0.15))
        }
    }
}

struct EditTweetSection: View {
    @Binding var tweet: TweetEdit

    var body: some View {
        VStack {
            TextEditor(text: $tweet.body)
                .padding(.all, -5)
                .frame(minHeight: 200)
        }

        ForEach(tweet.theMediaURLs.indices, id: \.self) { mediaIdx in
            HStack {
                TextField("Image #\(mediaIdx + 1)", text: $tweet.theMediaURLs[mediaIdx])

                Button {
                    tweet.theMediaURLs.remove(at: mediaIdx)
                } label: {
                    Image(systemName: "minus.circle.fill")
                        .foregroundColor(.red)
                }
                .buttonStyle(BorderlessButtonStyle())
            }
        }

        Button {
            tweet.theMediaURLs.append("")
        } label: {
            HStack {
                Image(systemName: "plus")
                Text("Add Image")
            }
        }
        .disabled(tweet.theMediaURLs.count >= 4 || tweet.theMediaURLs.contains(where: { $0 == "" }))
    }
}

extension EditTweetInput: Equatable {
    init(existingData data: EditTweetForm_tweetGroup.Data) {
        self.init(
            id: data.id,
            tweets: data.tweets.map { TweetEdit(existingData: $0) }
        )
    }

    public static func ==(lhs: EditTweetInput, rhs: EditTweetInput) -> Bool {
        lhs.id == rhs.id && lhs.tweets == rhs.tweets
    }
}

extension TweetEdit: Equatable {
    init(existingData data: EditTweetForm_tweetGroup.Data.Tweet_tweets) {
        self.init(
            body: data.body,
            mediaURLs: data.mediaURLs
        )
    }

    var theMediaURLs: [String] {
        get { mediaURLs ?? [] }
        set { mediaURLs = newValue }
    }

    public static func ==(lhs: TweetEdit, rhs: TweetEdit) -> Bool {
        lhs.body == rhs.body && lhs.mediaURLs == rhs.mediaURLs
    }
}
