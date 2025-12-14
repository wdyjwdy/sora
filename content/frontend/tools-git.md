---
title: Git
category: Tools
toc: true
---

## Init

### Creating a Local Repository

1. Run `git init`.

```
fruits
  ├── apple.txt
  └── banana.txt
```

2. Git will create the folder `.git`.

```diff
fruits
  ├── apple.txt
  ├── banana.txt
+ └── .git
```

## Add

```sh
$ git add hello.txt # stage hello.txt
$ git add fruits # stage all files under the fruits directory
$ git add . # stage all files
$ git add *.js # stage all js files
```

### Staging a File

1. Run `git add hello.txt`.

```
project
  └── hello.txt (content is "hello")
```

2. Git will create a **blob object** `.git/objects/ce01362`.
   - blob file name: ce01362 (hash of "hello")
   - blob file content: "hello"

```diff
+ .git/objects/ce01362
```

```sh
$ git cat-file -t ce01362 # type
#> blob

$ git cat-file -p ce01362 # value
#> hello
```

3. Git will add an entry to the Index.
   - entry format: file name, file path

```diff
# .git/index
+ ce01362 hello.txt
```

> - If two files have identical content, their hashes are the same, so only one blob object is created.
> - Empty directories are not tracked by Git.

## Commit

```sh
$ git commit # commit and using Vim to enter the Commit Message.
$ git commit -m 'update' # commit and using "update" as the Commit Message.
$ git commit --amend # equivalent to 'git reset --soft HEAD~1 & git commit'.
```

### Recording Changes to the Repository

1. Run `git commit -m 'update'`.

```sh
$ git ls-files -s # index
#> 4c479de fruits/apple.txt
#> 637a09b fruits/banana.txt
#> ce01362 hello.txt
```

2. Git will create two **tree objects** to record the file tree.

```diff
.git/objects
+ ├── 3ea2839
+ └── b0665b8
```

```sh
$ git cat-file -t 3ea2839 # type
#> tree

$ git cat-file -p 3ea2839 # value
#> tree b0665b8 fruits
#> blob ce01362 hello.txt

$ git cat-file -t b0665b8 # type
#> tree

$ git cat-file -p b0665b8 # value
#> blob 4c479de apple.txt
#> blob 637a09b banana.txt
```

3. Git will create a **commit object** that points to the root tree.

```diff
+ .git/objects/705d22a
```

```sh
$ git cat-file -t 705d22a # type
#> commit

$ git cat-file -p 705d22a # value
#> tree 3ea2839
#> author ...
#> committer ...
#>
#> update
```

4. Git updates the current branch to point to the commit object.

```diff
- .git/refs/heads/main
+ .git/refs/heads/main
```

```sh
$ cat .git/refs/heads/main # value
#> 705d22a
```

## Branch

```sh
$ git branch # list all local branches
$ git branch -a # list all local and remote branches
$ git branch feat # create feat branch
$ git branch -d feat # delete feat branch
$ git branch -D feat # force delete feat branch
$ cat .git/refs/heads/main # show the branch's latest commit
$ cat .git/HEAD # show the current branch
```

### Creating a New Branch

1. Run `git branch feat`.

```
A <- B <- C (main*)
```

2. Git will create the file `.git/refs/heads/feat`, whose content points to the current commit.

```diff
+ .git/refs/heads/feat
```

```sh
$ cat refs/heads/feat # value
#> 846aac5 (commit C)
```

3. Done.

```
A <- B <- C (main*, feat)
```

### Deleting a Branch

1. Run `git branch -d feat`.

```
A <- B <- C (main*, feat)
```

2. Git will delete the file `.git/refs/heads/feat`.

```diff
- .git/refs/heads/feat
```

3. Done.

```
A <- B <- C (main*)
```

> Deleting a branch does not delete related blob objects.

## Switch

```sh
$ git switch feat # switch to the feat branch.
$ git switch -c feat # create and switch to the feat branch.
$ git switch --detach 6cc8ff6 # switch to the commit 6cc8ff6. (detached HEAD)
$ git switch - # return to the previous branch.
```

### Switching to a Branch

1. Run `git switch feat`.

```
A <- B <- C (main*, feat)
```

2. Update the HEAD file to point to the feat branch.

