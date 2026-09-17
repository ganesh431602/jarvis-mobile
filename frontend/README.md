# Frontend foundation

The future React/Vite client is organized by feature. `app/` owns composition and navigation; `features/` own screens and feature presentation; `components/` owns reusable UI; `services/` owns REST clients; `hooks/`, `styles/`, and `types/` remain frontend-specific. `lib/` is reserved for framework-level utilities and configuration.

Frontend code never accesses Supabase or PostgreSQL directly and contains no authoritative business or security rules.
