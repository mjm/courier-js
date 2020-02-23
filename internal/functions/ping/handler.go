package ping

import (
	"context"
	"net/http"

	"github.com/divan/gorilla-xmlrpc/xml"
	"github.com/gorilla/rpc"
	"golang.org/x/sync/errgroup"

	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	writefeeds "github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/pkg/scraper"
)

type Handler struct {
	rpc        *rpc.Server
	feeds      feeds.FeedQueries
	commandBus *write.CommandBus
}

func NewHandler(traceCfg trace.Config, feedQueries feeds.FeedQueries, commandBus *write.CommandBus, _ *writefeeds.CommandHandler) *Handler {
	trace.Init(traceCfg)

	h := &Handler{
		feeds:      feedQueries,
		commandBus: commandBus,
	}

	rpcHandler := rpc.NewServer()
	codec := xml.NewCodec()
	codec.RegisterAlias("weblogUpdates.ping", "weblogUpdates.Ping")
	rpcHandler.RegisterCodec(codec, "text/xml")
	rpcHandler.RegisterService(h, "weblogUpdates")

	h.rpc = rpcHandler

	return h
}

var _ functions.HTTPHandler = (*Handler)(nil)

func (h *Handler) HandleHTTP(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
	h.rpc.ServeHTTP(w, r.WithContext(ctx))
	return nil
}

func (h *Handler) Ping(r *http.Request, args *struct {
	Title       string
	HomePageURL string
}, response *struct {
	Result struct {
		HasError bool   `xml:"flerror"`
		Message  string `xml:"message"`
	}
}) error {
	ctx := r.Context()

	url := scraper.NormalizeURL(args.HomePageURL)
	trace.AddField(ctx, "feed.home_page_url", url)

	fs, err := h.feeds.ByHomePageURL(ctx, url)
	if err != nil {
		trace.Error(ctx, err)
		return err
	}

	trace.AddField(ctx, "feed.count", len(fs))

	group, groupCtx := errgroup.WithContext(ctx)
	for _, feed := range fs {
		group.Go(func() error {
			cmd := writefeeds.RefreshCommand{FeedID: feed.ID}
			if _, err := h.commandBus.Run(groupCtx, cmd); err != nil {
				return err
			}
			return nil
		})
	}

	if err := group.Wait(); err != nil {
		trace.Error(ctx, err)
		return err
	}

	response.Result.Message = "Thanks for the ping!"
	return nil
}
