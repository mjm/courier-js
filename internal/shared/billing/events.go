package billing

type CustomerCreated struct {
	UserID     string
	CustomerID string
}

type SubscriptionCreated struct {
	UserID         string
	SubscriptionID string
}
