# Obsidian Format Markdown Plugin

一个强大的 Obsidian 插件，通过 AI 自动格式化 Markdown 文档，特别优化数学公式的 LaTeX 显示。

## ✨ 主要功能

- 🔢 **智能公式识别**：自动将数学公式转换为 LaTeX 格式（使用 `$` 符号包裹）
- 📝 **完美格式化**：优化 Markdown 格式，让文档更规范美观
- 🔒 **内容保护**：保留 YAML frontmatter，只处理正文内容
- 🤖 **多模型支持**：支持 Claude 3.7、Gemini 2.5 等最新 AI 模型
- ⚡ **一键处理**：通过命令面板快速格式化当前文档

## 📦 安装方法

### 方法一：手动安装（推荐）

1. **下载插件文件**
   - 从 [Releases](https://github.com/yourusername/obsidian-format-markdown/releases) 页面下载最新版本的 `main.js` 和 `manifest.json`
   - 或者克隆本仓库并自行构建

2. **安装到 Obsidian**
   - 找到你的 Obsidian 插件目录：
     - Windows: `%APPDATA%\Obsidian\你的仓库名\.obsidian\plugins\`
     - macOS: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/你的仓库名/.obsidian/plugins/`
     - Linux: `~/.obsidian/你的仓库名/.obsidian/plugins/`
   - 创建新文件夹 `format-markdown`
   - 将 `main.js` 和 `manifest.json` 复制到该文件夹

3. **启用插件**
   - 重启 Obsidian
   - 进入 `设置` → `社区插件`
   - 找到 "Format Markdown" 并启用

### 方法二：从源码构建

```bash
# 克隆仓库
git clone https://github.com/yourusername/obsidian-format-markdown.git
cd obsidian-format-markdown

# 安装依赖
npm install

# 构建插件
npm run build

# 将 main.js 和 manifest.json 复制到你的插件目录
```

## 🚀 快速开始

### 1. 配置 API Key

1. 访问 [OpenRouter.ai](https://openrouter.ai) 注册账号
2. 在账户设置中获取 API Key
3. 打开 Obsidian 设置 → Format Markdown
4. 粘贴你的 API Key

### 2. 使用插件

1. 打开需要格式化的 Markdown 文档
2. 按 `Ctrl/Cmd + P` 打开命令面板
3. 搜索并执行 "格式化当前文档"
4. 等待处理完成

## ⚙️ 配置选项

| 设置项 | 说明 | 默认值 |
|--------|------|--------|
| **OpenRouter API Key** | 你的 API 密钥 | 无 |
| **API URL** | API 端点地址 | `https://openrouter.ai/api/v1/chat/completions` |
| **模型选择** | AI 模型 | Claude 3.7 Sonnet |

### 支持的模型

- **Claude 3.7 Sonnet** - 最新的 Claude 模型，理解能力强
- **Gemini 2.5 Flash** - Google 快速模型，响应迅速
- **Gemini 2.5 Pro** - Google 高级模型，效果更好
- **Claude Sonnet 4** - Claude 最新版本
- **自定义模型** - 支持手动输入任何 OpenRouter 支持的模型

## 📝 使用示例

### 处理前
```markdown
这是爱因斯坦的质能方程：E=mc2

二次方程 ax^2+bx+c=0 的解是 x=(-b±√(b^2-4ac))/2a
```

### 处理后
```markdown
这是爱因斯坦的质能方程：$E=mc^2$

二次方程 $ax^2+bx+c=0$ 的解是 $x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$
```

## 🔧 开发

```bash
# 开发模式（自动监听文件变化）
npm run dev

# 构建生产版本
npm run build

# 更新版本号
npm version patch
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 💡 常见问题

**Q: 为什么需要 OpenRouter API Key？**
A: 插件通过 OpenRouter 调用各种 AI 模型，需要 API Key 进行身份验证。

**Q: 会改变我的文档内容吗？**
A: 不会。插件只优化格式，不会改变任何实际内容。

**Q: 支持哪些数学公式格式？**
A: 支持所有 LaTeX 数学公式语法，包括行内公式和块级公式。

**Q: 处理大文档会超时吗？**
A: 插件设置了充足的 token 限制（400000），可以处理绝大部分文档。

## 📞 支持

如有问题，请在 [GitHub Issues](https://github.com/yourusername/obsidian-format-markdown/issues) 提交反馈。