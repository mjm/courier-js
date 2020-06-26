import SwiftUI
import RelaySwiftUI

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

    var body: some View {
        Form {
            ForEach(draft.tweets.indices, id: \.self) { idx in
                Section(header: Text("TWEET #\(idx + 1)")) {
                    EditTweetSection(tweet: self.draftBinding.tweets[idx])
                }
            }
        }
            .navigationBarBackButtonHidden(true)
            .navigationBarItems(
                leading: Button("Cancel") {
                    self.isEditing = false
                },
                trailing: Button("Done") {
                    self.editTweet.commit(self.draft)
                    self.isEditing = false
                }.disabled(!hasChanges || editTweet.isInFlight)
            )
            .overlay(savingOverlay)
    }

    var savingOverlay: some View {
        Group {
            if editTweet.isInFlight {
                LoadingView(text: "Saving tweets…")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color.black.opacity(0.15))
            }
        }
    }
}

struct EditTweetSection: View {
    @Binding var tweet: TweetEdit

    var body: some View {
        Group {
            VStack {
                TextEditor(text: $tweet.body)
                    .padding(.all, -5)
                    .frame(minHeight: 200)
            }

            ForEach(tweet.theMediaURLs.indices, id: \.self) { mediaIdx in
                HStack {
                    TextField("Image #\(mediaIdx + 1)", text: self.$tweet.theMediaURLs[mediaIdx])
                    Button(action: {
                        self.tweet.theMediaURLs.remove(at: mediaIdx)
                    }) {
                        Image(systemName: "minus.circle.fill")
                            .foregroundColor(.red)
                    }.buttonStyle(BorderlessButtonStyle())
                }
            }
            Button(action: {
                self.tweet.theMediaURLs.append("")
            }) {
                HStack {
                    Image(systemName: "plus")
                    Text("Add Image")
                }
            }.disabled(tweet.theMediaURLs.count >= 4 || tweet.theMediaURLs.contains(where: { $0 == "" }))
        }
    }
}

extension EditTweetInput: Equatable {
    init(existingData data: EditTweetForm_tweetGroup.Data) {
        id = data.id
        tweets = data.tweets.map { TweetEdit(existingData: $0) }
    }

    static func ==(lhs: EditTweetInput, rhs: EditTweetInput) -> Bool {
        lhs.id == rhs.id && lhs.tweets == rhs.tweets
    }
}

extension TweetEdit: Equatable {
    init(existingData data: EditTweetForm_tweetGroup.Data.Tweet_tweets) {
        body = data.body
        mediaURLs = data.mediaURLs
    }

    var theMediaURLs: [String] {
        get { mediaURLs ?? [] }
        set { mediaURLs = newValue }
    }

    static func ==(lhs: TweetEdit, rhs: TweetEdit) -> Bool {
        lhs.body == rhs.body && lhs.mediaURLs == rhs.mediaURLs
    }
}
