---
term: Lockfile
definition: A file (e.g. uv.lock) that records the exact version of every dependency — direct and transitive — actually resolved for a project, so a fresh install reproduces precisely the same set of packages everywhere. Without one, a loose version range in pyproject.toml can resolve to a different set of packages on a different day or a different machine.
---
