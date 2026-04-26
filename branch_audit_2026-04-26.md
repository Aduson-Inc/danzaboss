# Branch Audit Report (2026-04-26)

## Why I could not see the branches from your GitHub screenshot
Your screenshot shows branches that exist on **GitHub (remote)**, including `main` and `claude/...` branches.

In this container copy, Git has:
- no configured remotes,
- no remote-tracking refs,
- and only one local branch: `work`.

So Git can only list what is available locally, and without a remote (`origin`) + `git fetch`, it cannot see GitHub-hosted branches.

## Evidence from this environment
- `git remote -v` returned no output.
- `git branch -a` showed only `work`.
- `git config --get-regexp '^remote\..*'` returned no remote settings.

## Commands used
- `git remote -v`
- `git config --get-regexp '^remote\..*'`
- `git branch -a`
- `git for-each-ref --format='%(refname:short) %(objectname:short) %(committerdate:iso8601) %(subject)' refs/heads refs/remotes`
- `git log --oneline --decorate --graph --all --max-count=30`
- `rg -n -i "hockey|goal post|nhl|puck|ice rink|stanley" .`

## What I can do as soon as remote is connected
Once you provide the repo URL (or add `origin`), run:

```bash
git remote add origin <YOUR_GITHUB_URL>
git fetch --all --prune
git branch -a
```

Then I can produce exactly what you asked:
1. branch-by-branch comparison against `origin/main`,
2. list of unique commits per branch,
3. potential merge candidates,
4. and hockey-reference cleanup targets before deleting branches.

## Current local-only conclusion
From the current local clone only:
- no extra branches are available to compare with `main`,
- and no hockey keyword matches were found in tracked files.
