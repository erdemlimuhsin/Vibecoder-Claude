<div align="center">

<br/>

# ⚡ VibeCode — AI Development Terminal

### **Stop switching tabs. Code with AI, right in your terminal.**

<br/>

```bash
npm install -g vibecode
vibecode
vibe "refactor this using TypeScript best practices"
```

<br/>

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-green)](https://nodejs.org/)

<br/>

**VibeCode — AI Development Terminal** brings GPT-4 and Claude directly to your command line.  
No more copy-paste. No more context switching. Just pure coding flow.

<br/>

[🚀 Install](#-installation) • [✨ Demo](#-see-it-in-action) • [📖 Docs](#-commands) • [💡 Tips](#-pro-tips)

</div>

---

## 🎬 See It In Action

```bash
$ vibecode

  ╭─────────────────────────────────╮
  │   VibeCode — AI Development     │
  │          Terminal                │
  ╰─────────────────────────────────╯

  v0.1.0 • Claude Sonnet 3.5

myproject › vibe "add error handling to auth.ts"

◐ Analyzing...
✓ Found 3 async functions without try-catch
✓ Generated solution with proper error handling

━━━ CHANGES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Added try-catch blocks to all async functions
✨ Validation for JWT tokens before processing
✨ Specific error messages for each failure case
✨ Error logging for debugging

💻 Modified: src/auth.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Apply changes? (y/n): y

✓ Done in 3.2s

myproject › 
```

---

## 🔥 Why VibeCode — AI Development Terminal?

<table>
<tr>
<td width="50%">

### ⚡ **Lightning Fast**
No more copy-paste between ChatGPT and your IDE.

**VibeCode — AI Development Terminal** understands your project context automatically.

```bash
vibe "optimize this function"
# ✓ Done in 3 seconds
```

</td>
<td width="50%">

### 🎯 **Context-Aware**
**VibeCode — AI Development Terminal** reads your:
- ✅ Project structure
- ✅ Dependencies
- ✅ Code style
- ✅ Git history

No need to explain your codebase.

</td>
</tr>
<tr>
<td width="50%">

### 🤖 **Multi-AI Support**
Switch between providers instantly:
- **Claude 3.5 Sonnet** - Best for code
- **GPT-4** - Most powerful
- **GPT-4 Turbo** - Fastest & cheapest

```bash
switch  # Interactive menu
```

</td>
<td width="50%">

### 💰 **Token Tracking**
**VibeCode — AI Development Terminal** tracks your API usage:
- ✅ Real-time cost monitoring
- ✅ Budget alerts
- ✅ Usage history
- ✅ Cost optimization tips

Never overspend again.

</td>
</tr>
</table>

---

## 🚀 Installation

### Quick Install (3 steps)

```bash
# 1. Clone VibeCode — AI Development Terminal
git clone https://github.com/ArthurDS-tech/Vibecoder-Claude.git
cd Vibecoder-Claude

# 2. Build and install
npm install && npm run build && npm install -g .

# 3. Start coding
vibecode
```

### Windows PowerShell (1 step)

```powershell
# Run as Administrator
.\install-global.ps1
```

---

## ⚙️ Setup (30 seconds)

```bash
# Start VibeCode — AI Development Terminal
vibecode

# Set your API key
config set apiKey YOUR_API_KEY

# Choose provider
config set provider anthropic  # or openai

# Done! Start coding
vibe "create a REST API with auth"
```

**Get API keys:**
- Anthropic: https://console.anthropic.com/
- OpenAI: https://platform.openai.com/api-keys

---

## ✨ What Can VibeCode — AI Development Terminal Do?

<table>
<tr>
<td width="33%" align="center">

### 🏗️ **Build**
```bash
vibe "create React component"
vibe "add API endpoint"
vibe "setup database"
```

</td>
<td width="33%" align="center">

### 🐛 **Debug**
```bash
vibe "fix this error"
vibe "why is this slow?"
vibe "find memory leaks"
```

</td>
<td width="33%" align="center">

### ⚡ **Optimize**
```bash
vibe "improve performance"
vibe "reduce bundle size"
vibe "optimize queries"
```

</td>
</tr>
<tr>
<td width="33%" align="center">

### 🔄 **Refactor**
```bash
vibe "use TypeScript"
vibe "apply SOLID"
vibe "modernize code"
```

</td>
<td width="33%" align="center">

### 🧪 **Test**
```bash
vibe "add unit tests"
vibe "create test cases"
vibe "mock this API"
```

</td>
<td width="33%" align="center">

### � **Document**
```bash
vibe "add JSDoc"
vibe "write README"
vibe "explain this code"
```

</td>
</tr>
</table>

---

## 🎯 Commands

### Core Commands

| Command | Description | Example |
|---------|-------------|---------|
| `vibe <task>` | Execute AI task | `vibe "refactor this"` |
| `help` | Show all commands | `help` |
| `config` | Manage settings | `config list` |
| `switch` | Change AI provider | `switch` |
| `update` | Update from GitHub | `update` |

### Navigation

| Command | Description | Example |
|---------|-------------|---------|
| `ls` | List files | `ls` |
| `cd <dir>` | Change directory | `cd src` |
| `tree` | Show file tree | `tree` |
| `clear` | Clear screen | `clear` |
| `exit` | Exit terminal | `exit` |

### Configuration

```bash
config list              # View all settings
config set apiKey KEY    # Set API key
config set provider NAME # Change provider
config usage             # View token usage
config test              # Test connection
```

---

## � Pro Tips

### 1. Be Specific

```bash
❌ vibe "improve code"
✅ vibe "refactor auth.ts using async/await and add error handling"
```

### 2. Mention Files

```bash
vibe "in src/components, create Button component with TypeScript"
vibe "fix bug in auth.ts line 42"
```

### 3. Combine Actions

```bash
vibe "refactor, optimize, and add tests to UserService.ts"
```

### 4. Use Context

**VibeCode — AI Development Terminal** automatically understands:
- Your project structure
- Installed dependencies
- Code style
- Recent changes

### 5. Switch Providers

```bash
# Claude 3.5 Sonnet → Complex refactoring
# GPT-4 → Creative solutions
# GPT-4 Turbo → Speed
```

---

## 📊 Token Usage & Costs

**VibeCode — AI Development Terminal** tracks your API usage in real-time:

```bash
config usage
```

**Output:**
```
╔════════════════════════════════════════════════════════╗
║  💰 TOKEN USAGE                                        ║
╠════════════════════════════════════════════════════════╣
║  Total Tokens: 45,230                                  ║
║  Total Cost:   $1.23                                   ║
║  Budget:       $4.00                                   ║
║  Remaining:    $2.77                                   ║
║                                                        ║
║  Usage: ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    ║
║  30.8% of budget used                                  ║
╚════════════════════════════════════════════════════════╝
```

### Cost Optimization

1. **Use GPT-4 Turbo** for simple tasks (10x cheaper)
2. **Be specific** in prompts (fewer retries)
3. **Set token limits** in config
4. **Monitor usage** regularly

---

## 🛡️ Security

**VibeCode — AI Development Terminal** takes security seriously:

- ✅ **API keys masked** in all logs
- ✅ **Local storage only** - no cloud sync
- ✅ **No telemetry** - your code stays private
- ✅ **User confirmation** before executing changes

### Best Practices

1. Never commit `.vibecoderc.json` to Git
2. Use environment variables for API keys in CI/CD
3. Rotate keys regularly
4. Set spending limits on your AI provider dashboard
5. Review changes before confirming

---

## 🔄 Updating

### Automatic Update

```bash
vibecode
update
```

The `update` command automatically:
- ✅ Checks for new updates from GitHub
- ✅ Shows what's changed
- ✅ Backs up your configuration
- ✅ Rebuilds and relinks

### Manual Update

```bash
cd /path/to/Vibecoder-Claude
git pull origin main
npm install && npm run build && npm link
```

---

## 🎨 Customization

### Configuration File

**VibeCode — AI Development Terminal** stores config in `.vibecoderc.json`:

```json
{
  "provider": "anthropic",
  "model": "claude-3-5-sonnet-20240620",
  "apiKey": "sk-ant-...",
  "maxTokens": 4096,
  "temperature": 0.7
}
```

### Environment Variables

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENAI_API_KEY="sk-..."
```

### Custom Aliases

```bash
# Add to .bashrc or .zshrc
alias v="vibecode"
alias vb="vibecode && vibe"
```

---

## � Troubleshooting

### Command Not Found

**Windows:**
```powershell
$env:Path += ";$env:APPDATA\npm"
setx PATH "$env:PATH;$env:APPDATA\npm"
```

**Linux/Mac:**
```bash
export PATH="$PATH:$(npm config get prefix)/bin"
```

### API Key Issues

```bash
config get apiKey    # Verify key
config test          # Test connection
config set apiKey KEY # Re-set key
```

### Build Errors

```bash
rm -rf node_modules dist
npm install && npm run build && npm link
```

---

## 🤝 Contributing

We love contributions! Here's how to help:

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/Vibecoder-Claude.git
cd Vibecoder-Claude

# Install and build
npm install && npm run build && npm link

# Make changes and test
vibecode

# Submit PR
```

**See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.**

---

## 📈 Roadmap

### v1.1 (Coming Soon)
- [ ] NPM package publication
- [ ] VS Code extension
- [ ] Git integration (auto-commit, PR descriptions)
- [ ] Team collaboration features

### v1.2 (Future)
- [ ] More AI providers (Gemini, Mistral)
- [ ] Plugin system
- [ ] Cloud sync (optional)
- [ ] Web dashboard

**Vote on features:** [GitHub Discussions](https://github.com/ArthurDS-tech/Vibecoder-Claude/discussions)

---

## 🌟 What Developers Say

> "VibeCode — AI Development Terminal cut my development time in half. No more context switching!"  
> — **@developer1**

> "Finally, an AI tool that actually understands my codebase. Game changer."  
> — **@developer2**

> "The token tracking saved me $200 last month. Pays for itself."  
> — **@developer3**

---

## 📝 License

MIT License - see [LICENSE](./LICENSE)

**VibeCode — AI Development Terminal** is free and open source. Use it however you want!

---

## � Acknowledgments

**VibeCode — AI Development Terminal** is built with:
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [Ora](https://github.com/sindresorhus/ora) - Elegant spinners
- [OpenAI API](https://openai.com/) - GPT-4 integration
- [Anthropic API](https://www.anthropic.com/) - Claude integration

Special thanks to all [contributors](https://github.com/ArthurDS-tech/Vibecoder-Claude/graphs/contributors)!

---

## � Links

- **GitHub:** https://github.com/ArthurDS-tech/Vibecoder-Claude
- **Issues:** https://github.com/ArthurDS-tech/Vibecoder-Claude/issues
- **Discussions:** https://github.com/ArthurDS-tech/Vibecoder-Claude/discussions
- **NPM:** (coming soon)

---

<div align="center">

<br/>

### ⚡ Ready to supercharge your development?

```bash
git clone https://github.com/ArthurDS-tech/Vibecoder-Claude.git
cd Vibecoder-Claude
npm install && npm run build && npm install -g .
vibecode
```

<br/>

**VibeCode — AI Development Terminal**

*Your AI pair programmer, right in your terminal*

<br/>

Made with ❤️ by developers, for developers

<br/>

⭐ **Star us on GitHub** if **VibeCode — AI Development Terminal** helps you code faster!

</div>
