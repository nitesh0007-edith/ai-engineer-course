---
term: JWT (JSON Web Token)
definition: A compact, signed token — three base64url segments joined by dots (header.payload.signature) — that a server issues after login and a client sends back on later requests to prove who it is, without the server storing session state. The payload (claims, e.g. user id, role, expiry) is only base64-encoded, not encrypted, so it is readable by anyone who has the token; the signature only proves the payload hasn't been tampered with, and only holds if the server's signing secret stays secret. Never put a real password or secret inside the payload.
---
