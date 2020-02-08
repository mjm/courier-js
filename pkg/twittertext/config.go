package twittertext

type WeightRange struct {
	Start  int
	End    int
	Weight int
}

type Config struct {
	Version                int
	MaxWeightedTweetLength int
	Scale                  int
	DefaultWeight          int
	EmojiParsingEnabled    bool
	TransformedURLLength   int
	Ranges                 []WeightRange
}

var ConfigV3 = Config{
	Version:                3,
	MaxWeightedTweetLength: 280,
	Scale:                  100,
	DefaultWeight:          200,
	EmojiParsingEnabled:    true,
	TransformedURLLength:   23,
	Ranges: []WeightRange{
		{
			Start:  0,
			End:    4351,
			Weight: 100,
		},
		{
			Start:  8192,
			End:    8205,
			Weight: 100,
		},
		{
			Start:  8208,
			End:    8223,
			Weight: 100,
		},
		{
			Start:  8242,
			End:    8247,
			Weight: 100,
		},
	},
}
