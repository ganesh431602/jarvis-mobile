# Client module

The client/project layer is a read/write in-memory boundary only. It is deliberately free of DB, external integration, payment, or secret handling. It exists to support future domain logic without affecting the backend authoritative security boundary.
