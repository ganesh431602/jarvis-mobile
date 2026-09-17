# Security module

This module owns security policy evaluation, deterministic risk classification, emergency locks, approval requirements, and fail-closed orchestration. It does not own permission definitions; those remain in the permissions boundary.

Global locks override every action. Narrower locks match module, agent, resource, or action selectors. Unknown identity, invalid lock state, unknown risk, missing approval, and missing policy inputs must deny or require approval; approval never overrides an active lock.
