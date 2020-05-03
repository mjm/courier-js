package ping

import (
	"context"
	"net/http"

	"github.com/divan/gorilla-xmlrpc/xml"
	"github.com/gorilla/rpc"
	"go.opentelemetry.io/otel/api/trace"

	"github.com/mjm/courier-js/internal/functions"
	"github.com/mjm/courier-js/internal/write"
	"github.com/mjm/courier-js/internal/write/feeds"
)

type Handler struct {
	rpc        *rpc.Server
	commandBus *write.CommandBus
}

func NewHandler(commandBus *write.CommandBus, _ *feeds.CommandHandler) *Handler {
	h := &Handler{
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
	span := trace.SpanFromContext(ctx)

	if _, err := h.commandBus.Run(ctx, feeds.PingCommand{
		HomePageURL: args.HomePageURL,
	}); err != nil {
		span.RecordError(ctx, err)
		return err
	}

	response.Result.Message = "Thanks for the ping!"
	return nil
}
