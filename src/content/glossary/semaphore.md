---
term: Semaphore
definition: A counter, shared across coroutines, that limits how many of them may be inside a section of code at once. `asyncio.Semaphore(n)` lets up to `n` coroutines past `acquire()` at the same time; the rest wait until one of the `n` finishes and releases it. Used to cap concurrent calls to a rate-limited API without giving up concurrency altogether.
---
