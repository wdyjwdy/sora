---
title: Git
category: Tools
toc: true
---

## Init

### Creating a Local Repository

1. Run `git init`.

```tree
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
$ git add hello.txt # add hello.txt
$ git add fruits # add all files under the fruits directory
$ git add . # add all files
$ git add *.js # add all .js files
```

### Staging a File

1. Run `git add hello.txt`.

```tree
project
  └── hello.txt (content is "hello")
```

2. Git will create a blob object `objects/ce01362`.
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
$ git commit             # 提交 Index 中的内容到 Repository，并使用 Vim 输入 Commit Message。
$ git commit -m 'update' # 提交 Index 中的内容到 Repository，并使用 "update" 作为 Commit Message。
$ git commit --amend     # 等价于 git reset --soft HEAD~1 & git commit。
```

### Committing a File

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

```
Prior: A <- B <- C (main*)
After: A <- B <- C (main*, feat)
```

1. Run `git branch feat`.

```
846aac5 (HEAD -> main) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

2. Git will create the file `refs/heads/feat`, whose content points to the current commit.

```diff
+ .git/refs/heads/feat
```

```sh
$ cat refs/heads/feat # value
#> 846aac5
```

3. Done.

```
846aac5 (HEAD -> main, feat) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

### Deleting a Branch

```
Prior: A <- B <- C (main*, feat)
After: A <- B <- C (main*)
```

1. Run `git branch -d feat`.

```
846aac5 (HEAD -> main, feat) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

2. Git will delete the file `refs/heads/feat`.

```diff
- .git/refs/heads/feat
```

3. Done.

```
846aac5 (HEAD -> main) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

> Deleting a branch does not delete the **blob** object.

## Switch

```sh
$ git switch feat # switch to the feat branch.
$ git switch -c feat # create and switch to the feat branch.
$ git switch --detach 6cc8ff6 # switch to the commit 6cc8ff6. (detached HEAD)
$ git switch - # return to the previous branch.
```

### Switching to a Branch

```
Prior: A <- B <- C (main*, feat)
After: A <- B <- C (main, feat*)
```

1. Run `git switch feat`.

```
846aac5 (HEAD -> main, feat) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

2. Update the **HEAD** file to point to the feat branch.

```diff
- .git/HEAD
+ .git/HEAD
```

```sh
$ cat .git/HEAD # value
#> ref: refs/heads/feat
```

3. Update the **Index** file to match the snapshot of the HEAD.

```diff
- .git/index
+ .git/index
```

4. Update the **Working Tree** to match the Index.
5. Done.

```
846aac5 (HEAD -> feat, main) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

> If your working directory or staging area has uncommitted changes that conflict with the branch you’re switching to, Git won't let you switch branches.

### Switching to a Commit

```color
Prior: A <- B <- C (main*)
After: A <- B (*) <- C (main)
```

1. Run `git switch --detach d58f2f5`.

```sh
846aac5 (HEAD -> main) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

2. Update the **HEAD** file to point to the commit d58f2f5.

```diff
- .git/HEAD
+ .git/HEAD
```

```sh
$ cat .git/HEAD # value
#> d58f2f5
```

3. Update the **Index** file match the snapshot of the HEAD.

```diff
- .git/index
+ .git/index
```

4. Update the **Working Tree** to match the Index.
5. Done.

```
846aac5 (main) commit 3
d58f2f5 (HEAD) commit 2
43bed3d commit 1
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

```
Remote: A <- B <- C (main*)
Local Prior:
Local After:  A <- B <- C (main*, origin/main*)
```

1. Run `git clone <url>`.

```
# remote log
98890cc (HEAD -> main) commit 3
5650cb4 commit 2
8c7a5ee commit 1
```

2. Download the `.git` directory and rebuild the working tree.

```diff
+ hello.txt # Working Tree
+ .git # Repository
```

3. Done.

```
# local log
98890cc (HEAD -> main, origin/main, origin/HEAD) commit 3
5650cb4 commit 2
8c7a5ee commit 1
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

### FETCH_HEAD

