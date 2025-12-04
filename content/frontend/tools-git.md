---
title: Git
category: Tools
toc: true
---

## Init

### 新建本地仓库

1. 新建文件夹，执行 `git init` 命令。

```tree
fruits
  ├── apple.txt
  └── banana.txt
```

2. Git 自动创建 .git 文件夹。

```diff
fruits
  ├── apple.txt
  ├── banana.txt
+ └── .git
```

### 关联远程仓库

```sh
$ git remote add origin <repo-addr> # 指定地址
$ git push -u origin main # 指定分支
```

## Add

```sh
$ git add hello.txt # 添加 hello.txt
$ git add fruits    # 添加 fruits 目录下所有文件
$ git add .         # 添加所有文件
$ git add *.js      # 添加所有 js 文件
```

### 添加文件

![](tools-git-add)

1. 新建文件，执行 `git add hello.txt` 命令。

```color
hello @[gray]{# hello.txt}
```

2. Git 自动在 objects 目录下生成一个 blob 对象，用于记录 file content。
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

3. Git 自动在 index 中添加一条记录，用于记录 file name 和 file path。

```diff
- .git/index
+ .git/index
```

```sh
$ git ls-files -s # index
ce01362 hello.txt
```

> - 两个文件 content 相同，则 hash 也相同，因此只会生成一个 blob 对象。
> - 空文件夹不会被 Git 管理。

## Commit

```sh
$ git commit             # 提交 Index 中的内容到 Repository，并使用 Vim 输入 Commit Message。
$ git commit -m 'update' # 提交 Index 中的内容到 Repository，并使用 "update" 作为 Commit Message。
$ git commit --amend     # 等价于 git reset --soft HEAD~1 & git commit。
```

### 提交文件

![](tools-git-commit)

1. index 如下，执行 `git commit -m 'update'` 命令。

```sh
4c479de fruits/apple.txt
637a09b fruits/banana.txt
ce01362 hello.txt
```

2. Git 在 objects 目录下生成若干 tree 对象，以树的形式记录 index 中的文件列表。

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

3. Git 在 objects 目录下生成一个 commit 对象，记录了 tree 的根节点，和 Commit Message。

```diff
+ .git/objects/705d22a
```

```sh
$ git cat-file -t 705d22a # type
#> commit

$ git cat-file -p 705d22a # value
#> tree 3ea2839
#> author wdyjwdy <email.com>
#> committer wdyjwdy <email.com>
#>
#> update
```

4. Git 将当前分支指向生成的 commit 对象。

```diff
- .git/refs/heads/main
+ .git/refs/heads/main
```

```sh
$ cat .git/refs/heads/main # value
#> 705d22a
```

> 1. `HEAD^`: HEAD 的父节点
> 2. `HEAD^2`: HEAD 的第二个父节点
> 3. `HEAD~`: HEAD 的父节点
> 4. `HEAD~2`: HEAD 父节点的父节点

### 查看最新提交

1. 分支指针指向最新提交。

```sh
$ cat .git/refs/heads/main # value
846aac5
```

## Branch

### 新建分支

1. 提交历史如下，执行 `git branch feat` 后，Git 内部会进行后续操作。

```sh
846aac5 (HEAD -> main) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

2. 在 refs/heads 目录下创建一个名为 feat 的文件，内容为当前 commit。

```diff
+ .git/refs/heads/feat
```

```sh
$ cat refs/heads/feat # value
846aac5
```

3. 操作完成后，历史记录如下。

```sh
846aac5 (HEAD -> main, feat) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

### 删除分支

1. 提交历史如下，执行 `git branch -d feat` 后，Git 内部会进行后续操作。

```
846aac5 (HEAD -> main, feat) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

2. 删除 refs/heads 目录下的 feat 文件

```diff
- .git/refs/heads/feat
```

3. 操作完成后，历史记录如下。

```
846aac5 (HEAD -> main) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

