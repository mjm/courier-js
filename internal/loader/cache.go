package loader

import (
	"context"
	"fmt"
	"sync"

	"github.com/graph-gophers/dataloader"
)

// WithLoaderCache creates a new context that includes a cache for dataloader items.
func WithLoaderCache(ctx context.Context) context.Context {
	return context.WithValue(ctx, contextCacheKey{}, &sync.Map{})
}

type contextCache struct {
	prefix string
}

var _ dataloader.Cache = (*contextCache)(nil)

type contextCacheKey struct{}

func (c *contextCache) Get(ctx context.Context, key dataloader.Key) (dataloader.Thunk, bool) {
	m := ctx.Value(contextCacheKey{})
	if m == nil {
		return nil, false
	}

	v, ok := m.(*sync.Map).Load(c.cacheKey(key))
	if !ok {
		return nil, false
	}
	return v.(dataloader.Thunk), true
}

func (c *contextCache) Set(ctx context.Context, key dataloader.Key, val dataloader.Thunk) {
	m := ctx.Value(contextCacheKey{})
	if m == nil {
		return
	}

	m.(*sync.Map).Store(c.cacheKey(key), val)
}

func (c *contextCache) Delete(ctx context.Context, key dataloader.Key) bool {
	v := ctx.Value(contextCacheKey{})
	if v == nil {
		return false
	}

	m := v.(*sync.Map)
	k := c.cacheKey(key)
	if _, ok := m.Load(k); ok {
		m.Delete(k)
		return true
	}
	return false
}

func (c *contextCache) Clear() {
	// we don't have a context, so we can't really do this one. awkward
}

func (c *contextCache) cacheKey(key dataloader.Key) string {
	return fmt.Sprintf("%s___%s", c.prefix, key.String())
}