```diff
# .git/HEAD
- ref: refs/heads/main
+ ref: refs/heads/feat
```

3. Update the Index file to match the snapshot of the HEAD.

```diff
# .git/index
- staging area snapshot of the main branch
+ staging area snapshot of the feat branch
```

4. Update the Working Tree to match the Index.

```diff
# working directory
- working tree snapshot of the main branch
+ working tree snapshot of the feat branch
```

5. Done.

```
A <- B <- C (main, feat*)
```

> If your working directory or staging area has uncommitted changes that conflict with the branch you’re switching to, Git won't let you switch branches.

### Switching to a Commit

1. Run `git switch --detach B`.

```
A <- B <- C (main*)
```

2. Update the HEAD file to point to the commit B.

```diff
# .git/HEAD
- ref: refs/heads/main
+ d58f2f5 (commit B)
```

3. Update the Index file match the snapshot of the HEAD.

```diff
# .git/index
- staging area snapshot of the main branch
+ staging area snapshot of the commit B
```

4. Update the Working Tree to match the Index.

```diff
# working directory
- working tree snapshot of the main branch
+ working tree snapshot of the commit B
```

5. Done.

```
A <- B (*) <- C (main)
```

## Merge

### Fast-Forward

If the commit you want to merge is already ahead of your current commit, Git simply moves the pointer forward.

1. Run `git merge feat`.

```
A <- B (main*) <- C (feat)
```

2. Update the main branch pointer to point to the latest commit on the feat branch.
3. Done.

```
A <- B <- C (main*, feat)
```

### Three-Way Merge

If the commit you want to merge isn't a direct descendant of your current commit, Git does a three-way merge.

1. Run `git merge feat`.

```
A <- B (main*)
 \
  C (feat)
```

2. Create a new commit that points to the snapshot of the merge result.
3. Update the main branch pointer to point to the newly created commit.
4. Done.

```
A <- B <- M (main*)
 \       /
  C (feat)
```

### Three-Way Merge with Conflicts

1. Run `git merge feat`.

```
A <- B (main*)
 \
  C (feat)
```

2. Modify files with conflicts.

```diff
# hello.txt (conflict file)
- <<<<<<< HEAD
- hello main
- =======
- hello feat
- >>>>>>> feat
+ hello main and feat
```

3. Stage and commit the modified files.

```sh
$ git add hello.txt
$ git commit
```

4. Done.

```
A <- B <- M (main*)
 \       /
  C (feat)
```

### ORIG_HEAD

If you need to undo the merge you just performed, you can run `git reset ORIG_HEAD`.

## Rebase

Take all the changes that were committed on one branch and replay them on a different branch.

### Replaying Changes

1. Run `git rebase main`.

```
A <- B (main)
 \
  C (feat*)
```

2. Resubmit the commits from the feat branch to the main branch.
3. Update the feat branch pointer to point to the latest commit.
4. Done.

```
A <- B (main) <- C' (feat*)
```

### Replaying Changes with Conflicts

