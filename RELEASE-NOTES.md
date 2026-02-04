# 🚀 VibeCode Release Notes

## v0.1.1 - Bug Fixes & Security (February 4, 2026)

### 🔒 Security Improvements

- **API Key Protection**: API keys are now sanitized in all logs and error messages
  - Added `sanitizeApiKey()` and `sanitizeForLog()` methods
  - Keys always masked as `****xxxx` (showing only last 4 characters)
  - Prevents accidental exposure in error logs

- **User Confirmation**: Code execution now requires explicit user confirmation
  - Ultra Agent prompts before creating/modifying files
  - Clear warning message: "⚠️ Executar ações automaticamente? (s/n)"
  - User can cancel operations safely

### 🐛 Critical Bug Fixes

1. **File Validation** (#4)
   - Commands `debug`, `review`, and `explain` now validate file existence
   - Proper path resolution using `path.resolve()`
   - Clear error messages when files don't exist
   - Prevents runtime errors from missing files

2. **Ctrl+C Handling** (#6)
   - Terminal now responds gracefully to SIGINT and SIGTERM
   - Clean shutdown with goodbye message
   - Proper resource cleanup

3. **Token Limit Validation** (#7)
   - Added `validateTokenLimit()` function
   - Warns at 75% and 90% usage
   - Prevents exceeding token budgets
   - Clear messages about token usage

4. **TypeScript Type Safety** (#2)
   - Removed all `any` types from codebase
   - Added proper interfaces: `ProjectContext`, `IntentResult`, `CodeBlock`
   - Better IDE autocomplete and error detection
   - Improved code maintainability

### 📦 Files Modified

- `src/cli/commands/debug.ts` - File validation
- `src/cli/commands/review.ts` - File validation
- `src/cli/commands/explain.ts` - File validation
- `src/cli/core/config.ts` - API key sanitization
- `src/cli/utils/token-optimizer.ts` - Token limit validation
- `src/cli/utils/ultra-agent.ts` - User confirmation + types
- `src/cli/terminal.ts` - SIGINT/SIGTERM handling + types
- `src/cli/types/index.ts` - Type definitions
- `src/cli/commands/base-command.ts` - Type improvements

### ✅ Build Status

All changes compiled successfully with no TypeScript errors.

---

## v0.1.0 - Initial Release (February 4, 2026)

**Release Date:** February 4, 2026

## What's New

VibeCode is an AI-powered development terminal that brings intelligent assistance directly to your command line.

### ✨ Key Features

- **AI Integration**: Support for OpenAI GPT-4 and Anthropic Claude 3.5
- **Interactive Terminal**: Clean, minimal interface inspired by Claude Code
- **Smart Commands**: Execute AI tasks with simple `vibe` commands
- **Multi-Provider**: Switch between OpenAI and Anthropic seamlessly
- **Secure**: API keys are masked and never exposed

### 🎯 Quick Start

```bash
# Install
git clone https://github.com/ArthurDS-tech/Vibecoder-Claude.git
cd Vibecoder-Claude
npm install && npm run build
npm install -g .

# Use
vibecode
vibe "your task here"
```

### 🔧 What Works

- ✅ Interactive AI terminal
- ✅ Code generation and review
- ✅ File navigation
- ✅ Configuration management
- ✅ Token usage tracking
- ✅ Windows PATH support

### 📝 Known Issues

- Windows users need to configure PATH manually (instructions in README)
- First-time setup requires API key configuration

### 🙏 Thanks

Built with TypeScript and powered by OpenAI and Anthropic APIs.

---

**Full Changelog**: https://github.com/ArthurDS-tech/Vibecoder-Claude/commits/main
