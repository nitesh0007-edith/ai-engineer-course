---
term: Event loop
definition: The single-threaded scheduler that runs your coroutines. It keeps a queue of tasks that are ready to make progress; it runs one until it hits an `await` on something not yet finished, then parks it and runs the next ready task. Nothing here runs in parallel — the loop only ever gives the CPU to one task at a time — but no task sits idle waiting for I/O while another task could be making progress.
---