Fetch 操作时会更新 FETCH_HEAD，指向了所 Fetch 的远程分支，
在指向 Pull 操作时，用来确定所 Merge 的目标。

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

```
Remote Prior: A <- B (feat)
Remote After: A <- B <- C (feat)
Local Prior: A <- B (origin/feat) <- C (feat*)
Local After: A <- B <- C (feat*, origin/feat)
```

1. Run `git push`.

```
# local log
5637202 (HEAD -> feat) commit 3
5650cb4 (origin/feat) commit 2
8c7a5ee commit 1
```

2. Upload objects.
3. Update the origin/feat branch pointer to point to the latest commit.
4. Done.

```
# loacl log
5637202 (HEAD -> feat, origin/feat) commit 3
5650cb4 commit 2
8c7a5ee commit 1
```

> `git push` limits the content size to 1 MB, and you can configure it using `git config http.postBuffer`.

### Deleting Remote Branches

1. Run `git push -d origin feat`.
2. delete the remote file `.git/refs/heads/feat`.
3. delete the local file `.git/refs/remotes/origin/feat`.

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
# working tree
- working tree snapshot of the commit C
+ working tree snapshot of the commit B
```

5. Done.

```
A <- B (main*)
```

## Stash

- `git stash`: 暂存 Working Tree 和 Index
- `git stash pop`: 取出暂存并恢复 Working Tree 和 Index
- `git stash drop stash@{0}`: 丢弃暂存
- `git stash list`: 查看暂存列表

### 暂存工作

1. 文件状态如下，执行 `ggit stash` 后，Git 内部会进行后续操作。

```
apple.txt (v3) # Working Tree
apple.txt (v2) # Index
apple.txt (v1) # Repository
```

2. 将 Working Tree 和 Index 的文件保存为 blob 对象，并记录在 commit 中。

```diff
.git/objects
# blob, tree, commit (apple.txt v3, Working Tree)
+ ├── c68a266
+ ├── 246b33c
+ ├── d82a947
# blob, tree, commit (apple.txt v2, Index)
+ ├── 280a3c0
+ ├── 7cf7b97
+ └── 4f98016
```

3. 添加 refs/stash 文件，指向记录 Working Tree 的 commit 对象。

```diff
+ .git/refs/stash
```

```sh
$ cat .git/refs/stash # value
d82a947
```

4. 用 HEAD 更新 Working Tree 和 Index。

```diff
# Working Tree
- apple.txt (v3)
+ apple.txt (v1)
# Index
- apple.txt (v2)
+ apple.txt (v1)
```

### 恢复工作

1. 文件状态如下，执行 `ggit stash pop` 后，Git 内部会进行后续操作。

```
apple.txt (v1) # Working Tree
apple.txt (v1) # Index
apple.txt (v1) # Repository
```

2. 用 stash commit 更新 Working Tree。

```diff
# Working Tree
- apple.txt (v1)
+ apple.txt (v3)
```

3. 删除暂存的工作。

> 注意 pop 操作不会更新 Index

## Restore

- `git restore apple.txt`: 丢弃对 apple.txt 的修改（Edit 的逆操作）
- `git restore --staged apple.txt`: 取消对 apple.txt 的添加（[Add](#add) 的逆操作）

### 丢弃修改

1. 文件状态如下，执行 `git restore apple.txt` 后，Git 内部会进行后续操作。

```
apple.txt (v3) # Working Tree
apple.txt (v2) # Index
apple.txt (v1) # Repository
```

2. 用 Index 的内容还原 Working Tree。

```diff
# Working Tree
- apple.txt (v3)
+ apple.txt (v2)
```

### 取消添加

1. 文件状态如下，执行 `git restore apple.txt` 后，Git 内部会进行后续操作。

```
apple.txt (v3) # Working Tree
apple.txt (v2) # Index
apple.txt (v1) # Repository
```

2. 用 Commit (HEAD) 的内容还原 Index。

```diff
# Index
- apple.txt (v2)
+ apple.txt (v1)
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

## Hooks (TODO)

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
