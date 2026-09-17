# Backend modules boundary

Each domain module owns its contracts, validation, routes, controllers, services, and repository interfaces when implemented. Modules communicate through explicit interfaces and must not import one another's internals.