> 删除分支后，分支上的 commit 对象并不会被删除，这些对象会变成垃圾对象。

### 查看当前分支

1. HEAD 文件指向当前分支。

```sh
$ cat .git/HEAD # value
ref: refs/heads/main
```

## Switch

- `git switch feat`: 切换到 feat 分支
- `git switch -c feat`: 创建并切换到 feat 分支
- `git switch --detach 6cc8ff6`: 切换到 6cc8ff6 提交

### 切换到分支

![](tools-git-switch)

1. 提交历史如下，执行 `git switch feat` 后，Git 内部会进行后续操作。

```sh
846aac5 (HEAD -> main, feat) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

2. 更新 HEAD 文件，将其指向 feat 分支。

```diff
- .git/HEAD
+ .git/HEAD
```

```sh
$ cat .git/HEAD # value
ref: refs/heads/feat
```

3. 更新 Index，内容为 feat 的文件列表（把 tree 展平得到的列表）。

```diff
- .git/index
+ .git/index
```

4. 更新 Working Tree，和 Index 保持一致。
5. 操作完成后，历史记录如下。

```sh
846aac5 (HEAD -> feat, main) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

### 切换到提交

![](tools-git-switch-detach)

1. 提交历史如下，执行 `git switch --detach d58f2f5` 后，Git 内部会进行后续操作。

```sh
846aac5 (HEAD -> main) commit 3
d58f2f5 commit 2
43bed3d commit 1
```

2. 更新 HEAD 文件，将其指向 d58f2f5。

```diff
- .git/HEAD
+ .git/HEAD
```

```sh
$ cat .git/HEAD # value
d58f2f5
```

3. 更新 Index，内容为 d58f2f5 的文件列表（把 tree 展平得到的列表）。

```diff
- .git/index
+ .git/index
```

4. 更新 Working Tree，和 Index 保持一致。
5. 操作完成后，历史记录如下。

```sh
846aac5 (main) commit 3
d58f2f5 (HEAD) commit 2
43bed3d commit 1
```

> - 如果想基于该提交工作，可以执行 `git switch -c <name>` 创建一个新分支。
> - 如果想返回之前的分支，可以执行 `git switch -`。

## Merge

### 快速合并

![](tools-git-merge-ff)

1. 提交历史如下，执行 `git merge feat` 后，Git 内部会进行后续操作。

```sh
* b0cd9f5 (feat) commit 3
* e1e6af3 (HEAD -> main) commit 2
* 1b157d3 commit 1
```

2. 更新 ORIG_HEAD 指针，指向 main 分支的最新提交，即 commit 2。

```diff
- .git/ORIG_HEAD
+ .git/ORIG_HEAD
```

```sh
$ cat .git/ORIG_HEAD # value
e1e6af3
```

3. 更新 main 分支指针，指向 feat 分支的最新提交，即 commit 3。

```diff
- .git/refs/heads/main
+ .git/refs/heads/main
```

```sh
$ cat .git/refs/heads/main # value
b0cd9f5
```

4. 操作完成后，历史记录如下。

```sh
* b0cd9f5 (HEAD -> main, feat) commit 3
* e1e6af3 commit 2
* 1b157d3 commit 1
```

### 三路合并

![](tools-git-merge)

1. 提交历史如下，执行 `git merge feat` 后，Git 内部会进行后续操作。

```sh
* a9532ef (HEAD -> main) commit 3
| * 88d8b74 (feat) commit 2
|/
* 34b711b commit 1
```

2. 更新 ORIG_HEAD 指针，指向 main 分支的最新提交，即 commit 3。

```diff
- .git/ORIG_HEAD
+ .git/ORIG_HEAD
```

```sh
$ cat .git/ORIG_HEAD # value
a9532ef
```

3. 创建一个新 commit，记录了 feat 中的修改。

```diff
.git/objects
+ ├── 03b2125 (tree)
+ └── cbd588d (commit)
```

