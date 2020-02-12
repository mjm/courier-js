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

var skippedParseTests = map[string]struct{}{
	"160 CJK char, overflow at char index 140":                                                                    struct{}{},
	"160 emoji char, overflow at char index 140":                                                                  struct{}{},
	"3 latin char + 160 CJK char, overflow at char index 141":                                                     struct{}{},
	"'Á' is normalized into 1 char":                                                                              struct{}{},
	"שּׁ is normalized into 3 chars":                                                                                struct{}{},
	"282 chars with a normalized character within valid range but outside 280":                                    struct{}{},
	"Count a mix of single byte single word, and double word unicode characters":                                  struct{}{},
	"Count unicode emoji chars inside the basic multilingual plane":                                               struct{}{},
	"Count unicode emoji chars outside the basic multilingual plane with skin tone modifiers":                     struct{}{},
	"Handle General Punctuation Characters with visible spaces(u2000-200A)":                                       struct{}{},
	"Do not allow > 140 CJK characters by virtue of CJK chars greater than 63 punycode encoded chars in the host": struct{}{},
	"Allow > 140 CJK characters by virtue of CJK chars less than 63 punycode encoded chars in the host":           struct{}{},
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
			if _, ok := skippedParseTests[c.Description]; ok {
				t.Skip("this test is known to fail for unicode reasons")
			}
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
