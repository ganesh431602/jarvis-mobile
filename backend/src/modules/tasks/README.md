# Task module

The task service is an in-memory Phase 1 domain boundary. It validates assigned agents and evaluates every mutation through the existing security policy and lock service. Persistence can later implement `TaskRepository` without changing task logic.

No task routes, controllers, database persistence, client/finance behavior, or external execution are implemented in this batch.
