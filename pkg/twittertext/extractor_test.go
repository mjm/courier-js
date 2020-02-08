package twittertext

import (
	"fmt"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gopkg.in/yaml.v2"

	"github.com/mjm/courier-js/pkg/twittertext/regex"
)

type extractTestCases struct {
	Tests struct {
		URLs []struct {
			Description string
			Text        string
			Expected    []string
		}
		URLsWithIndicies []struct {
			Description string
			Text        string
			Expected    []struct {
				URL     string
				Indices []int
			}
		} `yaml:"urls_with_indices"`
	}
}

func TestExtractURLs(t *testing.T) {
	f, err := os.Open("testdata/extract.yml")
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close()

	fmt.Println(regex.ValidURLPattern)

	var cases extractTestCases
	if err := yaml.NewDecoder(f).Decode(&cases); err != nil {
		t.Fatal(err)
	}

	for _, c := range cases.Tests.URLs {
		exp := c.Expected
		t.Run(c.Description, func(t *testing.T) {
			results := extractURLs(c.Text)
			require.Equal(t, len(exp), len(results))
			for i, e := range exp {
				assert.Equal(t, URLEntity, results[i].Type)
				assert.Equal(t, e, results[i].Value)
			}
		})
	}

	for _, c := range cases.Tests.URLsWithIndicies {
		exp := c.Expected
		t.Run(c.Description, func(t *testing.T) {
			results := extractURLs(c.Text)
			require.Equal(t, len(exp), len(results))
			for i, e := range exp {
				assert.Equal(t, URLEntity, results[i].Type)
				assert.Equal(t, e.URL, results[i].Value)
				assert.Equal(t, e.Indices[0], results[i].Start)
				assert.Equal(t, e.Indices[1], results[i].End)
			}
		})
	}
}
