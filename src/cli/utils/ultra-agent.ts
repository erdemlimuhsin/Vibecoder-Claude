import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { AIClient } from '../core/ai-client';
import { ConfigManager } from '../core/config';
import { AnimatedProgress } from './progress';
import { OutputFormatter } from './formatters';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface ProjectContext {
  root: string;
  files: string[];
  structure: Record<string, unknown>;
  technologies: string[];
  metadata: {
    fileCount: number;
    codeFileCount: number;
    totalSize: number;
  };
}

interface CommandIntent {
  targetFolder: string | null;
  targetFile: string | null;
  actions: ActionFlags;
  fullCommand: string;
  confidence: number;
}

interface ActionFlags {
  develop: boolean;
  debug: boolean;
  optimize: boolean;
  refactor: boolean;
  test: boolean;
  document: boolean;
  analyze: boolean;
}

interface CodeBlock {
  code: string;
  language: string;
  path?: string;
  metadata: {
    lineCount: number;
    charCount: number;
    hasImports: boolean;
    hasFunctions: boolean;
  };
}

interface ValidationResult {
  isValid: boolean;
  isComplete: boolean;
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

interface ExecutionResult {
  success: boolean;
  filesCreated: string[];
  filesModified: string[];
  errors: string[];
}

// ============================================
// CONSTANTS
// ============================================

const RELEVANT_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.py', '.java', '.go', '.rs', '.c', '.cpp', '.cs'];
const IGNORE_DIRECTORIES = ['node_modules', '.git', 'dist', 'build', 'out', '.next', 'coverage', '.vscode', 'target', 'vendor'];
const MAX_SCAN_FILES = 50;
const MAX_SCAN_DEPTH = 4;
const MIN_CODE_LENGTH = 200;
const MAX_CONTEXT_SIZE = 3000;

// ============================================
// ULTRA AGENT - ENTERPRISE GRADE
// ============================================

/**
 * UltraAgent - Advanced AI-Powered Code Assistant
 * 
 * Intelligent code analysis, generation, and modification system
 * with enterprise-grade validation and error handling.
 * 
 * @class UltraAgent
 * @version 2.0.0
 */
export class UltraAgent {
  private readonly aiClient: AIClient;
  private readonly configManager: ConfigManager;
  private readonly currentDir: string;
  private projectContext: ProjectContext;

  constructor(
    aiClient: AIClient,
    configManager: ConfigManager,
    currentDir: string
  ) {
    this.aiClient = aiClient;
    this.configManager = configManager;
    this.currentDir = currentDir;
    
    this.projectContext = this.initializeContext();
  }

  // ============================================
  // PUBLIC API
  // ============================================

  /**
   * Execute intelligent command with full context awareness
   * 
   * @param command - Natural language command from user
   * @returns Promise<void>
   */
  async execute(command: string): Promise<void> {
    // Show header
    console.log('');
    console.log(chalk.bold.cyan('━'.repeat(70)));
    console.log(chalk.bold.white('  VIBECODE ULTRA AGENT'));
    console.log(chalk.bold.cyan('━'.repeat(70)));
    console.log('');

    const stages = [
      'Parsing command intent',
      'Analyzing project structure',
      'Generating AI solution',
      'Validating output quality'
    ];

    const progress = new AnimatedProgress(stages, {
      spinnerStyle: 'dots',
      color: 'cyan'
    });

    try {
      // Stage 1: Intent analysis
      progress.next();
      await this.sleep(300); // Small delay for visual effect
      const intent = await this.analyzeIntent(command);
      
      // Stage 2: Project scan
      progress.next();
      await this.sleep(400);
      await this.scanProject();
      
      // Stage 3: AI execution
      progress.next();
      const response = await this.executeWithAI(intent, command);
      
      // Stage 4: Validation & output
      progress.next();
      await this.sleep(200);
      await this.processResponse(response, intent);
      
      progress.complete();
      
    } catch (error) {
      progress.error((error as Error).message);
      this.handleError(error as Error);
    }
  }

