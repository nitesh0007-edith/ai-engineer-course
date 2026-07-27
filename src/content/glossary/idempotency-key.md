---
term: Idempotency key
definition: A unique value the client generates and attaches to a request (e.g. an `Idempotency-Key` header), so the server can recognize a retried request as the same one instead of a new one. The server stores the first response against the key; if the same key arrives again — because a retry followed a timeout, not an actual failure — it returns the cached response instead of processing the request twice. Without one, retrying a non-idempotent request (like "charge this card") can repeat its side effect.
---
