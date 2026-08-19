# Documentation index (AI & developers)

Central map for humans and AI assistants. Update **Last reviewed** when you change the linked doc.

| Document                                                                 | Purpose                                                   | Last reviewed |
| ------------------------------------------------------------------------ | --------------------------------------------------------- | ------------- |
| [ARCHITECTURE.md](ARCHITECTURE.md)                                       | Monorepo layout, multi-site, OpenAPI/Orval, CI, new sites | 2026-08-19    |
| [ROUTES.md](ROUTES.md)                                                   | HTTP API + admin/storefront route inventory               | 2026-08-19    |
| [CONVENTIONS.md](CONVENTIONS.md)                                         | Naming, UI stacks, patterns per workspace                 | 2026-08-19    |
| [site-registry.json](site-registry.json)                                 | Deployed sites metadata (DB, GCS, URLs)                   | 2026-08-19    |
| [../AGENTS.md](../AGENTS.md)                                             | Cross-tool agent entry (Cursor, Claude, Gemini, Copilot)  | 2026-08-19    |
| [../CLAUDE.md](../CLAUDE.md)                                             | Claude Code quick commands                                | 2026-08-19    |
| [../GEMINI.md](../GEMINI.md)                                             | Antigravity / Gemini overrides                            | 2026-08-19    |
| [../README.md](../README.md)                                             | Human quick start                                         | 2026-08-19    |
| [../.github/copilot-instructions.md](../.github/copilot-instructions.md) | GitHub Copilot entry                                      | 2026-08-19    |

## Cursor rules (`.cursor/rules/`)

| Rule                                                        | When it applies                                        |
| ----------------------------------------------------------- | ------------------------------------------------------ |
| `documentation-sync.mdc`                                    | Any change that affects documented behavior            |
| `api-contract.mdc`                                          | Zod schemas, OpenAPI registry, Orval, generated client |
| `multi-site.mdc`                                            | Site config, env vars, `create-site`                   |
| `storefront-ui.mdc`                                         | `client/` storefront                                   |
| `admin-ui.mdc`                                              | `admin/` dashboard                                     |
| `../client/.cursor/rules/product-tab-filtering-pattern.mdc` | Tab-driven product sections on storefront              |

## Workspace READMEs

| Path                                                                   | Audience                          |
| ---------------------------------------------------------------------- | --------------------------------- |
| [../client/README.md](../client/README.md)                             | Storefront developers             |
| [../admin/README.md](../admin/README.md)                               | Admin dashboard developers        |
| [../sites/beauty-station/README.md](../sites/beauty-station/README.md) | Beauty Station env / deploy notes |

## Sync policy

When code changes behavior, contracts, routes, or conventions, update the matching row above in the **same PR**. See `.cursor/rules/documentation-sync.mdc` for the full change → doc matrix.
