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
		feedSetCommand,
	},
}

var feedListCommand = &cli.Command{
	Name:    "list",
	Aliases: []string{"ls", "l"},
	Usage:   "List a user's feeds",
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
			fe := e.(feeds2.FeedEdge)

			fmt.Printf("%s\t%s (%s)\n", fe.ID, fe.Title, fe.URL)
		}

		return nil
	},
}

var feedSubscribeCommand = &cli.Command{
	Name:      "subscribe",
	Aliases:   []string{"sub"},
	Usage:     "Subscribe to a new feed",
	ArgsUsage: "[url]",
	Action: func(ctx *cli.Context) error {
		u := ctx.Args().Get(0)
		userID := ctx.String("user")

		if u == "" || userID == "" {
			return cli.ShowSubcommandHelp(ctx)
		}

		fmt.Fprintf(os.Stderr, "Subscribing to feed at %s as %s\n", u, userID)

		feedID := model.NewFeedID()
		cmd := feeds.SubscribeCommand{
			UserID: userID,
			FeedID: feedID,
			URL:    u,
		}
		if _, err := commandBus.Run(ctx.Context, cmd); err != nil {
			return err
		}

		fmt.Fprintf(os.Stderr, "Done. New feed ID: %s\n", feedID)
		return nil
	},
}

var feedRefreshCommand = &cli.Command{
	Name:      "refresh",
	Usage:     "Check current feed contents",
	ArgsUsage: "[id]",
	Flags: []cli.Flag{
		&cli.BoolFlag{
			Name:    "force",
			Aliases: []string{"f"},
			Usage:   "ignore caching headers and refetch the feed contents",
		},
	},
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
			Force:  ctx.Bool("force"),
		}
		if _, err := commandBus.Run(ctx.Context, cmd); err != nil {
			return err
		}

		fmt.Fprintf(os.Stderr, "Done.\n")
		return nil
	},
}

var feedSetCommand = &cli.Command{
	Name:      "set",
	Usage:     "Set options about a feed",
	ArgsUsage: "[id]",
	Flags: []cli.Flag{
		&cli.BoolFlag{
			Name:  "autopost",
			Usage: "post imported tweets automatically after a short delay",
		},
	},
	Action: func(ctx *cli.Context) error {
		id := ctx.Args().Get(0)
		userID := ctx.String("user")

		if id == "" || userID == "" {
			return cli.ShowSubcommandHelp(ctx)
		}

		feedID := model.FeedID(id)

		autopost := ctx.Bool("autopost")
		if autopost {
			fmt.Fprintf(os.Stderr, "Enabling autoposting for feed %s as %s\n", feedID, userID)
		} else {
			fmt.Fprintf(os.Stderr, "Disabling autoposting for feed %s as %s\n", feedID, userID)
		}

		cmd := feeds.UpdateOptionsCommand{
			UserID:   userID,
			FeedID:   feedID,
			Autopost: autopost,
		}
		if _, err := commandBus.Run(ctx.Context, cmd); err != nil {
			return err
		}

		fmt.Fprintf(os.Stderr, "Done.\n")
		return nil
	},
}
