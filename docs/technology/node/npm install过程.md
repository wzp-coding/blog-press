---
title: npm install
---

# 了解一下 npm install 的执行流程?

[[toc]]

## npm install

整体流程：

- 检查 `.npmrc` 文件：优先级为：项目级的 `.npmrc` 文件 > 用户级的 `.npmrc` 文件> 全局级的 `.npmrc` 文件 > npm 内置的 `.npmrc` 文件

- 检查项目中有无 `lock` 文件。

- 无 lock 文件：

  - 从 `npm` 远程仓库获取包信息

  - 根据 package.json

    构建依赖树，构建过程：

    - 构建依赖树时，不管其是直接依赖还是子依赖的依赖，优先将其放置在 `node_modules` 根目录。
    - 当遇到相同模块时，判断已放置在依赖树的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在当前模块的 `node_modules` 下放置该模块。
    - 注意这一步只是确定逻辑上的依赖树，并非真正的安装，后面会根据这个依赖结构去下载或拿到缓存中的依赖包

  - 在缓存中依次查找依赖树中的每个包

    - 不存在缓存：
      - 从 `npm` 远程仓库下载包
      - 校验包的完整性
      - 校验不通过：
        - 重新下载
      - 校验通过：
        - 将下载的包复制到 `npm` 缓存目录
        - 将下载的包按照依赖结构解压到 `node_modules`

    存在缓存：将缓存按照依赖结构解压到 `node_modules`

  - 将包解压到 `node_modules`

  - 生成 `lock` 文件

- 有 `lock` 文件：

  - 检查 `package.json` 中的依赖版本是否和 `package-lock.json` 中的依赖有冲突。

  - 如果没有冲突，直接跳过获取包信息、构建依赖树过程，开始在缓存中查找包信息，后续过程相同

## 参考

> [npm install 原理分析](https://cloud.tencent.com/developer/article/1555982)