  /**
   * Sleep utility for visual delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================
  // INTENT ANALYSIS
  // ============================================

  /**
   * Analyze user command and extract intent
   * Uses pattern matching and NLP-like analysis
   */
  private async analyzeIntent(command: string): Promise<CommandIntent> {
    const normalized = command.toLowerCase();

    // Extract target folder
    const folderPatterns = [
      /(?:pasta|folder|dir|directory|diretório|diretorio)\s+([^\s]+)/i,
      /(?:em|in)\s+([a-zA-Z0-9_\-/\\]+)\//i
    ];
    
    let targetFolder: string | null = null;
    for (const pattern of folderPatterns) {
      const match = command.match(pattern);
      if (match) {
        targetFolder = match[1];
        break;
      }
    }

    // Extract target file
    const filePatterns = [
      /(?:arquivo|file)\s+([^\s]+\.[a-z]+)/i,
      /([a-zA-Z0-9_\-]+\.[a-z]{2,4})/i
    ];
    
    let targetFile: string | null = null;
    for (const pattern of filePatterns) {
      const match = command.match(pattern);
      if (match) {
        targetFile = match[1];
        break;
      }
    }

    // Detect actions with weighted scoring
    const actionPatterns: Record<keyof ActionFlags, RegExp[]> = {
      develop: [/desenvolv|cri|implement|cod|faz|fazer|build|create/i],
      debug: [/debug|corrig|fix|consert|erro|bug|resolve/i],
      optimize: [/otimiz|melhor|performance|rapido|rápido|speed|faster/i],
      refactor: [/refator|limpar|organiz|estrutur|clean|reorganize/i],
      test: [/test|testa|unit|integration|e2e/i],
      document: [/document|doc|coment|readme|explain/i],
      analyze: [/analis|revis|verific|check|review|audit/i]
    };

    const actions: ActionFlags = {
      develop: false,
      debug: false,
      optimize: false,
      refactor: false,
      test: false,
      document: false,
      analyze: false
    };

    let matchCount = 0;
    for (const [action, patterns] of Object.entries(actionPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(normalized)) {
          actions[action as keyof ActionFlags] = true;
          matchCount++;
          break;
        }
      }
    }

    // Calculate confidence based on matches
    const confidence = Math.min(1.0, matchCount / 3);

    return {
      targetFolder,
      targetFile,
      actions,
      fullCommand: command,
      confidence
    };
  }

  // ============================================
  // PROJECT ANALYSIS
  // ============================================

  /**
   * Initialize empty project context
   */
  private initializeContext(): ProjectContext {
    return {
      root: this.currentDir,
      files: [],
      structure: {},
      technologies: [],
      metadata: {
        fileCount: 0,
        codeFileCount: 0,
        totalSize: 0
      }
    };
  }

  /**
   * Perform intelligent project scan
   * Detects technologies, maps structure, identifies relevant files
   */
  private async scanProject(): Promise<void> {
    this.projectContext = this.initializeContext();

    // Detect technologies from package.json
    await this.detectTechnologies();
    
    // Scan file structure
    this.scanDirectory(this.currentDir, 0);
    
    // Update metadata
    this.projectContext.metadata.fileCount = this.projectContext.files.length;
  }

  /**
   * Detect project technologies from package.json
   */
  private async detectTechnologies(): Promise<void> {
    const packagePath = path.join(this.currentDir, 'package.json');
    
    if (!fs.existsSync(packagePath)) {
      return;
    }

    try {
      const packageContent = fs.readFileSync(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);
      const allDeps = { 
        ...packageJson.dependencies, 
        ...packageJson.devDependencies 
      };

      const techMap: Record<string, string> = {
        'react': 'React',
        'react-dom': 'React',
        'next': 'Next.js',
        'vue': 'Vue.js',
        'nuxt': 'Nuxt.js',
        'express': 'Express',
        'fastify': 'Fastify',
        'nest': 'NestJS',
        'typescript': 'TypeScript',
        '@types/node': 'Node.js',
        'vite': 'Vite',
        'webpack': 'Webpack',
        'tailwindcss': 'Tailwind CSS',
        'prisma': 'Prisma',
        'mongoose': 'MongoDB'
      };

      const detected = new Set<string>();
      
      for (const [dep, tech] of Object.entries(techMap)) {
        if (allDeps[dep]) {
          detected.add(tech);
        }
      }

      this.projectContext.technologies = Array.from(detected);
      
    } catch (error) {
      // Silent fail - not critical
    }
  }

