package main

import (
	"fmt"
	"os"

	"github.com/urfave/cli/v2"

	"github.com/mjm/courier-js/internal/pager"
	feeds2 "github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/shared/model"
	"github.com/mjm/courier-js/internal/write/feeds"
)

var feedCommand = &cli.Command{
	Name:  "feed",
	Usage: "Commands for working with a user's feeds",
	Subcommands: []*cli.Command{
		feedListCommand,
		feedSubscribeCommand,
		feedRefreshCommand,
	},
}

var feedListCommand = &cli.Command{
	Name:    "list",
	Aliases: []string{"ls", "l"},
	Usage:   "list feeds",
	Flags: []cli.Flag{
		&cli.IntFlag{
			Name:  "limit,n",
			Usage: "number of feeds to list",
			Value: 30,
		},
	},
	Action: func(ctx *cli.Context) error {
		userID := ctx.String("user")
		limit := ctx.Int("limit")

		if userID == "" {
			return cli.ShowSubcommandHelp(ctx)
		}

		conn, err := feedQueries.Paged(ctx.Context, userID, pager.First(int32(limit), nil))
		if err != nil {
			return err
		}

		for _, e := range conn.Edges {
			fe := e.(*feeds2.FeedEdge)

			fmt.Printf("%s\t%s (%s)\n", fe.ID, fe.Title, fe.URL)
		}

		return nil
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
			return cli.ShowSubcommandHelp(ctx)
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
