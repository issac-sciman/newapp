# 项目：云端禅堂（Cloud Zen Hall）

## 必读（每次开对话自动读入）
@docs/开发计划.md
@docs/经验.md

## 是什么
- 一句话：网页应用，用户和 AI「大佛」聊天解惑，另有敲木鱼攒功德、冥想禅房、藏经阁读经。（来源：`cloud-zen-hall/metadata.json` 和代码）
- 当前阶段：原型（从 Google AI Studio 导出，待用户确认）

## 命令（照抄就能跑）
代码在 `cloud-zen-hall/` 子目录，以下命令在该目录下执行。
- 安装依赖：`npm install`
- 本地启动：`npm run dev`　　地址：http://localhost:3000
- 测试门禁：（暂无测试）
- 构建：`npm run build`
- 部署：（未知）　　（要用户当轮同意）
- 回滚：（未知）
- 一键恢复测试环境：（暂无）

## 环境
| 环境 | 地址 | 数据库 | 能不能动 |
|---|---|---|---|
| 本地 | http://localhost:3000 | 无（数据存浏览器 localStorage） | 随便动 |
| 生产 | 未知 | 未知 | 只读，写操作先问 |

- 需要 `cloud-zen-hall/.env.local` 里设 `GEMINI_API_KEY`（不进仓库）。

## 本项目红线（全局五条之外）
- （待用户补充）

## 测试数据
- 功德数、自定义头像存在浏览器 localStorage，清浏览器数据即可重置。

## 问题清单
- 位置：`docs/问题清单.md`

## 已知的坑
- （暂无）
