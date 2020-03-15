package tweets

import (
	"context"
	"fmt"

	"github.com/google/wire"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"
	"golang.org/x/sync/errgroup"

	"github.com/mjm/courier-js/internal/event"
	"github.com/mjm/courier-js/internal/shared/feeds"
	"github.com/mjm/courier-js/internal/write"
)

var EventHandlerSet = wire.NewSet(DefaultSet, NewEventHandler)

type EventHandler struct {
	commandBus *write.CommandBus
	subRepo    *FeedSubscriptionRepository
	postRepo   *PostRepository
}

func NewEventHandler(
	commandBus *write.CommandBus,
	events event.Source,
	subRepo *FeedSubscriptionRepository,
	postRepo *PostRepository,
	_ *CommandHandler,
) *EventHandler {
	h := &EventHandler{
		commandBus: commandBus,
		subRepo:    subRepo,
		postRepo:   postRepo,
	}
	events.Notify(h)
	return h
}

func (h *EventHandler) HandleEvent(ctx context.Context, evt interface{}) {
	ctx, span := tracer.Start(ctx, "tweets.HandleEvent",
		trace.WithAttributes(key.String("event.type", fmt.Sprintf("%T", evt))))
	defer span.End()

	switch evt := evt.(type) {

	case feeds.PostsImported:
		h.handlePostsImported(ctx, evt)

	case feeds.FeedSubscribed:
		if _, err := h.commandBus.Run(ctx, ImportRecentPostsCommand{
			UserID:         evt.UserId,
			SubscriptionID: feeds.SubscriptionID(evt.FeedSubscriptionId),
		}); err != nil {
			span.RecordError(ctx, err)
		}

	}
}

func (h *EventHandler) handlePostsImported(ctx context.Context, evt feeds.PostsImported) {
	span := trace.SpanFromContext(ctx)

	subs, err := h.subRepo.ByFeedID(ctx, feeds.FeedID(evt.FeedId))
	if err != nil {
		span.RecordError(ctx, err)
		return
	}

	var postIDs []feeds.PostID
	for _, id := range evt.PostIds {
		postIDs = append(postIDs, feeds.PostID(id))
	}

	posts, err := h.postRepo.ByIDs(ctx, postIDs)
	if err != nil {
		span.RecordError(ctx, err)
		return
	}

	wg, subCtx := errgroup.WithContext(ctx)

	for _, sub := range subs {
		cmd := ImportTweetsCommand{
			Subscription: sub,
			Posts:        posts,
		}
		wg.Go(func() error {
			_, err := h.commandBus.Run(subCtx, cmd)
			return err
		})
	}

	if err := wg.Wait(); err != nil {
		span.RecordError(ctx, err)
		return
	}
}
