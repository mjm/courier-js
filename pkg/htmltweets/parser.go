package htmltweets

import (
	"fmt"
	"io"
	"net/url"
	"regexp"
	"strings"

	"golang.org/x/net/html"
)

type parseResult struct {
	body      string
	mediaURLs []string
}

type parser struct {
	baseURL       *url.URL
	text          strings.Builder
	mediaURLs     []string
	urls          []string
	listType      string
	listItemCount int
	preformatted  bool
}

func (p *parser) parse(r io.Reader) (*parseResult, error) {
	doc, err := html.Parse(r)
	if err != nil {
		return nil, err
	}

	if err := p.visit(doc); err != nil {
		return nil, err
	}

	s := strings.TrimSpace(p.text.String())
	s = fmt.Sprintf("%s %s", s, strings.Join(p.urls, " "))

	var lines []string
	for _, line := range strings.Split(s, "\n") {
		lines = append(lines, strings.TrimSpace(line))
	}
	body := strings.Join(lines, "\n")

	return &parseResult{
		body:      body,
		mediaURLs: p.mediaURLs,
	}, nil
}

func (p *parser) visit(n *html.Node) error {
	switch n.Type {
	case html.DocumentNode:
		return p.visitChildren(n)
	case html.TextNode:
		return p.visitText(n)
	case html.ElementNode:
		return p.visitElement(n)
	}
	return nil
}

var whitespaceRegex = regexp.MustCompile("\\s+")

func (p *parser) visitText(n *html.Node) error {
	s := n.Data
	if !p.preformatted {
		s = whitespaceRegex.ReplaceAllString(s, " ")
	}
	p.text.WriteString(s)
	return nil
}

func (p *parser) visitElement(n *html.Node) error {
	switch n.Data {
	case "a":
		return p.visitAnchor(n)
	case "blockquote":
		return p.visitBlockquote(n)
	case "br":
		return p.visitBr()
	case "iframe":
		return p.visitIframe(n)
	case "img":
		return p.visitImg(n)
	case "li":
		return p.visitLi(n)
	case "ol":
		return p.visitOl(n)
	case "p":
		return p.visitP(n)
	case "ul":
		return p.visitUl(n)
	case "pre":
		return p.visitPre(n)
	}

	return p.visitChildren(n)
}

func (p *parser) visitChildren(n *html.Node) error {
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if err := p.visit(c); err != nil {
			return err
		}
	}
	return nil
}

var twitterUserRegex = regexp.MustCompile("^https?://(?:www.)?twitter.com/([A-Za-z0-9_]{1,15})/?$")

func (p *parser) visitAnchor(n *html.Node) error {
	attrs := attrMap(n)
	if href, ok := attrs["href"]; ok {
		matches := twitterUserRegex.FindStringSubmatch(href)
		if matches != nil {
			_, _ = fmt.Fprintf(&p.text, "@%s", matches[1])
			return nil
		}

		if err := p.addURL(href); err != nil {
			return err
		}
		if err := p.visitChildren(n); err != nil {
			return err
		}
	}
	return nil
}

func (p *parser) visitBlockquote(n *html.Node) error {
	attrs := attrMap(n)
	if class, ok := attrs["class"]; ok && class == "twitter-tweet" {
		return p.visitEmbeddedTweet(n)
	}

	p.text.WriteRune('“')
	if err := p.visitChildren(n); err != nil {
		return err
	}
	p.text.WriteRune('”')
	return nil
}

func (p *parser) visitBr() error {
	p.text.WriteRune('\n')
	return nil
}

var youtubeURLRegex = regexp.MustCompile("^https://www.youtube.com/embed/([A-Za-z0-9_]+)")

func (p *parser) visitIframe(n *html.Node) error {
	attrs := attrMap(n)
	if src, ok := attrs["src"]; ok {
		matches := youtubeURLRegex.FindStringSubmatch(src)
		if matches == nil {
			return nil
		}

		if err := p.addURL(fmt.Sprintf("https://www.youtube.com/watch?v=%s", matches[1])); err != nil {
			return err
		}
	}

	return nil
}

func (p *parser) visitImg(n *html.Node) error {
	attrs := attrMap(n)
	if src, ok := attrs["src"]; ok {
		if err := p.addMediaURL(src); err != nil {
			return err
		}
	}
	return nil
}

func (p *parser) visitLi(n *html.Node) error {
	if p.listType == "ol" {
		p.listItemCount++
		_, _ = fmt.Fprintf(&p.text, "%d. ", p.listItemCount)
	} else {
		p.text.WriteString("• ")
	}

	if err := p.visitChildren(n); err != nil {
		return err
	}

	p.text.WriteRune('\n')
	return nil
}

func (p *parser) visitOl(n *html.Node) error {
	p.listType = "ol"
	p.listItemCount = 0
	if err := p.visitChildren(n); err != nil {
		return err
	}
	p.listType = ""
	p.text.WriteRune('\n')
	return nil
}

func (p *parser) visitP(n *html.Node) error {
	if err := p.visitChildren(n); err != nil {
		return err
	}

	p.text.WriteString("\n\n")
	return nil
}

func (p *parser) visitUl(n *html.Node) error {
	p.listType = "ul"
	if err := p.visitChildren(n); err != nil {
		return err
	}
	p.listType = ""
	p.text.WriteRune('\n')
	return nil
}

func (p *parser) visitPre(n *html.Node) error {
	oldPreformatted := p.preformatted
	p.preformatted = true
	if err := p.visitChildren(n); err != nil {
		return err
	}
	p.preformatted = oldPreformatted
	p.text.WriteString("\n\n")
	return nil
}

var stripTrackingRegex = regexp.MustCompile("(.*)\\?.*$")

func (p *parser) visitEmbeddedTweet(n *html.Node) error {
	var foundHref string
	var visit func(n *html.Node)
	visit = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "a" {
			attrs := attrMap(n)
			if href, ok := attrs["href"]; ok && strings.HasPrefix(href, "https://twitter.com") {
				foundHref = href
				return
			}
		}

		for c := n.FirstChild; c != nil; c = c.NextSibling {
			visit(c)
		}
	}
	visit(n)

	if foundHref != "" {
		if err := p.addURL(stripTrackingRegex.ReplaceAllString(foundHref, "$1")); err != nil {
			return err
		}
	}

	return nil
}

func (p *parser) addURL(s string) error {
	u, err := url.Parse(s)
	if err != nil {
		return err
	}

	p.urls = append(p.urls, p.baseURL.ResolveReference(u).String())
	return nil
}

func (p *parser) addMediaURL(s string) error {
	u, err := url.Parse(s)
	if err != nil {
		return err
	}

	p.mediaURLs = append(p.mediaURLs, p.baseURL.ResolveReference(u).String())
	return nil
}

func attrMap(n *html.Node) map[string]string {
	a := make(map[string]string)
	for _, attr := range n.Attr {
		a[attr.Key] = attr.Val
	}
	return a
}
