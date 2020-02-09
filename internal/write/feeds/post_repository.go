package feeds

import (
	"context"
	"time"

	"github.com/HnH/qry"
	"github.com/lib/pq"

	"github.com/mjm/courier-js/internal/db"
	"github.com/mjm/courier-js/internal/write/feeds/queries"
)

// PostRepository fetches and stores information about posts imported from feeds.
type PostRepository struct {
	db db.DB
}

// NewPostRepository creates a new post repository targeting a given database.
func NewPostRepository(db db.DB) *PostRepository {
	return &PostRepository{db: db}
}

// FindByItemIDs loads the items from a feed that match the given item IDs. As long as
// there is no error, this will always return a slice of Posts that is the same length
// as the slice of item IDs passed in, with each Post having the item ID at the same
// index. If no post exists with a given item ID, its position will be nil.
func (r *PostRepository) FindByItemIDs(ctx context.Context, feedID int, itemIDs []string) ([]*Post, error) {
	rows, err := r.db.QueryxContext(ctx, queries.PostsByItemIDs, feedID, pq.StringArray(itemIDs))
	if err != nil {
		return nil, err
	}

	postsByItemID := make(map[string]*Post)
	for rows.Next() {
		var post Post
		if err := rows.StructScan(&post); err != nil {
			return nil, err
		}

		postsByItemID[post.ItemID] = &post
	}

	var posts []*Post
	for _, itemID := range itemIDs {
		posts = append(posts, postsByItemID[itemID])
	}

	return posts, nil
}

// CreatePostParams describes a single post that should be created.
type CreatePostParams struct {
	ItemID      string
	TextContent string
	HTMLContent string
	Title       string
	URL         string
	PublishedAt *time.Time
	ModifiedAt  *time.Time
}

// Create adds a collection of posts to a feed. Since many posts are often imported
// at once, we batch them into a single query.
func (r *PostRepository) Create(ctx context.Context, feedID int, ps []CreatePostParams) ([]*Post, error) {
	// avoid a query if there are no values
	if len(ps) == 0 {
		return nil, nil
	}

	u := db.NewUnnester("int4", "text", "text", "text", "text", "text", "timestamp", "timestamp")
	for _, p := range ps {
		published := fromTimePtr(p.PublishedAt)
		modified := fromTimePtr(p.ModifiedAt)
		u.AppendRow(feedID, p.ItemID, p.URL, p.Title, p.TextContent, p.HTMLContent, published, modified)
	}

	q := qry.Query(queries.PostsCreate).Replace("__unnested__", u.Unnest())
	rows, err := r.db.QueryxContext(ctx, string(q), u.Values()...)
	if err != nil {
		return nil, err
	}

	var posts []*Post
	for rows.Next() {
		var post Post
		if err := rows.StructScan(&post); err != nil {
			return nil, err
		}
		posts = append(posts, &post)
	}
	return posts, nil
}

// UpdatePostParams describes a single post that should be updated with new data
// from the feed.
type UpdatePostParams struct {
	ID          int
	TextContent string
	HTMLContent string
	Title       string
	URL         string
	PublishedAt *time.Time
	ModifiedAt  *time.Time
}

// Update modifies the content of a collection of posts. Posts cannot change their
// feed or item ID once created, but all other properties can be updated if the
// content in the feed changes.
func (r *PostRepository) Update(ctx context.Context, ps []UpdatePostParams) ([]*Post, error) {
	// avoid a query if there are no values
	if len(ps) == 0 {
		return nil, nil
	}

	u := db.NewUnnester("int4", "text", "text", "text", "text", "timestamp", "timestamp")
	for _, p := range ps {
		published := fromTimePtr(p.PublishedAt)
		modified := fromTimePtr(p.ModifiedAt)
		u.AppendRow(p.ID, p.URL, p.Title, p.TextContent, p.HTMLContent, published, modified)
	}

	q := qry.Query(queries.PostsUpdate).Replace("__unnested__", u.Unnest())
	rows, err := r.db.QueryxContext(ctx, string(q), u.Values()...)
	if err != nil {
		return nil, err
	}

	var posts []*Post
	for rows.Next() {
		var post Post
		if err := rows.StructScan(&post); err != nil {
			return nil, err
		}
		posts = append(posts, &post)
	}
	return posts, nil
}

func fromTimePtr(t *time.Time) (nt pq.NullTime) {
	if t != nil {
		nt.Valid = true
		nt.Time = *t
	}
	return
}
