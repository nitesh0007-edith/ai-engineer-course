---
term: Server-Sent Events (SSE)
definition: >-
  A one-way streaming protocol over a plain HTTP response (`Content-Type:
  text/event-stream`) where the server keeps the connection open and pushes
  `data: ...` lines as they become available, instead of the client waiting
  for one complete response. It only flows server-to-client — no messages
  back on the same connection — which is exactly the shape of an LLM
  streaming its answer token by token. Simpler than a WebSocket when the
  client never needs to send more than the original request.
---
