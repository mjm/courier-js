package locatefeed

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"golang.org/x/net/html"
)

var feedTypes []string = []string{
	"json", "atom", "rss",
}

func handleHTML(ctx context.Context, u *url.URL, res *http.Response) (*url.URL, error) {
	defer res.Body.Close()

	doc, err := html.Parse(res.Body)
	if err != nil {
		return nil, err
	}

	links := linkNodes(doc)

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

	return nil, fmt.Errorf("no valid feed links found on %q", u.String())
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
