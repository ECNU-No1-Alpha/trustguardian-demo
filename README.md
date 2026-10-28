# TrustGuardian / 妆真 — Interactive Demo

欧莱雅第二届美妆科技黑客松 · 赛道二「信任守护师」项目的公开交互演示。

Live demo: https://ecnu-no1-alpha.github.io/trustguardian-demo/

![preview](thumbnail.png)

## 这个仓库是什么

这是 TrustGuardian 前端的静态演示版，保留了：

- 首页与种草笔记交互
- 文案核验、宣称依据、综合评分等原型页
- AI 文本检测、图片检测的页面交互与错误状态
- 桌面与窄屏布局

## 重要说明

这是一个 **static prototype/demo**，不是完整的模型服务：

- GitHub Pages 上不运行 Python/FastAPI 后端，也不加载模型权重。
- AI 文本检测、图片检测两个页面在公开演示中会提示“未连接本地模型服务”，不会伪造真实检测分数。
- 真正的文本/图片检测需要本地启动完整项目（模型权重和后端不在本仓库）。

## 本地运行静态页面

```bash
python3 -m http.server 8099
# 打开 http://127.0.0.1:8099/
```

## 技术

React（浏览器内 Babel）、framer-motion、Tailwind CSS；无需构建步骤。

第三方组件说明见 `THIRD_PARTY_NOTICES.md`。

## 边界

原型和演示结果不能作为作者身份认定、图片真伪鉴定、法律意见或投资/购买依据。完整模型效果和限制以本地项目报告为准。