Almost identical to a [Three-Way Merge with Conflicts](#three-way-merge-with-conflicts), with the following differences:

- Rebase handles conflicts for each commit individually, while Merge handles conflicts for all commits at once.
- Rebase creates multiple new commits, while Merge creates only one new commit.
- Rebase moves the feature branch pointer, while Merge moves the main branch pointer.

## Cherry-Pick

```sh
$ git cherry-pick A # Apply commit A.
$ git cherry-pick A..C # Apply commits B, C.
```

### Applying a Single Commit

1. Run `git cherry-pick D`.

```
A <- B <- C <- D (main)
      \
       E <- F (feat*)
```

2. Apply commit D to the feat branch.
3. Done.

```
A <- B <- C <- D (main)
      \
       E <- F <- D' (feat*)
```

### Applying Multiple Commits

1. Run `git cherry-pick C..E`.

```
A <- B <- C <- D <- E (main)
      \
       F <- G (feat*)
```

2. Apply commits D and E to the feat branch.
3. Done.

```
A <- B <- C <- D <- E (main)
      \
       F <- G <- D' <- E' (feat*)
```

## Tag

```sh
$ git tag v1 # lightweight tag
$ git tag -a v1 -m 'version 1' # annotated tag
$ git tag -d v1 # delete tag
$ git tag # list tags
```

### Creating a Lightweight Tag

1. Run `git tag v1`.

```
A <- B <- C (main*)
```

2. Git will create the file `.git/refs/tags/v1`, whose content points to the current commit.

```sh
$ cat .git/refs/tags/v1 # value
#> a0f247e (commit C)
```

3. Done.

```
A <- B <- C (main*, tag:v1)
```

### Creating an Annotated Tag

1. Run `git tag -a v1 -m 'version 1'`.

```
a0f247e (HEAD -> main) commit 3
57ca93f commit 2
e7f88c9 commit 1
```

2. Git will create a **tag** object, which contains the current commit and tag message.

```diff
+ .git/objects/adf306e
```

```sh
$ git cat-file -t adf306e # type
#> tag

$ git cat-file -p adf306e # value
#> object a0f247e
#> type commit
#> tag v1
#> tagger wdyjwdy <email.com>
#>
#> version 1
```

3. Git will create the file `.git/refs/tags/v1`, whose content points to the tag object.

```sh
$ cat .git/refs/tags/v1 # value
#> adf306e (tag v1)
```

4. Done.

```
a0f247e (HEAD -> main, tag: v1) commit 3
57ca93f commit 2
e7f88c9 commit 1
```

## Clone

### Cloning a Remote Repository

1. Run `git clone <url>`.

```
Remote: A <- B <- C (main*)
Local:
```

2. Download the `.git` directory and rebuild the working tree.

```diff
+ hello.txt (working tree)
+ .git (repository)
```

3. Done.

```
Remote: A <- B <- C (main*)
Local:  A <- B <- C (main*, origin/main*)
```

> **origin/HEAD** points to the default branch of the remote repository.

## Fetch

```sh
$ git fetch origin # download objects and refs from 'origin'
$ git fetch # default is 'origin'
```

### Synchronizing Remote Repository

1. Run `git fetch`.

```
Remote: A <- B <- C (main*)
Local:  A <- B (main*, origin/main*)
```

2. Git will download related objects and refs.
3. Update the origin/main branch pointer to point to the latest remote commit.

```diff
# .git/refs/remotes/origin/main
- 5650cb4 (commit B)
+ 98890cc (commit C)
```

4. Done

```
Remote: A <- B <- C (main*)
Local:  A <- B (main*) <- C (origin/main*)
```

## Pull

```sh
$ git pull # fetch and merge.
$ git pull --ff-only # fetch and fast-forward merge.
$ git pull --rebase # fetch and rebase merge.
```

### Updating Remote Changes

1. Run `git pull`.

```
Remote: A <- B <- C (main*)
Local:  A <- B (main*, origin/main*)
```

2. Git will run `git fetch`.

```
Remote: A <- B <- C (main*)
Local:  A <- B (main*) <- C (origin/main*)
```

3. Git will run `git merge origin/main`.

```
Remote: A <- B <- C (main*)
Local:  A <- B <- C (main*, origin/main*)
```

## Push

```sh
$ git push origin feat # Push changes on the 'feat' to the remote 'origin'.
$ git push # default is 'origin current-branch'.
$ git push -u origin feat # Push changes and set upstream.
$ git push -d origin feat # Delete the remote 'origin/feat' branch.
```

### Pushing Local Changes

1. Run `git push`.

```
Remote: A <- B (feat)
Local:  A <- B (origin/feat) <- C (feat*)
```

2. Upload objects and refs.
3. Update the local origin/feat branch pointer to point to the latest commit.

```diff
# .git/refs/remotes/origin/feat (local)
- 5650cb4 (commit B)
+ 5637202 (commit C)
```

4. Update the remote feat branch pointer to point to the latest commit.

```diff
# .git/refs/heads/feat (remote)
- 5650cb4 (commit B)
+ 5637202 (commit C)
```

5. Done.

```
Remote: A <- B <- C (feat)
Local:  A <- B <- C (feat*, origin/feat)
```

> `git push` limits the content size to 1 MB, and you can configure it using `git config http.postBuffer`.

### Deleting a Remote Branch

1. Run `git push -d origin feat`.

```
Remote: A <- B <- C (feat)
Local:  A <- B <- C (origin/feat)
```

2. Git will delete the remote file `.git/refs/heads/feat`.

```diff
- .git/refs/heads/feat
```

3. Git will delete the local file `.git/refs/remotes/origin/feat`.

```diff
- .git/refs/remotes/origin/feat
```

4. Done.

```
Remote: A <- B <- C
Local:  A <- B <- C
```

## Revert

```sh
$ git revert A # revert commit A.
$ git revert A B # revert commit A, B.
$ git revert A..C # revert commit B, C.
```

### Reverting a Single Commit

1. Run `git revert B`.

```
A <- B <- C
```

2. Create a commit B' that is the opposite of commit B.
3. Done.

```
A <- B <- C <- B'
```

### Reverting Multiple Commits

1. Run `git revert B..D`.

```
A <- B <- C <- D
```

2. Create commit D', C' that are the opposites of commit D, C.
3. Done.

```
A <- B <- C <- D <- D' <- C'
```

> It will revert the latest commit D, then commit C.

## Reset

```sh
$ git reset --soft A # moves the HEAD to commit A.
$ git reset --mixed A # moves the HEAD to commit A, and updates the Index.
$ git reset --hard A # moves the HEAD to commit A, and updates the Index and Working Tree.
```

### Updating HEAD

1. Run `git reset --soft B`.

```
A <- B <- C (main*)
```

2. Update the main pointer to commit B.

```diff
# .git/refs/heads/main
- 947a868 (commit C)
+ 04022cf (commit B)
```

3. Done.

```
A <- B (main*)
```

### Updating HEAD, Index

1. Run `git reset --soft B`.

```
A <- B <- C (main*)
```

2. Update the main pointer to commit B.

```diff
# .git/refs/heads/main
- 947a868 (commit C)
+ 04022cf (commit B)
```

3. Update the Index file to match the snapshot of the commit B.

```diff
# .git/index
- staging area snapshot of the commit C
+ staging area snapshot of the commit B
```

4. Done.

```
A <- B (main*)
```

### Updating HEAD, Index, Working Tree

1. Run `git reset --soft B`.

```
A <- B <- C (main*)
```

2. Update the main pointer to commit B.

```diff
# .git/refs/heads/main
- 947a868 (commit C)
+ 04022cf (commit B)
```

3. Update the Index file to match the snapshot of the commit B.

```diff
# .git/index
- staging area snapshot of the commit C
+ staging area snapshot of the commit B
```

4. Update the Working Tree to match the Index.

```diff
# working directory
- working tree snapshot of the commit C
+ working tree snapshot of the commit B
```

5. Done.

```
A <- B (main*)
```

## Stash

```sh
$ git stash # save the Index and Working Tree.
$ git stash pop # restore the Index and Working Tree.
$ git stash drop stash@{0} # drop the stash at position 0.
$ git stash list # list all stashes.
```

### Saving the Working Tree.

1. Run `git stash`.

```
apple.txt (v3) # Working Tree
apple.txt (v2) # Index
apple.txt (v1) # Repository
```

2. Git will save the changes in the Working Tree as blob objects and record them in the commit.

```diff
.git/objects
+ ├── c68a266 (v3 blob)
+ ├── 246b33c (v3 tree)
+ └── d82a947 (v3 commit)
```

3. Git will create the file `.git/refs/stash`, whose content points to the commit object.

```diff
+ .git/refs/stash
```

```sh
$ cat .git/refs/stash # value
#> d82a947
```

4. Restoring the Working Tree and Index from the Repository.

```diff
# Working Tree
- apple.txt (v3)
+ apple.txt (v1)
# Index
- apple.txt (v2)
+ apple.txt (v1)
```

5. Done.

```
apple.txt (v1) # Working Tree
apple.txt (v1) # Index
apple.txt (v1) # Repository
```

### Restoring the Working Tree

1. Run `git stash pop`.

```
apple.txt (v1) # Working Tree
apple.txt (v1) # Index
apple.txt (v1) # Repository
```

2. Restoring the Working Tree from the Stash commit.

```diff
# Working Tree
- apple.txt (v1)
+ apple.txt (v3)
```

3. Delete the stash commit.
4. Done.

```
apple.txt (v3) # Working Tree
apple.txt (v1) # Index
apple.txt (v1) # Repository
```

> Note that the Index will not be restored.

## Restore

```sh
$ git restore apple.txt # discard changes to apple.txt
$ git restore --staged apple.txt # unstage apple.txt
```

### Restoring the Working Tree from the Index.

1. Run `git restore apple.txt`.

```
apple.txt (v3) # Working Tree
apple.txt (v2) # Index
apple.txt (v1) # Repository
```

2. Restore the Working Tree using the snapshot of the Index.

```diff
# working directory
- apple.txt (v3)
+ apple.txt (v2)
```

3. Done.

```
apple.txt (v2) # Working Tree
apple.txt (v2) # Index
apple.txt (v1) # Repository
```

### Restoring the Index from the Repository.

1. Run `git restore --staged apple.txt`.

```
apple.txt (v3) # Working Tree
apple.txt (v2) # Index
apple.txt (v1) # Repository
```

2. Restore the Index using the snapshot of the Repository.

```diff
# Index
- apple.txt (v2)
+ apple.txt (v1)
```

3. Done.

```
apple.txt (v3) # Working Tree
apple.txt (v1) # Index
apple.txt (v1) # Repository
```

## Status

### Viewing File Status

1. Run `git status -s`, status format: `XY Path`.
   - `X`: Index status
   - `Y`: Working Tree status
   - `Path`: File path

```sh
$ git status -s
#> MM a.txt
```

```color
@[indianred]{??} a.txt @[gray]{# file is untracked.}
 @[indianred]{M} a.txt @[gray]{# Index and Working Tree differ, existing file modified.}
@[seagreen]{M}  a.txt @[gray]{# Index and Repository differ, existing file modified.}
@[seagreen]{A}  a.txt @[gray]{# Index and Repository differ, new file added.}
```

## Log

```sh
$ git log # view commit history
$ git log --oneline
```

## Reflog

```sh
$ git reflog # view operation history
```

## Hooks

```color
@[seagreen]{Client-Side Hooks}
  | pre-commit         # Run after the commit command is executed.
  | prepare-commit-msg # Run after the default message is created.
  | commit-msg         # Run after the commit message is completed.
  | post-commit        # Run after the entire commit process is completed.

@[seagreen]{Server-Side Hooks}
  | pre-receive        # Run after a push is received.
  | update             # Run after a push is received. (once for each branch)
  | post-receive       # Run after the entire push process is completed.
```

> Note that client-side hooks are not copied when you clone a repository.

### Formatting Commit-Message

Modify the `.git/hooks/commit-msg` file.

```ts
#!/usr/bin/env bun

async function main() {
  const messagePath = process.argv[2];
  const messageText = await Bun.file(messagePath).text();

  if (/\d/.test(messageText)) {
    console.error("Must not contain numbers");
    process.exit(1);
  }
}

main();
```

### Setting Default Commit-Message

Modify the `.git/hooks/prepare-commit-msg` file.

```ts
#!/usr/bin/env bun

async function main() {
  const messagePath = process.argv[2];
  await Bun.file(messagePath).write("update");
}

main();
```

## Examples

### Adding a Local Repository to GitHub

```sh
$ git remote add origin repo-addr # Specify the address.
$ git push -u origin main # Specify the branch.
```

### Creating a Branch From a Commit

```sh
$ git switch --detach f5a72ba
$ git branch branch-name
```

### Changing a Branch Name

```sh
$ git branch --move old-name new-name # rename
$ git push -u origin new-name # push and set upstream
$ git push origin -d old-name # delete remote branch
```

### Recovering a Deleted Branch

```sh
$ git reflog # find the commit
$ git switch --detach 644e3c4 # switch to that commit
$ git switch -c feat # create and switch to a new branch
```

### Undo Reset Soft

```sh
# A <- B <- C (main*)
$ git reset --soft B
$ git reset --soft C # undo
```

### Undo Reset Mixed

```sh
# A <- B <- C (main*)
$ git reset B
$ git reset C # undo
```

### Undo Reset Hard

```sh
# A <- B <- C (main*)
$ git reset --hard B
$ git reset --hard C # undo
```

> Unstaged changes will be lost.
