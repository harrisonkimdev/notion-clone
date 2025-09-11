# .github/copilot-instructions.md

> This file defines the rules that **GitHub Copilot** must follow when generating code, commits, or PR suggestions in this repository. Copilot should prioritize these rules over defaults.

---

## 0) Purpose and Scope

* This repository may use **TypeScript/JavaScript (React/Next.js)** and **Python**.
* Copilot must follow the conventions below for **coding style, naming, git usage, testing, security, and performance**.
* When examples exist, Copilot should match the same patterns.

---

## 1) Git Conventions

### 1.1 Commit Messages — Conventional Commits (Required)

Format:

```
<type>(<scope>): <summary>

<body>

<footer>
```

* **type**: `feat` | `fix` | `docs` | `style` | `refactor` | `perf` | `test` | `build` | `ci` | `chore` | `revert`
* **scope**: module/package/directory affected (optional)
* **summary**: max 50 chars, **imperative present tense** (e.g., "add", "fix")
* **body**: rationale, alternatives, impacts (if needed)
* **footer**: breaking changes, issue refs

  * `BREAKING CHANGE: <description>`
  * `Closes #123` / `Refs #123`

**Example**

```
feat(auth): add JWT token validation middleware

Introduce middleware to validate JWT on protected routes.
Closes #42
```

**Prohibited**

* Vague messages like `wip`, `temp`, `misc`
* Mixed languages — commit messages must be **English only**

### 1.2 Branch Naming

* Format: `type/short-kebab-summary` (+ issue number if applicable)
* Examples: `feat/user-login-ui-#42`, `fix/api-timeout`, `chore/update-deps`

### 1.3 Pull Requests

* **Title**: aligned with last commit message (Conventional Commit summary)
* **Body**: include background, changes, risks, test plan, screenshots (if UI), migration notes
* **Checklist** (Copilot should suggest a template):

  * [ ] Rationale is clear
  * [ ] User impact (UX/API) described
  * [ ] Tests/stories/sandbox included
  * [ ] Security/performance/accessibility considered
  * [ ] Migration/release notes included if needed

---

## 2) Naming & Code Style

### 2.1 General

* Use **descriptive, intention-revealing names**. Avoid unnecessary abbreviations.
* Follow language conventions:

  * **Python**: `snake_case` (variables, functions), `PascalCase` (classes), constants in `UPPER_CASE`
  * **TypeScript/JS**: `camelCase` (variables, functions), `PascalCase` (classes, React components)
* Comments explain the **why**, not the obvious **what**

---

## 3) GitHub Copilot Instructions

* Use **Korean only** when you respond, even if the user typed in English.
* Always use the **formal form of Korean**.
* Use **English only** when writing code, comments, or anything inside code blocks.
