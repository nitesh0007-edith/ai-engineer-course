---
term: Token bucket
definition: A rate-limiting algorithm where a bucket holds up to N tokens, refills at a fixed rate (e.g. 5 tokens/second), and each request must take one token to proceed. If the bucket is empty, the request is rejected (typically with `429 Too Many Requests`) until refill catches up. Unlike a simple fixed-window counter, it allows short bursts up to the bucket's capacity while still capping the long-run average rate.
---
