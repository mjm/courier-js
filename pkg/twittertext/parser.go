package twittertext

import (
	"strings"
	"unicode/utf8"

	"golang.org/x/text/unicode/norm"

	"github.com/mjm/courier-js/pkg/twittertext/regex"
)

type Parser struct {
}

type ParseResults struct {
	WeightedLength   int
	Permillage       int
	Valid            bool
	DisplayTextRange Range
	ValidTextRange   Range
}

type Range struct {
	Start int
	End   int
}

// Parse parses tweet text and reports whether it is a valid tweet.
func Parse(tweet string, cfg Config) ParseResults {
	var results ParseResults

	if strings.TrimSpace(tweet) == "" {
		return results
	}

	normalizedTweet := norm.NFC.String(tweet)
	tweetLength := len(normalizedTweet)

	scaledMaxLength := cfg.MaxWeightedTweetLength * cfg.Scale
	transformedURLWeight := cfg.TransformedURLLength * cfg.Scale

	urlEntities := extractURLs(normalizedTweet)

	var hasInvalidCharacters bool
	var weightedCount, offset, validOffset int

	emojiMap := make(map[int]int)
	if cfg.EmojiParsingEnabled {
		for m, _ := regex.Emoji.FindStringMatch(normalizedTweet); m != nil; m, _ = regex.Emoji.FindNextMatch(m) {
			emojiMap[m.Index] = m.Length
		}
	}

	for offset < tweetLength {
		charWeight := cfg.DefaultWeight

		for i, urlEntity := range urlEntities {
			if urlEntity.Start == offset {
				urlLen := urlEntity.End - urlEntity.Start
				weightedCount += transformedURLWeight
				offset += urlLen
				if weightedCount <= scaledMaxLength {
					validOffset += urlLen
				}
				urlEntities = urlEntities[:i+copy(urlEntities[i:], urlEntities[i+1:])]
				break
			}
		}

		if offset < tweetLength {
			c, runeSize := utf8.DecodeRuneInString(normalizedTweet[offset:])

			var offsetDelta int
			if emojiLen, ok := emojiMap[offset]; ok {
				offsetDelta = emojiLen
			} else {
				for _, r := range cfg.Ranges {
					if c >= rune(r.Start) && c <= rune(r.End) {
						charWeight = r.Weight
						break
					}
				}
				offsetDelta = runeSize
			}

			weightedCount += charWeight
			hasNewInvalidCharacters, _ := regex.InvalidCharacters.MatchString(normalizedTweet[offset : offset+runeSize])
			hasInvalidCharacters = hasInvalidCharacters || hasNewInvalidCharacters
			offset += offsetDelta

			if !hasInvalidCharacters && weightedCount <= scaledMaxLength {
				validOffset += offsetDelta
			}
		}
	}

	normalizedOffset := len(tweet) - len(normalizedTweet)
	scaledWeightedLength := weightedCount / cfg.Scale
	isValid := !hasInvalidCharacters && scaledWeightedLength <= cfg.MaxWeightedTweetLength
	permillage := scaledWeightedLength * 1000 / cfg.MaxWeightedTweetLength
	return ParseResults{
		WeightedLength: scaledWeightedLength,
		Permillage:     permillage,
		Valid:          isValid,
		DisplayTextRange: Range{
			Start: 0,
			End:   offset + normalizedOffset - 1,
		},
		ValidTextRange: Range{
			Start: 0,
			End:   validOffset + normalizedOffset - 1,
		},
	}
}
