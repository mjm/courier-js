package locatefeed

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"
	"golang.org/x/net/html"
)

var (
	ErrNoValidLinks = errors.New("no valid feed links found")
)

var feedTypes = []string{
	"json", "atom", "rss",
}

func handleHTML(ctx context.Context, u *url.URL, res *http.Response) (*url.URL, error) {
	ctx, span := tracer.Start(ctx, "locatefeed.handleHTML",
		trace.WithAttributes(urlKey(u.String())))
	defer span.End()

	defer res.Body.Close()

	doc, err := html.Parse(res.Body)
	if err != nil {
		span.RecordError(ctx, err)
		return nil, err
	}

	links := linkNodes(doc)
	span.SetAttributes(key.Int("link_count", len(links)))

	for _, feedType := range feedTypes {
		for _, link := range links {
			if strings.Contains(getAttr(link, "type"), feedType) {
				href := getAttr(link, "href")
				if href != "" {
					newURL, err := url.Parse(href)
					if err != nil {
						continue
					}

					newURL = u.ResolveReference(newURL)
					resolved, err := Locate(ctx, newURL)
					if err == nil {
						return resolved, nil
					}
				}
			}
		}
	}

	span.RecordError(ctx, ErrNoValidLinks)
	return nil, fmt.Errorf("%w on %q", ErrNoValidLinks, u.String())
}

func linkNodes(doc *html.Node) []*html.Node {
	var linkNodes []*html.Node
	n := doc.FirstChild
	for n != nil {
		if n.Type == html.ElementNode {
			if n.Data == "link" {
				if getAttr(n, "rel") == "alternate" {
					linkNodes = append(linkNodes, n)
				}
			} else if n.Data == "head" || n.Data == "html" {
				n = n.FirstChild
				continue
			}
		}
		n = n.NextSibling
	}
	return linkNodes
}

func getAttr(n *html.Node, key string) string {
	for _, attr := range n.Attr {
		if attr.Key == key {
			return attr.Val
		}
	}
	return ""
}
