---
name: create-issue
description: Create one GitHub issue with the project user-story template, assign the current GitHub user, and link the active local branch when GitHub supports it.
---

# Create issue

Use this skill when the user asks to create a GitHub issue for the repository in the current workspace. Do not use it to only edit an existing issue.

## Resolve the target

- Require a configured GitHub `origin` remote and resolve its `OWNER/REPO` from the remote or with `gh repo view`.
- Resolve the active GitHub user immediately before creating the issue with `gh api user --jq .login`. Assign that login to the new issue; do not infer an assignee from Git history or a previous session.
- Resolve the current local branch with `git branch --show-current`. Do not link a detached HEAD or the repository default branch.
- Confirm that the title does not already exist among open repository issues before creating a duplicate.

## Description pattern

Write the body in French, using exactly these sections. Derive the user story and the acceptance criteria from the user request and the inspected codebase; do not invent routes, status codes, models, dependencies, or test coverage.

```markdown
## User story

En tant que …, je souhaite …, afin de ….

## Contexte

…

## Critères d’acceptation

- [ ] …
```

- Keep each acceptance criterion observable and atomic.
- For API work, include the route name and method, required guard or authorization, response and error contracts, validation, relevant tests, and the corresponding Yaak request when applicable.
- Mention an existing issue only when its relationship has been verified.
- Preserve the supplied title format, such as `[API] Créer un utilisateur`.

## Create and assign

Create the issue with `gh issue create --repo <owner/repo> --assignee <current-login>`, using the prepared title and body. Keep any user-requested labels, but do not add labels, projects, milestones, or pull requests unless requested.

## Link the active branch

GitHub can natively link an issue only while creating a remote development branch. After the issue is created:

1. Check whether `origin/<current-branch>` already exists.
2. If it does not, run `gh issue develop <issue-number> --repo <owner/repo> --name <current-branch> --base <repository-default-branch>`. This creates a remote branch linked to the issue without publishing uncommitted local work.
3. Configure the existing local branch to track `origin/<current-branch>` with `git branch --set-upstream-to`. Do not push local commits as part of this skill.
4. Verify the association with `gh issue develop --list <issue-number> --repo <owner/repo>`.

If the branch already exists on `origin`, GitHub does not provide a way to attach it retrospectively to an issue. Do not create a placeholder pull request or alter an existing pull request solely to simulate the link. Report the limitation and the issue URL.

## Completion

Report the issue URL, assignee, and branch-link outcome. If issue creation succeeds but branch linking cannot be completed, keep the issue and clearly state why the link is unavailable.
