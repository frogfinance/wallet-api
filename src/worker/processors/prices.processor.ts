// the redis sortedSet key is the timestamp and the score is the comma-separated
// values BTC:USD,ETH:USD - this ensures uniqueness but also the ability to get
// prices on all tokens in a single lookup
// recalculate after 24 hours is up
