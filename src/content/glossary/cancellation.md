---
term: Cancellation
definition: Asking a running asyncio task to stop via `task.cancel()`. Cancellation is cooperative, not immediate — it raises `asyncio.CancelledError` inside the task at its next `await` point, so the task keeps running until it reaches one. Code that needs to release a resource on cancellation must do it in a `finally` block, since the exception path still runs it.
---
