import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface FormatMarkdownSettings {
	openRouterApiKey: string;
	apiUrl: string;
	model: string;
}

const DEFAULT_SETTINGS: FormatMarkdownSettings = {
	openRouterApiKey: '',
	apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
	model: 'anthropic/claude-3.7-sonnet'
}

export default class FormatMarkdownPlugin extends Plugin {
	settings: FormatMarkdownSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'format-current-document',
			name: '格式化当前文档',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				await this.formatCurrentDocument(editor, view);
			}
		});

		this.addSettingTab(new FormatMarkdownSettingTab(this.app, this));
	}

	async formatCurrentDocument(editor: Editor, view: MarkdownView) {
		if (!this.settings.openRouterApiKey) {
			new Notice('请先在设置中配置 OpenRouter API Key');
			return;
		}

		const content = editor.getValue();
		
		// 分离 YAML frontmatter 和正文内容
		let frontmatter = '';
		let bodyContent = content;
		
		const yamlRegex = /^---\n([\s\S]*?)\n---\n/;
		const yamlMatch = content.match(yamlRegex);
		
		if (yamlMatch) {
			frontmatter = yamlMatch[0];
			bodyContent = content.substring(frontmatter.length);
		}

		if (!bodyContent.trim()) {
			new Notice('文档内容为空');
			return;
		}

		new Notice('正在格式化文档...');

		try {
			const formattedContent = await this.callOpenRouter(bodyContent);
			
			// 重新组合 frontmatter 和格式化后的内容
			const finalContent = frontmatter + formattedContent;
			
			// 替换编辑器内容
			editor.setValue(finalContent);
			
			new Notice('文档格式化完成！');
		} catch (error) {
			console.error('格式化失败:', error);
			new Notice(`格式化失败: ${error.message}`);
		}
	}

	async callOpenRouter(content: string): Promise<string> {
		const prompt = `不改变任何一个字符的文章内容，只是把格式处理成完美的 markdown 格式，把这段话里的公式用$处理成 obsidian 中可以展示的 latex，不改变其他内容。

以下是需要处理的内容：

${content}`;

		const response = await fetch(this.settings.apiUrl, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${this.settings.openRouterApiKey}`,
				'Content-Type': 'application/json',
				'HTTP-Referer': 'https://obsidian.md',
				'X-Title': 'Obsidian Format Markdown Plugin'
			},
			body: JSON.stringify({
				model: this.settings.model,
				messages: [
					{
						role: 'system',
						content: '你是一个专业的 Markdown 格式化助手。你的任务是将文本格式化为完美的 Markdown 格式，特别注意将数学公式用 $ 符号包裹成 LaTeX 格式，使其能在 Obsidian 中正确显示。一定不要改变文章的任何实际内容。'
					},
					{
						role: 'user',
						content: prompt
					}
				],
				temperature: 0.1,
				max_tokens: 400000
			})
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`API 请求失败: ${response.status} - ${error}`);
		}

		const data = await response.json();
		
		if (!data.choices || !data.choices[0] || !data.choices[0].message) {
			throw new Error('API 响应格式错误');
		}

		return data.choices[0].message.content;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class FormatMarkdownSettingTab extends PluginSettingTab {
	plugin: FormatMarkdownPlugin;

	constructor(app: App, plugin: FormatMarkdownPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Format Markdown 插件设置'});

		new Setting(containerEl)
			.setName('OpenRouter API Key')
			.setDesc('输入你的 OpenRouter API Key')
			.addText(text => text
				.setPlaceholder('sk-or-v1-...')
				.setValue(this.plugin.settings.openRouterApiKey)
				.onChange(async (value) => {
					this.plugin.settings.openRouterApiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('API URL')
			.setDesc('OpenRouter API 端点 (默认: https://openrouter.ai/api/v1/chat/completions)')
			.addText(text => text
				.setPlaceholder('https://openrouter.ai/api/v1/chat/completions')
				.setValue(this.plugin.settings.apiUrl)
				.onChange(async (value) => {
					this.plugin.settings.apiUrl = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('模型')
			.setDesc('选择要使用的模型')
			.addDropdown(dropdown => {
				dropdown
					.addOption('anthropic/claude-3.7-sonnet', 'Claude 3.7 Sonnet')
					.addOption('google/gemini-2.5-flash', 'Gemini 2.5 Flash')
					.addOption('anthropic/claude-sonnet-4', 'Claude Sonnet 4')
					.addOption('google/gemini-2.5-pro', 'Gemini 2.5 Pro')
					// 自定义占位，避免在使用自定义模型时 setValue 报错
					.addOption('custom', '自定义（使用下方输入）');

				const presetKeys = [
					'anthropic/claude-3.7-sonnet',
					'google/gemini-2.5-flash',
					'anthropic/claude-sonnet-4',
					'google/gemini-2.5-pro'
				];
				const current = this.plugin.settings.model;
				if (presetKeys.includes(current)) {
					dropdown.setValue(current);
				} else {
					dropdown.setValue('custom');
				}

				dropdown.onChange(async (value) => {
					if (value !== 'custom') {
						this.plugin.settings.model = value;
						await this.plugin.saveSettings();
					}
				});
			});

		// 自定义模型输入框
		new Setting(containerEl)
			.setName('自定义模型')
			.setDesc('可手动输入模型名称（填写后将覆盖上方选择）')
			.addText(text => text
				.setPlaceholder('例如：anthropic/claude-3.7-sonnet')
				.setValue(this.plugin.settings.model)
				.onChange(async (value) => {
					this.plugin.settings.model = value.trim();
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('h3', {text: '使用说明'});
		containerEl.createEl('p', {text: '1. 在 OpenRouter.ai 注册并获取 API Key'});
		containerEl.createEl('p', {text: '2. 在上方输入你的 API Key'});
		containerEl.createEl('p', {text: '3. 打开需要格式化的文档'});
		containerEl.createEl('p', {text: '4. 使用命令面板 (Ctrl/Cmd + P) 搜索"格式化当前文档"'});
		containerEl.createEl('p', {text: '5. 插件会保留 YAML frontmatter，只格式化正文内容'});
	}
}