```sh
$ git cat-file -p cbd588d # value
tree 03b2125
parent a9532ef # commit 3 （有两个父节点）
parent 88d8b74 # commit 2
author wdyjwdy <email.com>
committer wdyjwdy <email.com>

Merge branch 'feat'
```

4. 更新 main 分支指针，指向上一步的 commit。

```diff
- .git/refs/heads/main
+ .git/refs/heads/main
```

```sh
$ cat .git/refs/heads/main # value
cbd588d
```

5. 操作完成后，历史记录如下。

```sh
*   cbd588d (HEAD -> main) Merge branch 'feat'
|\
| * 88d8b74 (feat) commit 2
* | a9532ef commit 3
|/
* 34b711b commit 1
```

### 带冲突的三路合并

1. 提交历史如下，feat 和 main 在同一行上都有修改，执行 `git merge feat` 后，Git 内部会进行后续操作。

```sh
* fb1c925 (feat) commit 3
| * bcf8030 (HEAD -> main) commit 2
|/
* ccf620f commit 1
```

2. 更新 ORIG_HEAD 指针
3. 新增或修改一些文件，用于解决冲突。

```diff
- .git/index
+ .git/index
```

```sh
$ git ls-files -s # index 中记录冲突文件的三个版本
4c479de	apple.txt # commit 1 (root)
4a77268	apple.txt # commit 2 (main)
29b651e	apple.txt # commit 3 (feat)
```

```diff
+ .git/objects/b3535c9 # tree
+ .git/objects/675e90a # blob
```

```sh
$ git cat-file -p 675e90 # 冲突文件
apple
<<<<<<< HEAD
banana
=======
cherry
>>>>>>> feat
```

```diff
.git
+ ├── AUTO_MERGE # 指向解决冲突的文件
+ ├── MERGE_HEAD # 指向 feat 分支的最新提交
+ ├── MERGE_MODE # 合并模式
+ └── MERGE_MSG  # merge commit message
```

4. 用户解决冲突，即暂存了所有解决冲突的文件后，手动执行 `git commit` 命令手动进行提交。
5. 操作完成后，历史记录如下。

```sh
*   ab3525e (HEAD -> main) Merge branch 'feat'
|\
| * fb1c925 (feat) commit 3
* | bcf8030 commit 2
|/
* ccf620f commit 1
```

### ORIG_HEAD

Merge 操作时会更新 ORIG_HEAD，指向 Merge 前的 commit 对象，
需要撤销刚刚的 Merge 操作时，可以执行 `git reset ORIG_HEAD`。

## Rebase

### 应用分支

1. 提交历史如下，在 main 分支执行 `git merge feat` 后，Git 内部会进行后续操作。

```sh
* fda4ab8 (feat) commit 3
| * 3007e64 (HEAD -> main) commit 2
|/
* 2239c5b commit 1
```

2. 将 feat 分支中 root 节点之后的 commit（即 commit 3），重新提交到 main 分支上。

```diff
.git/objects
+ ├── 830241f # tree
+ └── 37ffdf1 # commit（哈希发生改变）
```

3. 更新 feat 分支指针，指向最新 commit。

```diff
- .git/refs/heads/feat
+ .git/refs/heads/feat
```

```sh
$ cat .git/refs/heads/feat # value
37ffdf1
```

4. 操作完成后，历史记录如下：

```sh
* 37ffdf1 (feat) commit 3
* 3007e64 (HEAD -> main) commit 2
* 2239c5b commit 1
```

### 带冲突的应用分支

