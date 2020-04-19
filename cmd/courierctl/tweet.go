package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/urfave/cli/v2"

	"github.com/mjm/courier-js/internal/pager"
	"github.com/mjm/courier-js/internal/read/tweets"
	"github.com/mjm/courier-js/internal/shared/model"
	tweets2 "github.com/mjm/courier-js/internal/write/tweets"
)

var tweetCommand = &cli.Command{
	Name:  "tweet",
	Usage: "Commands for working with a user's tweets",
	Subcommands: []*cli.Command{
		tweetListCommand,
		tweetCancelCommand,
		tweetUncancelCommand,
		tweetPostCommand,
	},
}

var tweetListCommand = &cli.Command{
	Name:    "list",
	Aliases: []string{"ls", "l"},
	Usage:   "List upcoming or past tweets",
	Flags: []cli.Flag{
		&cli.StringFlag{
			Name:    "filter",
			Aliases: []string{"f"},
			Usage:   "filter to upcoming or past tweets",
			Value:   "upcoming",
		},
		&cli.IntFlag{
			Name:    "limit",
			Aliases: []string{"l"},
			Usage:   "number of tweets to list",
			Value:   15,
		},
	},
	Action: func(ctx *cli.Context) error {
		filter := tweets.Filter(strings.ToUpper(ctx.String("filter")))
		limit := int32(ctx.Int("limit"))
		userID := ctx.String("user")

		if userID == "" || (filter != tweets.UpcomingFilter && filter != tweets.PastFilter) {
			return cli.ShowSubcommandHelp(ctx)
		}

		conn, err := tweetQueries.Paged(ctx.Context, userID, filter, pager.First(limit, nil))
		if err != nil {
			return err
		}

		for _, e := range conn.Edges {
			tge := e.(*tweets.TweetGroupEdge)

			var text string
			if len(tge.Tweets) > 0 {
				text = tge.Tweets[0].Body
			} else {
				text = "RT " + tge.RetweetID
			}
			fmt.Printf("\n%s  %s\n%-10s%.80s\n", tge.FeedID(), tge.ItemID(), tge.Status, text)
			if tge.Status == model.Posted {
				switch tge.Action {
				case model.ActionTweet:
					for i, tweet := range tge.Tweets {
						fmt.Printf("%d. https://twitter.com/user/status/%s\n", i+1, tweet.PostedTweetID)
					}
				case model.ActionRetweet:
					fmt.Printf("1. https://twitter.com/user/status/%s\n", tge.PostedRetweetID)
				}
			}
		}

		return nil
	},
}

var tweetCancelCommand = &cli.Command{
	Name:      "cancel",
	Usage:     "Cancel posting an upcoming tweet",
	ArgsUsage: "[feed id] [item id]",
	Action: func(ctx *cli.Context) error {
		userID := ctx.String("user")
		feedID := model.FeedID(ctx.Args().Get(0))
		itemID := ctx.Args().Get(1)

		if userID == "" || feedID == "" || itemID == "" {
			return cli.ShowSubcommandHelp(ctx)
		}

		fmt.Fprintf(os.Stderr, "Canceling tweet %s %s as %s\n", feedID, itemID, userID)

		id := model.TweetGroupIDFromParts(userID, feedID, itemID)
		cmd := tweets2.CancelCommand{
			TweetGroupID: id,
		}
		if _, err := commandBus.Run(ctx.Context, cmd); err != nil {
			return err
		}

		fmt.Fprintf(os.Stderr, "Done.\n")
		return nil
	},
}

var tweetUncancelCommand = &cli.Command{
	Name:      "uncancel",
	Usage:     "Turn a canceled tweet back into a draft",
	ArgsUsage: "[feed id] [item id]",
	Action: func(ctx *cli.Context) error {
		userID := ctx.String("user")
		feedID := model.FeedID(ctx.Args().Get(0))
		itemID := ctx.Args().Get(1)

		if userID == "" || feedID == "" || itemID == "" {
			return cli.ShowSubcommandHelp(ctx)
		}

		fmt.Fprintf(os.Stderr, "Uncanceling tweet %s %s as %s\n", feedID, itemID, userID)

		id := model.TweetGroupIDFromParts(userID, feedID, itemID)
		cmd := tweets2.UncancelCommand{
			TweetGroupID: id,
		}
		if _, err := commandBus.Run(ctx.Context, cmd); err != nil {
			return err
		}

		fmt.Fprintf(os.Stderr, "Done.\n")
		return nil
	},
}

var tweetPostCommand = &cli.Command{
	Name:      "post",
	Usage:     "Post a draft tweet to Twitter",
	ArgsUsage: "[feed id] [item id]",
	Action: func(ctx *cli.Context) error {
		userID := ctx.String("user")
		feedID := model.FeedID(ctx.Args().Get(0))
		itemID := ctx.Args().Get(1)

		if userID == "" || feedID == "" || itemID == "" {
			return cli.ShowSubcommandHelp(ctx)
		}

		fmt.Fprintf(os.Stderr, "Posting tweet %s %s as %s\n", feedID, itemID, userID)

		id := model.TweetGroupIDFromParts(userID, feedID, itemID)
		cmd := tweets2.PostCommand{
			TweetGroupID: id,
		}
		if _, err := commandBus.Run(ctx.Context, cmd); err != nil {
			return err
		}

		fmt.Fprintf(os.Stderr, "Done.\n")
		return nil
	},
}
