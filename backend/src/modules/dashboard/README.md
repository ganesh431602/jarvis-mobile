# Dashboard module

The dashboard is a read-only aggregation boundary. It summarizes safe operational state using existing security evaluation and lock checks, and never owns business logic or security policy implementation.

It may read counts from task and agent sources, but it must not become a dependency of those modules' implementation details or own their authorization logic.