和[带冲突的三路合并](#带冲突的三路合并)几乎一样，只有以下区别：

- 当有多个 commit 需要处理时，rebase 会逐个处理 commit 的冲突，而 merge 会一次性处理所有 commit 的冲突。
- rebase 会新增多个 commit，而 merge 只会新增一个 commit。
- rebase 会移动 feat 分支指针，而 merge 会移动 main 分支指针。

## Cherry-pick

### 应用单个提交

1. 提交历史如下，在 feat 分支执行 `git cherry-pick D`。

```
A <- B <- C <- D (main)
      \
       E <- F (feat)
```

2. 将 commit D 应用到 feat 分支。
3. 操作完成后，历史记录如下。

```
A <- B <- C <- D (main)
      \
       E <- F <- D' (feat)
```

### 应用多个提交

1. 提交历史如下，在 feat 分支执行 `git cherry-pick C..E`。

```
A <- B <- C <- D <- E (main)
      \
       F <- G (feat)
```

2. 将 commit D, E 应用到 feat 分支。
3. 操作完成后，历史记录如下。

```
A <- B <- C <- D <- E (main)
      \
       F <- G <- D' <- E' (feat)
```

## Tag

### 创建简单标签

1. 提交历史如下，执行 `git tag v1` 后，Git 内部会进行后续操作。

```sh
a0f247e (HEAD -> main) commit 3
57ca93f commit 2
e7f88c9 commit 1
```

2. 在 refs/tags 目录下创建一个名为 v1 的文件，内容为当前 commit。

```diff
+ .git/refs/tags/v1
```

```sh
$ cat .git/refs/tags/v1 # value
a0f247e
```

3. 操作完成后，历史记录如下。

```sh
a0f247e (HEAD -> main, tag: v1) commit 3
57ca93f commit 2
e7f88c9 commit 1
```

### 创建内容标签

1. 提交历史如下，执行 `git tag -a v1 -m 'version 1` 后，Git 内部会进行后续操作。

```sh
a0f247e (HEAD -> main) commit 3
57ca93f commit 2
e7f88c9 commit 1
```

2. 在 objects 目录下创建一个 tag 对象，内容为当前 commit 和 tag message。

```diff
+ .git/objects/adf306e
```

```sh
$ git cat-file -t adf306e # type
tag

$ git cat-file -p adf306e # value
object a0f247e
type commit
tag v1
tagger wdyjwdy <email.com>

version 1
```

3. 在 refs/tags 目录下创建一个名为 v1 的文件，内容为 tag 对象的引用。

```diff
+ .git/refs/tags/v1
```

```sh
$ cat .git/refs/tags/v1 # value
adf306e
```

4. 操作完成后，历史记录如下。

```sh
a0f247e (HEAD -> main, tag: v1) commit 3
57ca93f commit 2
e7f88c9 commit 1
```

## Clone

### 克隆远程仓库

![](tools-git-clone)

1. 提交历史如下，执行 `git clone <url>` 后，Git 内部会进行后续操作。

```sh
# remote log
98890cc (HEAD -> main) commit 3
5650cb4 commit 2
8c7a5ee commit 1
```

2. 下载 .git 文件，并重建工作区。

```diff
+ hello.txt # Working Tree
+ .git # Repository
```

3. 操作完成后，历史记录如下。

```sh
# local log
98890cc (HEAD -> main, origin/main, origin/HEAD) commit 3
5650cb4 commit 2
8c7a5ee commit 1
```

### clone 与 init 的区别

`git clone` 与 `git init` 有以下区别。

1. config 文件增加了远程分支的信息。

```diff
+ [remote "origin"]
+    url = https://github.com/wdyjwdy/learn-git.git
+    fetch = +refs/heads/*:refs/remotes/origin/*
+ [branch "main"]
+    remote = origin
+    merge = refs/heads/main
```

2. objects 目录下的对象会被打包。

```diff
+ packed-refs
  objects
  └── pack
+     ├── pack-ebd0add.idx
+     └── pack-ebd0add.pack
```

3. refs 目录下增加了远程分支的引用。

```diff
+ refs/remotes/origin/HEAD
```

## Fetch

### 同步远程仓库

![](tools-git-fetch)

1. 提交历史如下，执行 `git fetch` 后，Git 内部会进行后续操作。

```sh
# remote
98890cc (HEAD -> main) commit 3
5650cb4 commit 2
8c7a5ee commit 1

# local
5650cb4 (HEAD -> main) commit 2
8c7a5ee commit 1
```

2. 在 objects 目录下生成远程新提交的相关对象（即 commit 3）。

```diff
objects
+ ├── 38ea824 # blob
+ ├── 1318e47 # tree
+ └── 98890cc # commit
```

3. 更新 origin/main 分支指针，指向远程最新提交（即 commit 3）。

```diff
- .git/refs/remotes/origin/main
+ .git/refs/remotes/origin/main
```

```sh
$ cat .git/refs/remotes/origin/main # value
98890cc
```

4. 更新 FETCH_HEAD，记录了本次 fetch 时，远程仓库的 commit, branch, url。

```diff
- FETCH_HEAD
+ FETCH_HEAD
```

```sh
$ cat .git/FETCH_HEAD # value
98890cc branch 'main' of <url>
```

5. 操作完成后，历史记录如下。

```sh
# local
98890cc (origin/main, origin/HEAD) commit 3
5650cb4 (HEAD -> main) commit 2
8c7a5ee commit 1
```

### FETCH_HEAD

Fetch 操作时会更新 FETCH_HEAD，指向了所 Fetch 的远程分支，
在指向 Pull 操作时，用来确定所 Merge 的目标。

## Pull

### 拉取远程仓库

1. 提交历史如下，执行 `git pull` 后，Git 内部会进行后续操作。

```sh
# remote
98890cc (HEAD -> main) commit 3
5650cb4 commit 2
8c7a5ee commit 1

# local
5650cb4 (HEAD -> main, origin/main, origin/HEAD) commit 2
8c7a5ee commit 1
```

2. 执行 `git fetch`（见 [fetch](#fetch) 部分）
3. 执行 `git merge origin/main`（见 [merge](#merge) 部分）
4. 操作完成后，历史记录如下。

```sh
# local
98890cc (HEAD -> main, origin/main, origin/HEAD) commit 3
5650cb4 commit 2
8c7a5ee commit 1
```

## Push

- `git push origin feat`: 将 feat 分支上的修改推送到远程 origin feat 分支
- `git push -u origin feat`: 将 feat 分支上的修改推送到远程 origin feat 分支，并将 feat 和 origin feat 进行关联
- `git push`: 将当前分支的修改推送到远程同名分支（需要分支已关联）
- `git push -d origin feat`: 删除远程 origin feat 分支

### 推送本地修改

1. 提交历史如下，执行 `git push` 后，Git 内部会进行后续操作。

```sh
# loacl log
5637202 (HEAD -> feat) commit 3
5650cb4 (origin/feat) commit 2
8c7a5ee commit 1
```

2. 将修改文件的对象推送到远程的 objects 文件。
3. 更新远程 refs/heads/feat 分支指针，指向最新 commit。
4. 操作完成后，历史记录如下。

```sh
# loacl log
5637202 (HEAD -> hello, origin/hello) commit 3
5650cb4 commit 2
8c7a5ee commit 1
```

> 使用 `git push` 上传的文件的内容有大小限制，默认为 1MB，如果超过了 1MB 则需要使用 `git config http.postBuffer` 配置缓冲区大小。

### 删除远程分支

1. 在本地执行 `git push -d origin feat` 后，Git 内部会进行后续操作。
2. 删除远程 .git/refs/heads/feat 文件
3. 删除本地 .git/refs/remotes/origin/feat 文件

## Revert

- `git revert A`: 抵消 commit A
- `git revert A B`: 抵消 commit A B
- `git revert A..C`: 抵消 commit B C

### 抵消单个提交

1. 提交历史如下，执行 `git revert B` 后，Git 内部会进行后续操作。

```
A <- B <- C
```

2. 创建一个 commit B'，其内容与 commit B 相反。
3. 操作完成后，历史记录如下。

```
A <- B <- C <- B'
```

### 抵消多个提交

1. 提交历史如下，执行 `git revert B..D` 后，Git 内部会进行后续操作。

```
A <- B <- C <- D
```

2. 创建 commit D', C'，其内容分别与 commit D, C 相反。
3. 操作完成后，历史记录如下。

```
A <- B <- C <- D <- D' <- C'
```

> `git revert` 会先抵消最新的提交 D，再抵消提交 C

## Reset

- `git reset --soft A`: 重置 HEAD 指针到 A。
- `git reset --mixed A`: 重置 HEAD 指针到 A，并更新 Index。
- `git reset --hard A`: 重置 HEAD 指针到 A，并更新 Index 和 Working Tree。

### 重置指针

![](tools-git-reset-soft)

1. 提交历史如下，执行 `git reset --soft 04022cf` 后，Git 内部会进行后续操作。

```sh
947a868 (HEAD -> main) commit 3
04022cf commit 2
8de34b2 commit 1
```

2. 更新 main 指针，指向 commit 2。

```diff
- .git/refs/heads/main
+ .git/refs/heads/main
```

```sh
$ cat .git/refs/heads/main # value
04022cf
```

3. 操作完成后，历史记录如下。

```sh
04022cf (HEAD -> feat) commit 2
8de34b2 commit 1
```

> 由于 `reset --soft` 仅仅移动了指针，因此还原 Reset 之前的状态很容易，只需要把指针移动回去：`git reset --soft 947a868`。

### 重置指针，暂存区

![](tools-git-reset-mixed)

1. 提交历史如下，执行 `git reset --mixed 04022cf` 后，Git 内部会进行后续操作。

```sh
947a868 (HEAD -> main) commit 3
04022cf commit 2
8de34b2 commit 1
```

2. 更新 main 指针，指向 commit 2。

```diff
- .git/refs/heads/main
+ .git/refs/heads/main
```

```sh
$ cat .git/refs/heads/main # value
04022cf
```

3. 更新 Index，内容为 commit 2 的文件列表（把 tree 展平得到的列表）。

```diff
- .git/index
+ .git/index
```

4. 操作完成后，历史记录如下。

```sh
04022cf (HEAD -> feat) commit 2
8de34b2 commit 1
```

> 由于 `reset --mixed` 仅仅移动了指针，并修改了 Index，因此还原 Reset 之前的状态很容易，只需要把指针移动回去，并把 Index 改回去：`git reset --mixed 947a868`。

### 重置指针，暂存区，工作区

![](tools-git-reset-hard)

1. 提交历史如下，执行 `git reset --hard 04022cf` 后，Git 内部会进行后续操作。

```sh
947a868 (HEAD -> main) commit 3
04022cf commit 2
8de34b2 commit 1
```

2. 更新 main 指针，指向 commit 2。

```diff
- .git/refs/heads/main
+ .git/refs/heads/main
```

```sh
$ cat .git/refs/heads/main # value
04022cf
```

2. 更新 Index，内容为 commit 2 的文件列表（把 tree 展平得到的列表）。

```diff
- .git/index
+ .git/index
```

4. 更新 Working Tree，内容与 Index 相同。
5. 操作完成后，历史记录如下。

```sh
04022cf (HEAD -> feat) commit 2
8de34b2 commit 1
```

> 由于 `reset --hard` 不仅修改了指针和 Index，还修改了 Working Tree，因此还原 Reset 之前的状态比较困难，使用 `git reset --hard 947a868` 仅会还原指针和 Index。如果 Working Tree 的修改已经暂存，那么暂存的文件可以去垃圾对象里翻找，如果 Working Tree 的修改没有暂存，那么 Git 将会丢失这部分内容，但 IDE 的缓存文件里有可能可以找到。

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

## Log

- `git log`: 打印提交记录
- `git log --oneline`: 单行显示
- `git log --graph`: 图形显示
- `git log hello.txt`: 打印指定文件的提交记录

## Reflog

- `git reflog`: 打印操作记录
