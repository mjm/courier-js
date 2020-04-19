package main

import (
	"fmt"
	"os"

	"github.com/urfave/cli/v2"

	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/write/feeds"
)

var feedCommand = &cli.Command{
	Name:  "feed",
	Usage: "work with a user's feeds",
	Subcommands: []*cli.Command{
		feedSubscribeCommand,
		feedRefreshCommand,
	},
}

var feedSubscribeCommand = &cli.Command{
	Name:      "subscribe",
	Aliases:   []string{"sub"},
	Usage:     "subscribe to a new feed",
	ArgsUsage: "[url]",
	Action: func(ctx *cli.Context) error {
		u := ctx.Args().Get(0)
		userID := ctx.String("user")

		if u == "" || userID == "" {
			return cli.ShowSubcommandHelp(ctx)
		}

		fmt.Fprintf(os.Stderr, "Subscribing to feed at %s as %s\n", u, userID)

		cmd := feeds.SubscribeCommand{
			UserID: userID,
			URL:    u,
		}
		if _, err := commandBus.Run(ctx.Context, cmd); err != nil {
			return err
		}

		fmt.Fprintf(os.Stderr, "Done.\n")
		return nil
	},
}

var feedRefreshCommand = &cli.Command{
	Name:      "refresh",
	Usage:     "check current feed contents",
	ArgsUsage: "[id]",
	Action: func(ctx *cli.Context) error {
		id := ctx.Args().Get(0)
		userID := ctx.String("user")

		if id == "" || userID == "" {
			cli.ShowSubcommandHelp(ctx)
		}

		feedID := model.FeedID(id)
		fmt.Fprintf(os.Stderr, "Refreshing feed %s as %s\n", feedID, userID)

		cmd := feeds.RefreshCommand{
			UserID: userID,
			FeedID: feedID,
		}
		if _, err := commandBus.Run(ctx.Context, cmd); err != nil {
			return err
		}

		fmt.Fprintf(os.Stderr, "Done.\n")
		return nil
	},
}
