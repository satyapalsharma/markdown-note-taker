# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

We take the security of this project seriously. If you discover a security vulnerability, please follow the steps below to report it responsibly.

1. **Do not** open a public GitHub issue for security-related bugs.
2. **Email** the maintainers directly at **security@example.com** with:
   - A description of the vulnerability and its potential impact.
   - Steps to reproduce the issue (proof-of-concept, screenshots, or logs).
   - The version(s) affected.
   - Any suggested remediation or workaround.
3. You will receive an acknowledgement within **5 business days**.
4. The maintainers will investigate and provide a fix timeline.
5. Once a fix is ready, a security advisory will be published and a new patch release will be issued.

---

## Security Best Practices

When contributing to this project, please keep the following in mind:

- **Never** commit secrets, API keys, or credentials to the repository.
- Use environment variables or a secrets manager for sensitive configuration.
- Validate and sanitise all user input on both client and server sides.
- Keep dependencies up to date and review security advisories regularly.
- Follow the principle of least privilege when requesting permissions.

Thank you for helping keep this project and its community safe.
