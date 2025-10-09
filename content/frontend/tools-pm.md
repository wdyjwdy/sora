---
title: Package Manager
category: Tools
toc: true
---

## Basic

### version

格式：`Major.Minor.Patch`

- Major (大版本): breaking change
- Minor (小版本): new feature
- Patch (补丁号): bug fix

特殊字符：

- `*`, `x`：任意版本
- `~`：补丁号可变
- `^`：小版本，补丁号可变

```json
"dependencies": {
  "solid": "1.2.3",

  "solid": "*", // [0.0.0, any]
  "solid": "1.2.x", // [1.2.0, 1.3.0)
  "solid": "1.x", // [1.0.0, 2.0.0)

  "solid": "~1.2.3", // [1.2.3, 1.3.0)
  "solid": "^1.2.3", // [1.2.3, 2.0.0)

  // 也可以这样
  "solid": ">=1.2.3", // [1.2.3, any)
  "solid": "1.2.3 - 2.3.4", // [1.2.3, 2.3.4]
  "solid": "1.2.3 || 2.3.4" // 1.2.3 or 2.3.4
}
```

### package.json

详情参考 [package-json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)。

```json
{
  "name": "note", // 包名（发包时必选）
  "version": "1.0.0", // 版本号（发包时必选）
  "engines": {
    // 环境说明
    "node": "1.0.0",
    "npm": "1.0.0"
  },
  "dependencies": {
    // 生产环境依赖
    "antd": "1.0.0",
    "sass": "1.0.0"
  },
  "devDependencies": {
    // 开发环境依赖
    "typescript": "1.0.0",
    "babel": "1.0.0"
  },
  "scripts": {
    // 脚本
    "start": "node index.js"
  }
}
```

### package-lock.json

package-lock.json 文件会在 npm 修改 package.json 或 node_modules 时自动生成。

package-lock.json 解决的问题：

- 当执行 `npm install` 后，会安装 1.0.1 版本，导致差异。

  ```json
  {
    "dependencies": {
      "lucide": "~1.0.0" // 最新版本为 "1.0.1"
    }
  }
  ```

package-lock.json 文件的用途：

- 描述确定的依赖树，以保证团队成员、部署、CICD 都安装相同的依赖。
- 优化依赖安装过程，跳过已经解析的包
- 跳过 package.json 的解析，加快 CICD 等安装过程。

### node_modules

## NPM

### init

- `npm init`：在当前目录下创建一个 package.json 文件。

### install

- `npm install`: Install all dependencies.
- `npm install pkg1`: Save to dependencies.
- `npm install pkg1 -D`: Save to devDependencies.
- `npm install pkg1@1.1.1`: Specify version.
- `npm uninstall pkg`: Removes packages.
- `npm update pkg`: Updates packages to latest version.

安装算法如下：

- 安装 `A{B,C}, B{C}, C{D}`，会产生以下结果，D 可以安装在顶层，并不会产生冲突。

  ```
  A
  ├── B
  ├── C
  └── D
  ```

- 安装 `A{B,C}, B{C,D@1}, C{D@2}`，会产生以下结果，D@2 不能安装在顶层，因为会产生和 D@1 冲突。

  ```
  A
  ├── B
  ├── C
  │   └── D@2
  └── D@1
  ```

### npx

- `npx`：运行包中的可执行文件。

工作原理，当执行 `npx <command>` 时会：

1. 检查本地是否有可执行文件，没有就从远程下载。
2. 执行文件。
3. 删除可执行文件。

## PNPM

### init

- `pnpm init`: Create a package.json file.

### add

- `pnpm install`: Install all dependencies.
- `pnpm add pkg1`: Save to dependencies.
- `pnpm add -D pkg1`: Save to devDependencies.
- `pnpm add pkg1@1.1.1`: Specify version.
- `pnpm remove pkg`: Removes packages.
- `pnpm update pkg`: Updates packages to latest version.

### create

- `pnpm create rsbuild@latest`: Create a project.

## NPM vs PNPM

### 文件路径

对于依赖：`A{B,C}, B{C}`，npm 会把依赖 B, C 都提升到顶层目录。因此很难看出依赖关系。

```
node_modules
├── A
├── B
└── C
```

而 pnpm 会保留这种依赖关系。其中 node_modules 下的依赖会被 soft link 到 .pnpm。同时 .pnpm 下 A, B, C 中的其他文件会被 hard link 到 .pnpm-store。

```
node_modules
├── .pnpm
│   ├── A
│   │   ├── B (soft link)
│   │   └── C (soft link)
│   ├── B
│   │   └── C (soft link)
│   └── C
├── A (soft link)
└── B (soft link)
```

```
.pnpm-store
├── A
├── B
└── C
```

> **幽灵依赖**：npm 具有扁平化结构，子依赖会被提升到根目录，从而导致项目可以直接导入子依赖。而 pnpm 具有层级关系，避免了这个问题。

### 磁盘空间

![store](/static/imgs/tools-pm-pnpm-store.svg)

假设 project-1 安装依赖 `dev-2`, `dev-3`，project-2 安装依赖 `dev-3`, `dev-4`。npm 会在磁盘安装两次 `dev-3`。

```
node_modules (project 1)
├── dev 2
└── dev 3
```

```
node_modules (project 2)
├── dev 3
└── dev 4
```

而 pnpm 使用全局存储，不会重复安装依赖。其中 `dev-1`, `dev-2`, `dev-3` 的内容会 hard link 到 .pnpm-store。

```
node_modules (project 1)
├── .pnpm
│ ├── dev 2 (hard link)
│ └── dev 3 (hard link)
├── dev 2
└── dev 3
```

```
node_modules (project 2)
├── .pnpm
│ ├── dev 3 (hard link)
│ └── dev 4 (hard link)
├── dev 3
└── dev 4
```

```
.pnpm-store
├── dev 2
├── dev 3
└── dev 4
```

> `npm install -g` 并非全局安装依赖，而是提供全局命令行工具（CLI）。

### 安装速度

- 安装依赖时，npm 会重新下载并创建文件，而 pnpm 只需创建 hard link。
- pnpm 可以并行处理多个依赖。
- 安装依赖时，npm 会进行扁平化，会有额外的计算量。例如安装 `A{C@1}, B{C@2}`。

  ```
  .node_modules
  ├── A
  ├── C@1
  └── B
      └── C@2
  ```

### 总结

- PNPM 保留了依赖的层级关系，NPM 丢失了依赖层级关系，并会导致幽灵依赖。
- PNPM 实现了跨项目依赖共享，NPM 会重复储存依赖。
- PNPM 安装速度更快。