  /**
   * Recursive directory scanner with smart filtering
   */
  private scanDirectory(dir: string, depth: number): void {
    if (depth > MAX_SCAN_DEPTH || this.projectContext.files.length >= MAX_SCAN_FILES) {
      return;
    }

    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        if (this.shouldIgnoreItem(item)) continue;
        
        const fullPath = path.join(dir, item);
        const relativePath = path.relative(this.currentDir, fullPath);
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            this.scanDirectory(fullPath, depth + 1);
          } else if (this.isRelevantFile(item)) {
            this.projectContext.files.push(relativePath);
            this.projectContext.metadata.codeFileCount++;
            this.projectContext.metadata.totalSize += stat.size;
          }
        } catch {
          // Skip permission errors
        }
      }
    } catch {
      // Skip read errors
    }
  }

  /**
   * Check if file is relevant for context
   */
  private isRelevantFile(filename: string): boolean {
    return RELEVANT_EXTENSIONS.some(ext => filename.endsWith(ext));
  }

  /**
   * Check if item should be ignored during scan
   */
  private shouldIgnoreItem(name: string): boolean {
    return IGNORE_DIRECTORIES.includes(name) || name.startsWith('.');
  }

  // ============================================
  // AI EXECUTION
  // ============================================

  /**
   * Execute command with AI using optimized prompting
   */
  private async executeWithAI(intent: CommandIntent, originalCommand: string): Promise<string> {
    // Read target file if specified
    let targetContent = '';
    if (intent.targetFile) {
      targetContent = this.readTargetFile(intent.targetFile);
    }
    
    // Build optimized prompt
    const prompt = this.buildPrompt(intent, originalCommand, targetContent);
    
    // Execute AI request
    const response = await this.aiClient.ask(prompt);
    
    // Track token usage
    const tokens = this.estimateTokens(prompt + response);
    await this.configManager.trackTokenUsage(tokens, 'ultra-agent');
    
    return response;
  }

  /**
   * Read target file with error handling
   */
  private readTargetFile(filename: string): string {
    try {
      const targetPath = path.join(this.currentDir, filename);
      if (fs.existsSync(targetPath)) {
        const content = fs.readFileSync(targetPath, 'utf-8');
        return content.substring(0, MAX_CONTEXT_SIZE);
      }
    } catch {
      // File read failed
    }
    return '';
  }

  /**
   * Build optimized AI prompt
   */
  private buildPrompt(intent: CommandIntent, command: string, targetContent: string): string {
    const contextInfo = this.buildContextSection(intent);
    const actionDescription = this.buildActionDescription(intent.actions);
    
    return `You are an expert software engineer. Execute this task with precision and completeness.

COMMAND:
${command}

PROJECT CONTEXT:
${contextInfo}

${targetContent ? `CURRENT FILE CONTENT:
\`\`\`
${targetContent}
\`\`\`
` : ''}

TASK REQUIREMENTS:
${actionDescription}

CRITICAL INSTRUCTIONS:
1. Analyze existing code structure and patterns
2. Identify all issues and improvement opportunities
3. Implement complete, production-ready solutions
4. Return FULL file content, not snippets
5. Include ALL necessary imports and dependencies
6. Follow language-specific best practices
7. Ensure code is immediately usable

MANDATORY RESPONSE FORMAT:

## Analysis
[Detailed analysis of the problem/task]

## Changes Made
[Comprehensive list of all modifications]

