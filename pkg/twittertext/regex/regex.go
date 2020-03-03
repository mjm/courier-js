package regex

import (
	"strings"

	"github.com/dlclark/regexp2"
)

var (
	URLValidGTLD  = "(?:(?:" + strings.Join(GTLDS, "|") + ")(?=[^a-zA-Z0-9@]|$))"
	URLValidCCTLD = "(?:(?:" + strings.Join(CTLDS, "|") + ")(?=[^a-zA-Z0-9@]|$))"
)

var (
	InvalidCharactersPattern = "\\uFFFE" + // BOM
		"\\uFEFF" + // BOM
		"\\uFFFF" // Special
	DirectionalCharacters = "\\u061C" + // ARABIC LETTER MARK (ALM)
		"\\u200E" + // LEFT-TO-RIGHT MARK (LRM)
		"\\u200F" + // RIGHT-TO-LEFT MARK (RLM)
		"\\u202A" + // LEFT-TO-RIGHT EMBEDDING (LRE)
		"\\u202B" + // RIGHT-TO-LEFT EMBEDDING (RLE)
		"\\u202C" + // POP DIRECTIONAL FORMATTING (PDF)
		"\\u202D" + // LEFT-TO-RIGHT OVERRIDE (LRO)
		"\\u202E" + // RIGHT-TO-LEFT OVERRIDE (RLO)
		"\\u2066" + // LEFT-TO-RIGHT ISOLATE (LRI)
		"\\u2067" + // RIGHT-TO-LEFT ISOLATE (RLI)
		"\\u2068" + // FIRST STRONG ISOLATE (FSI)
		"\\u2069" // POP DIRECTIONAL ISOLATE (PDI)
	LatinAccentChars =
	// Latin-1
	"\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u00ff" +
		// Latin Extended A and B
		"\\u0100-\\u024f" +
		// IPA Extensions
		"\\u0253\\u0254\\u0256\\u0257\\u0259\\u025b\\u0263\\u0268\\u026f\\u0272\\u0289\\u028b" +
		// Hawaiian
		"\\u02bb" +
		// Combining diacritics
		"\\u0300-\\u036f" +
		// Latin Extended Additional (mostly for Vietnamese)
		"\\u1e00-\\u1eff"
	CyrillicChars    = "\\u0400-\\u04ff"
	PunctuationChars = "-_!\"#$%&'\\(\\)*+,./:;<=>?@\\[\\]^`\\{|}~"
)

var (
	URLValidPrecedingChars = "(?:[^a-zA-Z0-9@＠$#＃" + InvalidCharactersPattern + "]|[" + DirectionalCharacters + "]|^)"
	URLValidChars          = "[a-zA-Z0-9" + LatinAccentChars + "]"
	URLValidSubdomain      = "(?>(?:" + URLValidChars + "(?:[-_]|" + URLValidChars + ")*)?" + URLValidChars + "\\.)"
	URLValidDomainName     = "(?:(?:" + URLValidChars + "(?:-|" + URLValidChars + ")*)?" + URLValidChars + "\\.)"
)

var (
	URLValidUnicodeChars      = "[^" + PunctuationChars + "\\s\\p{Z}\\p{P}]"
	URLValidUnicodeDomainName = "(?:(?:" + URLValidUnicodeChars + "(?:-|" + URLValidUnicodeChars + ")*)?" + URLValidUnicodeChars + "\\.)"
)

var URLPunycode = "(?:xn--[-0-9a-z]+)"

var URLValidDomain = "(?:" + // optional sub-domain + domain + TLD
	URLValidSubdomain + "*" + URLValidDomainName + // e.g. twitter.com, foo.co.jp ...
	"(?:" + URLValidGTLD + "|" + URLValidCCTLD + "|" + URLPunycode + ")" +
	")" +
	"|(?:" + "(?<=https?://)" +
	"(?:" +
	"(?:" + URLValidDomainName + URLValidCCTLD + ")" + // protocol + domain + ccTLD
	"|(?:" +
	URLValidUnicodeDomainName + // protocol + unicode domain + TLD
	"(?:" + URLValidGTLD + "|" + URLValidCCTLD + ")" +
	")" +
	")" +
	")" +
	"|(?:" + // domain + ccTLD + '/'
	URLValidDomainName + URLValidCCTLD + "(?=/)" + // e.g. t.co/
	")"

var URLValidPortNumber = "[0-9]+"

var (
	URLValidGeneralPathChars = "[A-Za-z0-9!\\*';:=\\+,.\\$/%#\\[\\]\\-\\u2013_~\\|&@" + LatinAccentChars + CyrillicChars + "]"
	URLBalancedParens        = "\\(" +
		"(?:" +
		URLValidGeneralPathChars + "+" +
		"|" +
		// allow one nested level of balanced parentheses
		"(?:" +
		URLValidGeneralPathChars + "*" +
		"\\(" +
		URLValidGeneralPathChars + "+" +
		"\\)" +
		URLValidGeneralPathChars + "*" +
		")" +
		")" +
		"\\)"
	URLValidPathEndingChars = "[A-Za-z0-9=_#/\\-\\+" + LatinAccentChars + CyrillicChars + "]|(?:" +
		URLBalancedParens + ")"
	URLValidPath = "(?:" +
		"(?:" +
		URLValidGeneralPathChars + "*" +
		"(?:" + URLBalancedParens + URLValidGeneralPathChars + "*)*" +
		URLValidPathEndingChars +
		")|(?:@" + URLValidGeneralPathChars + "+/)" +
		")"
)

var (
	URLValidURLQueryChars       = "[a-zA-Z0-9!?\\*'\\(\\);:&=\\+\\$/%#\\[\\]\\-_\\.,~\\|@]"
	URLValidURLQueryEndingChars = "[a-zA-Z0-9\\-_&=#/]"
)

var ValidURLPattern = "(" + //  $1 total match
	"(" + URLValidPrecedingChars + ")" + //  $2 Preceding character
	"(" + //  $3 URL
	"(https?://)?" + //  $4 Protocol (optional)
	"(" + URLValidDomain + ")" + //  $5 Domain(s)
	"(?::(" + URLValidPortNumber + "))?" + //  $6 Port number (optional)
	"(/" +
	URLValidPath + "*" +
	")?" + //  $7 URL Path and anchor
	"(\\?" + URLValidURLQueryChars + "*" + //  $8 Query String
	URLValidURLQueryEndingChars + ")?" +
	")" +
	")"

var InvalidCharacters = regexp2.MustCompile(InvalidCharactersPattern, 0)

var InvalidURLWithoutProtocolMatchBegin = regexp2.MustCompile("[-_./]$", 0)

var ValidURL = regexp2.MustCompile(ValidURLPattern, 0)

const (
	ValidURLGroupAll         int = iota + 1
	ValidURLGroupBefore      int = 2
	ValidURLGroupURL         int = 3
	ValidURLGroupProtocol    int = 4
	ValidURLGroupDomain      int = 5
	ValidURLGroupPort        int = 6
	ValidURLGroupPath        int = 7
	ValidURLGroupQueryString int = 8
)

var ValidTcoURL = regexp2.MustCompile("^https?://t\\.co/([a-zA-Z0-9]+)(?:\\?"+
	URLValidURLQueryChars+"*"+URLValidURLQueryEndingChars+")?", 0)
