# Android Security Baseline

Required Android production settings:

- Cleartext HTTP disabled.
- HTTPS/TLS only.
- Backup disabled unless explicitly required and reviewed.
- Android data extraction/backup rules explicitly configured.
- No API keys, service-role keys, OAuth client secrets, passwords, OTPs, or payment credentials in APK resources.
- Tokens stored only through platform-secure storage.
- WebView disabled unless explicitly required.
- If WebView is required: no unrestricted JavaScript bridges, no arbitrary file access, HTTPS allowlist only.
- Exported activities/services/receivers/providers require explicit justification.
- Deep links must validate destination and authentication state.
- Debuggable=false in release.
- Release builds must not use development endpoints.
- Network Security Config must prohibit cleartext traffic.
- Sensitive logs disabled in release.
- Root/debug/test bypasses must not ship.
- Certificate pinning is optional and requires an operational rotation strategy; it must not be added blindly.
