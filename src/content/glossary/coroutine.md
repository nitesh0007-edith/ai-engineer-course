---
term: Coroutine
definition: A function defined with `async def`. Calling it does not run the body — it returns a coroutine object, which only starts executing once you `await` it or schedule it as a task. A coroutine can pause at an `await` and hand control back to the event loop, which is what lets many coroutines make progress on one thread without any of them blocking the others.
---
