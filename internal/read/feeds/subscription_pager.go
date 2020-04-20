package feeds

import (
	"github.com/mjm/courier-js/internal/pager"
)

type SubscriptionEdge struct {
	Subscription
	URL string `db:"url"`
}

func (e *SubscriptionEdge) Cursor() pager.Cursor {
	return pager.Cursor(e.URL)
}
