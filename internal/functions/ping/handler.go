package ping

import (
	"context"
	"net/http"

	"github.com/divan/gorilla-xmlrpc/xml"
	"github.com/gorilla/rpc"

	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/read/feeds"
	"github.com/mjm/courier-js/internal/trace"
	"github.com/mjm/courier-js/internal/write"
	writefeeds "github.com/mjm/courier-js/internal/write/feeds"
	"github.com/mjm/courier-js/pkg/scraper"
)

type Handler struct {
	rpc        *rpc.Server
	commandBus *write.CommandBus
	feeds      feeds.FeedQueries
}

func NewHandler(feedQueries feeds.FeedQueries, commandBus *write.CommandBus, _ *writefeeds.CommandHandler) *Handler {
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

	for _, feed := range fs {
		if _, err := h.commandBus.Run(ctx, writefeeds.QueueRefreshCommand{
			FeedID: feed.ID,
		}); err != nil {
			trace.Error(ctx, err)
			return err
		}
	}

	response.Result.Message = "Thanks for the ping!"
	return nil
}
