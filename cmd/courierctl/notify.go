package main

import (
	"fmt"
	"os"

	"github.com/urfave/cli/v2"

	"github.com/mjm/courier-js/internal/shared/tweets"
)

var notifyCommand = &cli.Command{
	Name:  "notify",
	Usage: "Commands for sending push notifications",
	Subcommands: []*cli.Command{
		notifyImportedCommand,
		notifyPostedCommand,
	},
}

var notifyImportedCommand = &cli.Command{
	Name:      "imported",
	Usage:     "Send a notification for an imported tweet",
	ArgsUsage: "[feed id] [item id]",
	Flags: []cli.Flag{
		&cli.BoolFlag{
			Name:  "autopost",
			Usage: "will the tweet be autoposted",
			Value: false,
		},
	},
	Action: func(ctx *cli.Context) error {
		userID := ctx.String("user")
		feedID := ctx.Args().Get(0)
		itemID := ctx.Args().Get(1)

		if userID == "" || feedID == "" || itemID == "" {
			return cli.ShowSubcommandHelp(ctx)
		}

		fmt.Fprintf(os.Stderr, "Sending tweet imported notification for %s %s to %s\n", feedID, itemID, userID)

		evt := tweets.TweetsImported{
			UserId:         userID,
			FeedId:         feedID,
			CreatedItemIds: []string{itemID},
			Autopost:       ctx.Bool("autopost"),
		}
		events.Fire(ctx.Context, evt)

		return nil
	},
}

var notifyPostedCommand = &cli.Command{
	Name:      "posted",
	Usage:     "Send a notification for a posted tweet",
	ArgsUsage: "[feed id] [item id]",
	Flags: []cli.Flag{
		&cli.BoolFlag{
			Name:  "autopost",
			Usage: "was the tweet autoposted",
			Value: false,
		},
	},
	Action: func(ctx *cli.Context) error {
		userID := ctx.String("user")
		feedID := ctx.Args().Get(0)
		itemID := ctx.Args().Get(1)

		if userID == "" || feedID == "" || itemID == "" {
			return cli.ShowSubcommandHelp(ctx)
		}

		fmt.Fprintf(os.Stderr, "Sending tweet posted notification for %s %s to %s\n", feedID, itemID, userID)

		evt := tweets.TweetPosted{
			UserId:     userID,
			FeedId:     feedID,
			ItemId:     itemID,
			Autoposted: ctx.Bool("autopost"),
		}
		events.Fire(ctx.Context, evt)

		return nil
	},
}
