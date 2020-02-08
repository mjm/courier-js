package twittertext

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"gopkg.in/yaml.v2"
)

type validateTestCases struct {
	Tests struct {
		WeightedTweetsCounterTest []struct {
			Description string
			Text        string
			Expected    struct {
				WeightedLength    int `yaml:"weightedLength"`
				Valid             bool
				Permillage        int
				DisplayRangeStart int `yaml:"displayRangeStart"`
				DisplayRangeEnd   int `yaml:"displayRangeEnd"`
				ValidRangeStart   int `yaml:"validRangeStart"`
				ValidRangeEnd     int `yaml:"validRangeEnd"`
			}
		} `yaml:"WeightedTweetsCounterTest"`
	}
}

func TestParse(t *testing.T) {
	f, err := os.Open("testdata/validate.yml")
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close()

	var cases validateTestCases
	if err := yaml.NewDecoder(f).Decode(&cases); err != nil {
		t.Fatal(err)
	}

	for _, c := range cases.Tests.WeightedTweetsCounterTest {
		exp := c.Expected
		t.Run(c.Description, func(t *testing.T) {
			results := Parse(c.Text, ConfigV3)
			assert.Equal(t, exp.WeightedLength, results.WeightedLength)
			assert.Equal(t, exp.Valid, results.Valid)
			assert.Equal(t, exp.Permillage, results.Permillage)
			assert.Equal(t, exp.DisplayRangeStart, results.DisplayTextRange.Start)
			assert.Equal(t, exp.DisplayRangeEnd, results.DisplayTextRange.End)
			assert.Equal(t, exp.ValidRangeStart, results.ValidTextRange.Start)
			assert.Equal(t, exp.ValidRangeEnd, results.ValidTextRange.End)
		})
	}
}
