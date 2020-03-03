package twittertext

import (
	"strings"

	"golang.org/x/net/idna"

	"github.com/mjm/courier-js/pkg/twittertext/regex"
)

type Entity struct {
	Start    int
	End      int
	Value    string
	ListSlug string
	Type     EntityType
}

type EntityType int

const (
	URLEntity EntityType = iota
	HashtagEntity
	MentionEntity
	CashtagEntity
)

const (
	MaxURLLength     = 4096
	MaxTcoSlugLength = 40
)

var URLGroupProtocolLength = len("https://")

var profile = idna.New(idna.VerifyDNSLength(true))

func extractURLs(text string) []Entity {
	if text == "" || strings.Index(text, ".") == -1 {
		return nil
	}

	var urls []Entity

	for m, _ := regex.ValidURL.FindStringMatch(text); m != nil; m, _ = regex.ValidURL.FindNextMatch(m) {
		protocol := m.GroupByNumber(regex.ValidURLGroupProtocol).String()
		if protocol == "" {
			before := m.GroupByNumber(regex.ValidURLGroupBefore).String()
			if ok, _ := regex.InvalidURLWithoutProtocolMatchBegin.MatchString(before); ok {
				continue
			}
		}

		urlGroup := m.GroupByNumber(regex.ValidURLGroupURL)
		start, end := urlGroup.Index, urlGroup.Index+urlGroup.Length
		url := urlGroup.String()

		tcoMatch, _ := regex.ValidTcoURL.FindStringMatch(url)
		if tcoMatch != nil {
			tcoURL := tcoMatch.String()
			tcoURLSlug := tcoMatch.GroupByNumber(1).String()
			if len(tcoURLSlug) > MaxTcoSlugLength {
				continue
			}
			url = tcoURL
			end = start + len(url)
		}

		host := m.GroupByNumber(regex.ValidURLGroupDomain).String()
		if isValidHostAndLength(len(url), protocol, host) {
			urls = append(urls, Entity{
				Start: start,
				End:   end,
				Value: url,
				Type:  URLEntity,
			})
		}
	}

	return urls
}

func isValidHostAndLength(originalUrlLength int, protocol string, originalHost string) bool {
	if originalHost == "" {
		return false
	}
	host, err := profile.ToASCII(originalHost)
	if err != nil {
		return false
	}
	if host == "" {
		return false
	}
	// The punycodeEncoded host length might be different now, offset that length from the URL.
	urlLength := originalUrlLength + len(host) - len(originalHost)
	// Add the protocol to our length check, if there isn't one,
	// to ensure it doesn't go over the limit.
	if protocol == "" {
		urlLength += URLGroupProtocolLength
	}
	return urlLength <= MaxURLLength
}