## Code
File: [exact/path/to/file.ext]
\`\`\`[language]
[COMPLETE FILE CODE HERE]
\`\`\`

## Next Steps
[Recommended follow-up actions]

QUALITY REQUIREMENTS:
- Complete, working code (no placeholders)
- Proper error handling
- Type safety (if applicable)
- Clean, maintainable structure
- Production-ready quality`;
  }

  /**
   * Build context section for prompt
   */
  private buildContextSection(intent: CommandIntent): string {
    const parts: string[] = [];
    
    parts.push(`Root: ${path.basename(this.currentDir)}`);
    
    if (this.projectContext.technologies.length > 0) {
      parts.push(`Technologies: ${this.projectContext.technologies.join(', ')}`);
    }
    
    parts.push(`Files: ${this.projectContext.files.length} code files`);
    
    if (intent.targetFolder) {
      parts.push(`Target Folder: ${intent.targetFolder}`);
    }
    
    if (intent.targetFile) {
      parts.push(`Target File: ${intent.targetFile}`);
    }
    
    if (this.projectContext.files.length > 0) {
      parts.push(`\nRelevant Files:`);
      this.projectContext.files.slice(0, 15).forEach(f => {
        parts.push(`  - ${f}`);
      });
    }
    
    return parts.join('\n');
  }

  /**
   * Build action description for prompt
   */
  private buildActionDescription(actions: ActionFlags): string {
    const tasks: string[] = [];
    
    if (actions.develop) tasks.push('Develop/implement new functionality');
    if (actions.debug) tasks.push('Debug and fix errors');
    if (actions.optimize) tasks.push('Optimize performance');
    if (actions.refactor) tasks.push('Refactor and clean code');
    if (actions.test) tasks.push('Create comprehensive tests');
    if (actions.document) tasks.push('Add documentation');
    if (actions.analyze) tasks.push('Analyze and review code');
    
    return tasks.length > 0 ? tasks.join('\n- ') : 'General code improvement';
  }

  /**
   * Estimate token count
   */
  private estimateTokens(text: string): number {
    // Rough estimation: 4 chars per token
    return Math.ceil(text.length / 4);
  }

  // ============================================
  // RESPONSE PROCESSING
  // ============================================

  /**
   * Process AI response and execute actions
   */
  private async processResponse(response: string, intent: CommandIntent): Promise<void> {
    // Display formatted response
    this.displayResponse(response);
    
    // Ask for confirmation
    const confirmed = await this.requestConfirmation();
    
    if (!confirmed) {
      console.log(chalk.gray('\nExecution cancelled by user\n'));
      return;
    }
    
    // Extract and validate code blocks
    const codeBlocks = this.extractCodeBlocks(response);
    
    if (codeBlocks.length === 0) {
      console.log(chalk.yellow('\nNo executable code found in response\n'));
      return;
    }
    
    // Execute file operations
    const result = await this.executeFileOperations(codeBlocks, intent);
    
    // Display execution summary
    this.displayExecutionSummary(result);
  }

  /**
   * Display formatted AI response
   */
  private displayResponse(response: string): void {
    console.log('');
    console.log(OutputFormatter.header('AI RESPONSE', 100));
    console.log('');
    
    const sections = this.parseResponseSections(response);
    
    for (const section of sections) {
      this.displaySection(section.title, section.content);
    }
    
    console.log(OutputFormatter.divider('─', 100));
    console.log('');
  }

  /**
   * Parse response into sections
   */
  private parseResponseSections(response: string): Array<{ title: string; content: string }> {
    const sections: Array<{ title: string; content: string }> = [];
    const parts = response.split('##').filter(s => s.trim());
    
    for (const part of parts) {
      const lines = part.trim().split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      sections.push({ title, content });
    }
    
    return sections;
  }

  /**
   * Display individual section with formatting
   */
  private displaySection(title: string, content: string): void {
    const lowerTitle = title.toLowerCase();
    
    // Section header with icon
    let icon = '';
    let color = chalk.cyan;
    
    if (lowerTitle.includes('analysis') || lowerTitle.includes('análise')) {
      icon = 'ANALYSIS';
      color = chalk.yellow;
    } else if (lowerTitle.includes('changes') || lowerTitle.includes('mudanças')) {
      icon = 'CHANGES';
      color = chalk.green;
    } else if (lowerTitle.includes('code') || lowerTitle.includes('código')) {
      icon = 'CODE';
      color = chalk.cyan;
    } else if (lowerTitle.includes('next') || lowerTitle.includes('próximos')) {
      icon = 'NEXT STEPS';
      color = chalk.magenta;
    }
    
    console.log(color.bold(`[${icon || title.toUpperCase()}]`));
    console.log('');
    
    // Content formatting
    if (content.includes('```')) {
      // Code block
      const codeMatch = content.match(/```[\w]*\n([\s\S]*?)```/);
      if (codeMatch) {
        const lines = codeMatch[1].split('\n');
        lines.forEach((line, i) => {
          console.log(chalk.gray(`${String(i + 1).padStart(4)} │ `) + chalk.white(line));
        });
      }
    } else {
      // Regular content
      content.split('\n').forEach(line => {
        if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
          console.log(chalk.cyan('  ' + line.trim()));
        } else if (line.trim()) {
          console.log(chalk.gray('  ' + line));
        }
      });
    }
    
    console.log('');
  }

  /**
   * Request user confirmation for execution
   */
  private async requestConfirmation(): Promise<boolean> {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise<boolean>((resolve) => {
      rl.question(
        chalk.yellow('Execute file operations? (y/n): '),
        (answer: string) => {
          rl.close();
          resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 's');
        }
      );
    });
  }

  // ============================================
  // CODE EXTRACTION & VALIDATION
  // ============================================

  /**
   * Extract all code blocks from response
   */
  private extractCodeBlocks(response: string): CodeBlock[] {
    const blocks: CodeBlock[] = [];
    const pattern = /```(\w+)\n([\s\S]*?)```/g;
    let match;
    
    while ((match = pattern.exec(response)) !== null) {
      const language = match[1];
      const code = match[2].trim();
      
      // Skip small blocks (likely examples)
      if (code.length < MIN_CODE_LENGTH) continue;
      
      // Skip command examples
      if (this.isCommandExample(code)) continue;
      
      // Extract path from context
      const path = this.extractPathBeforeBlock(response, match.index);
      
      // Validate and add
      if (this.isValidCodeBlock(code, language, path)) {
        blocks.push({
          code,
          language,
          path,
          metadata: this.analyzeCodeBlock(code)
        });
      }
    }
    
    return blocks;
  }

  /**
   * Check if code is a command example
   */
  private isCommandExample(code: string): boolean {
    const lower = code.toLowerCase();
    const commandPrefixes = ['npm ', 'yarn ', 'git ', 'cd ', 'mkdir ', 'touch ', 'rm '];
    const exampleMarkers = ['# example', '// example', '# exemplo', '// exemplo'];
    
    return commandPrefixes.some(prefix => lower.startsWith(prefix)) ||
           exampleMarkers.some(marker => lower.includes(marker));
  }

  /**
   * Extract file path from text before code block
   */
  private extractPathBeforeBlock(response: string, blockIndex: number): string | undefined {
    const beforeBlock = response.substring(Math.max(0, blockIndex - 300), blockIndex);
    const patterns = [
      /(?:File|Arquivo|Path|Caminho):\s*`?([^\n`]+\.[a-zA-Z0-9]+)`?\s*$/im,
      /`([^`]+\.[a-zA-Z]{2,4})`\s*$/,
    ];
    
    for (const pattern of patterns) {
      const match = beforeBlock.match(pattern);
      if (match) {
        return match[1].trim().replace(/`/g, '').replace(/\\/g, '/');
      }
    }
    
    return undefined;
  }

  /**
   * Validate code block before processing
   */
  private isValidCodeBlock(code: string, language: string, path?: string): boolean {
    // Must have valid path with extension
    if (!path || !path.includes('.')) {
      return false;
    }
    
    // Validate extension
    const ext = path.split('.').pop()?.toLowerCase();
    const validExts = ['ts', 'tsx', 'js', 'jsx', 'json', 'md', 'html', 'css', 'scss', 'yaml', 'yml'];
    
    if (!ext || !validExts.includes(ext)) {
      return false;
    }
    
    // Check for suspicious paths
    const firstPart = path.split('/')[0].split('\\')[0].toLowerCase();
    const suspiciousParts = ['heap', 'stack', 'memory', 'buffer', 'cache'];
    
    if (suspiciousParts.includes(firstPart) && !path.includes('/')) {
      return false;
    }
    
    return true;
  }

  /**
   * Analyze code block metadata
   */
  private analyzeCodeBlock(code: string): CodeBlock['metadata'] {
    return {
      lineCount: code.split('\n').length,
      charCount: code.length,
      hasImports: /import |require\(|from ['"]/.test(code),
      hasFunctions: /function |=>|class /.test(code)
    };
  }

  /**
   * Validate code completeness and quality
   */
  private validateCode(code: string, language: string): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      isComplete: true,
      warnings: [],
      errors: [],
      suggestions: []
    };

    if (language === 'typescript' || language === 'javascript' || 
        language === 'tsx' || language === 'jsx') {
      
      // Check bracket balance
      const openBraces = (code.match(/{/g) || []).length;
      const closeBraces = (code.match(/}/g) || []).length;
      
      if (openBraces !== closeBraces) {
        result.errors.push('Unbalanced braces');
        result.isComplete = false;
        result.isValid = false;
      }

      // Check parenthesis balance
      const openParens = (code.match(/\(/g) || []).length;
      const closeParens = (code.match(/\)/g) || []).length;
      
      if (openParens !== closeParens) {
        result.errors.push('Unbalanced parentheses');
        result.isComplete = false;
        result.isValid = false;
      }

      // Check for functions/classes
      const hasDefinitions = /function |=>|class /.test(code);
      if (!hasDefinitions && code.length > 100) {
        result.warnings.push('No function or class definitions found');
      }

      // Check minimum length
      if (code.length < MIN_CODE_LENGTH) {
        result.warnings.push(`Code is very short (< ${MIN_CODE_LENGTH} characters)`);
        result.suggestions.push('Request more complete implementation');
      }

      // Check for incomplete comments
      const lastLines = code.split('\n').slice(-3).join('\n');
      if ((lastLines.includes('/**') && !lastLines.includes('*/')) ||
          (lastLines.includes('/*') && !lastLines.includes('*/'))) {
        result.errors.push('Incomplete comment block at end of file');
        result.isComplete = false;
      }
    }

    return result;
  }

  // ============================================
  // FILE OPERATIONS
  // ============================================

  /**
   * Execute all file operations with validation
   */
  private async executeFileOperations(
    blocks: CodeBlock[],
    intent: CommandIntent
  ): Promise<ExecutionResult> {
    const result: ExecutionResult = {
      success: true,
      filesCreated: [],
      filesModified: [],
      errors: []
    };

    console.log('');
    console.log(OutputFormatter.header('EXECUTION', 100));
    console.log('');

    for (const block of blocks) {
      try {
        // Validate code
        const validation = this.validateCode(block.code, block.language);
        
        if (!validation.isValid) {
          result.errors.push(`Invalid code in ${block.path}: ${validation.errors.join(', ')}`);
          console.log(chalk.red(`  ERROR: ${block.path} - ${validation.errors[0]}`));
          continue;
        }
        
        if (!validation.isComplete) {
          console.log(chalk.yellow(`  WARNING: ${block.path} appears incomplete`));
          validation.warnings.forEach(w => console.log(chalk.yellow(`    - ${w}`)));
        }
        
        // Determine file path
        const filePath = block.path || intent.targetFile;
        
        if (!filePath) {
          result.errors.push('No file path specified');
          continue;
        }
        
        // Execute file operation
        const fullPath = path.join(this.currentDir, filePath);
        const exists = fs.existsSync(fullPath);
        
        // Create directory if needed
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Write file
        fs.writeFileSync(fullPath, block.code, 'utf-8');
        
        // Track result
        if (exists) {
          result.filesModified.push(filePath);
          console.log(chalk.green(`  MODIFIED: ${filePath}`));
        } else {
          result.filesCreated.push(filePath);
          console.log(chalk.cyan(`  CREATED: ${filePath}`));
        }
        
      } catch (error) {
        result.success = false;
        result.errors.push((error as Error).message);
        console.log(chalk.red(`  ERROR: ${(error as Error).message}`));
      }
    }

    console.log('');
    
    return result;
  }

  /**
   * Display execution summary
   */
  private displayExecutionSummary(result: ExecutionResult): void {
    console.log(OutputFormatter.divider('─', 100));
    console.log('');
    console.log(chalk.bold('SUMMARY'));
    console.log('');
    
    if (result.filesCreated.length > 0) {
      console.log(chalk.cyan(`  Files Created: ${result.filesCreated.length}`));
      result.filesCreated.forEach(f => console.log(chalk.gray(`    - ${f}`)));
      console.log('');
    }
    
    if (result.filesModified.length > 0) {
      console.log(chalk.green(`  Files Modified: ${result.filesModified.length}`));
      result.filesModified.forEach(f => console.log(chalk.gray(`    - ${f}`)));
      console.log('');
    }
    
    if (result.errors.length > 0) {
      console.log(chalk.red(`  Errors: ${result.errors.length}`));
      result.errors.forEach(e => console.log(chalk.red(`    - ${e}`)));
      console.log('');
    }
    
    if (result.success && result.errors.length === 0) {
      console.log(chalk.green('  Status: Success'));
    } else {
      console.log(chalk.yellow('  Status: Completed with warnings'));
    }
    
    console.log('');
  }

  // ============================================
  // ERROR HANDLING
  // ============================================

  /**
   * Handle errors gracefully
   */
  private handleError(error: Error): void {
    console.log('');
    console.log(chalk.red('ERROR: ' + error.message));
    console.log('');
    
    if (error.stack) {
      console.log(chalk.gray('Stack trace:'));
      console.log(chalk.gray(error.stack));
    }
    
    console.log('');
  }
}