## HEAD

- Head is a pointer to the current branch reference, which is thus a pointer to the last commit made on that branch

## Branches

- A branch is just a pointer to a specific commit

## Ignoring Files

- To remove a file (and it's tracking from a git repo):
  - `git rm <file>`
- To remove a file from tracking (but not the file itself)
  - `git rm --cached <file>`

## Rewrite History

- Can use `git rebase -i` in interactive mode
- The `edit (e)` flag in a rebase allows you to pause at that commit and make changes when rebasing interactively

## General

- Add and commit files `git commit -a`
- To rename in git (not show up as a delete and recreate) use `git mv`
- `--amend` with the `--no-edit` flag won't edit the commit message
  - Can change last commit date with `--amend` `--date`
- Going back a set number of commits (e.g. 2)
  - `HEAD~2`
  - `HEAD^^`
- `git reset` modifies where `HEAD` points tp
- `git reflog` records where `HEAD` has pointed to previously
  - To return to a place one before where `HEAD` currently is
    - `git reset --soft HEAD@{1}`
    - soft does not reset your working directory, whereas `--hard` will make your working directory exactly like the commit you reset to
- `git log -2` will only show you the last two commits
- go back a specific amount of commits in a rebase with `git rebase -i HEAD~2`
- `git update-index` can be used to update the git file index
  - can do things like add/removed to the tracked index, and plenty more
- `git add -i` gives an interacting add menu
- `git add -p` or `--patch` allows you to patch commits -> split a file's changes into different parts (or patches) to be put in different commits. You can edit the patches manually using the `e` option
- `git cherry-pick` grabs one commit and replays it onto the specific branch you are on
  - It is generally best-practice to squash commits before cherry-picking
  - This is like a rebase with just one commit
  - Since a branch name is a pointer to the latest commit on that branch, you can cherry-pick the latest commit on a branch by using `git cherry-pick <branchname>`
- `git rebase <branchname>` applies all commits on your current branch not in `branchname` on top of `<branchname>`
- `git log -S<word>` will search for all commits with the given word added within the source files
- `^` means parent of. E.g. `HEAD^` means the commit one before what `HEAD` is currently pointing to
- To find a commit that introduced a bug, run a custom script testing for the bug with `git bisect run -sh -c "command"`
  - Start a bisect with `git bisect start`
  - Give it a *good* commit without the bug with `git bisect good <commit>`
  - Give it a *bad* commit with the bug with `git bisect bad <commit>`
  - The use the `git bisect run` command. This will binary search throughout the commits to find the bug that first introduced the commit
  - You can have the bisect run command run a unit test, etc.
  - You can use git bisect for anything (e.g. performance improvements, etc.)