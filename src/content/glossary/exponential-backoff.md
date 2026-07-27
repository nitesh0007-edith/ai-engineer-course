---
term: Exponential backoff
definition: A client retry strategy where the wait between attempts grows geometrically (e.g. 0.5s, 1s, 2s, 4s, 8s) instead of retrying immediately, so a struggling server gets progressively more room to recover instead of being hit by an instant flood of retries. Real implementations add jitter (a small random amount added to each delay) so that many clients who failed at the same moment don't all retry in lockstep and re-create the exact spike that caused the failure.
---
