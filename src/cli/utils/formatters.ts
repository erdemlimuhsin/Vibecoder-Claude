import chalk from 'chalk';

/**
 * Formatting utilities for terminal output
 * Enhanced version with better features and organization
 */

export class OutputFormatter {
  // ============================================
  // STATUS MESSAGES
  // ============================================

  /**
   * Format success message
   */
  static success(message: string): string {
    return chalk.green(`✓ ${message}`);
  }

  /**
   * Format error message
   */
  static error(message: string): string {
    return chalk.red(`✗ ${message}`);
  }

  /**
   * Format warning message
   */
  static warning(message: string): string {
    return chalk.yellow(`⚠ ${message}`);
  }

  /**
   * Format info message
   */
  static info(message: string): string {
    return chalk.cyan(`ℹ ${message}`);
  }

  /**
   * Format debug message
   */
  static debug(message: string): string {
    return chalk.gray(`⚙ ${message}`);
  }

  /**
   * Format loading/processing message
   */
  static processing(message: string): string {
    return chalk.magenta(`⟳ ${message}`);
  }

  /**
   * Format completion message
   */
  static complete(message: string): string {
    return chalk.greenBright(`✔ ${message}`);
  }

  // ============================================
  // CODE & SYNTAX
  // ============================================

  /**
   * Format code block with syntax highlighting hints
   */
  static code(code: string, language?: string): string {
    const lang = language ? chalk.gray(language) : '';
    return chalk.gray('```') + lang + '\n' + 
           chalk.white(code) + '\n' + 
           chalk.gray('```');
  }

  /**
   * Format inline code
   */
  static inlineCode(code: string): string {
    return chalk.bgGray.white(` ${code} `);
  }

  /**
   * Extract code from markdown code blocks
   */
  static extractCode(text: string): string {
    const codeMatch = text.match(/```[\w]*\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : text;
  }

  /**
   * Format JSON with colors
   */
  static json(obj: any, indent: number = 2): string {
    const json = JSON.stringify(obj, null, indent);
    return json
      .replace(/"([^"]+)":/g, chalk.cyan('"$1"') + ':')
      .replace(/: "([^"]+)"/g, ': ' + chalk.green('"$1"'))
      .replace(/: (\d+)/g, ': ' + chalk.yellow('$1'))
      .replace(/: (true|false)/g, ': ' + chalk.magenta('$1'))
      .replace(/: null/g, ': ' + chalk.gray('null'));
  }

  // ============================================
  // PATHS & FILES
  // ============================================

  /**
   * Format file path
   */
  static filePath(path: string): string {
    return chalk.blue(path);
  }

  /**
   * Format directory path
   */
  static dirPath(path: string): string {
    return chalk.blue(`${path}/`);
  }

  /**
   * Format path with color coding by type
   */
  static smartPath(path: string, isDirectory: boolean = false): string {
    if (isDirectory) {
      return chalk.blue.bold(`📁 ${path}/`);
    }
    
    // Color by extension
    const ext = path.split('.').pop()?.toLowerCase();
    const colorMap: Record<string, typeof chalk.yellow> = {
      'ts': chalk.blue,
      'js': chalk.yellow,
      'json': chalk.cyan,
      'md': chalk.white,
      'txt': chalk.gray,
      'env': chalk.magenta,
      'yml': chalk.green,
      'yaml': chalk.green,
    };
    
    const color = colorMap[ext || ''] || chalk.white;
    return color(`📄 ${path}`);
  }

  /**
   * Format command
   */
  static command(cmd: string): string {
    return chalk.cyan.bold(`$ ${cmd}`);
  }

  // ============================================
  // HEADERS & SECTIONS
  // ============================================

  /**
   * Format section header with box
   */
  static header(title: string, width: number = 60): string {
    const topLine = '╔' + '═'.repeat(width - 2) + '╗';
    const bottomLine = '╚' + '═'.repeat(width - 2) + '╝';
    const padding = Math.max(0, width - title.length - 4);
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    const titleLine = '║' + ' '.repeat(leftPad) + title.toUpperCase() + ' '.repeat(rightPad) + '║';
    
    return chalk.cyan(`\n${topLine}\n${titleLine}\n${bottomLine}\n`);
  }

  /**
   * Format simple header
   */
  static simpleHeader(title: string): string {
    return chalk.bold.cyan(`\n━━━ ${title.toUpperCase()} ━━━\n`);
  }

  /**
   * Format subsection
   */
  static subsection(title: string): string {
    return chalk.bold.white(`\n▸ ${title}`);
  }

  /**
   * Format divider
   */
  static divider(char: string = '─', length: number = 60): string {
    return chalk.gray(char.repeat(length));
  }

  // ============================================
  // DATA FORMATTING
  // ============================================

  /**
   * Mask sensitive data (API keys, tokens)
   */
  static maskSensitive(value: string, visibleChars: number = 4): string {
    if (!value || value.length <= visibleChars) {
      return chalk.gray('***');
    }
    const visible = value.slice(-visibleChars);
    const masked = '•'.repeat(Math.min(12, value.length - visibleChars));
    return chalk.gray(masked) + chalk.white(visible);
  }

  /**
   * Format file size with better units
   */
  static fileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    const formatted = size < 10 ? size.toFixed(2) : 
                     size < 100 ? size.toFixed(1) : 
                     Math.round(size).toString();

    return chalk.cyan(formatted) + chalk.gray(` ${units[unitIndex]}`);
  }

  /**
   * Format timestamp with relative time
   */
  static timestamp(date: Date = new Date(), showRelative: boolean = false): string {
    const formatted = date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    if (showRelative) {
      const relative = this.relativeTime(date);
      return chalk.gray(`${formatted} (${relative})`);
    }

    return chalk.gray(formatted);
  }

  /**
   * Format relative time (e.g., "2 minutes ago")
   */
  static relativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'agora mesmo';
    if (diffMin < 60) return `${diffMin} minuto${diffMin > 1 ? 's' : ''} atrás`;
    if (diffHour < 24) return `${diffHour} hora${diffHour > 1 ? 's' : ''} atrás`;
    if (diffDay < 7) return `${diffDay} dia${diffDay > 1 ? 's' : ''} atrás`;
    
    return date.toLocaleDateString('pt-BR');
  }

  /**
   * Format duration in human readable format
   */
  static duration(ms: number): string {
    if (ms < 1000) return chalk.gray(`${ms}ms`);
    if (ms < 60000) return chalk.gray(`${(ms / 1000).toFixed(1)}s`);
    if (ms < 3600000) {
      const min = Math.floor(ms / 60000);
      const sec = Math.floor((ms % 60000) / 1000);
      return chalk.gray(`${min}m ${sec}s`);
    }
    
    const hours = Math.floor(ms / 3600000);
    const min = Math.floor((ms % 3600000) / 60000);
    return chalk.gray(`${hours}h ${min}m`);
  }

  // ============================================
  // LISTS & TABLES
  // ============================================

  /**
   * Format list item with better bullets
   */
  static listItem(text: string, level: number = 0, bullet: string = '•'): string {
    const indent = '  '.repeat(level);
    const bullets = ['•', '◦', '▪', '▫'];
    const selectedBullet = bullets[Math.min(level, bullets.length - 1)];
    return chalk.gray(`${indent}${selectedBullet} `) + text;
  }

  /**
   * Format numbered list item
   */
  static numberedItem(text: string, number: number, level: number = 0): string {
    const indent = '  '.repeat(level);
    return chalk.gray(`${indent}${number}. `) + text;
  }

  /**
   * Format key-value pair with alignment
   */
  static keyValue(key: string, value: string, indent: number = 2, keyWidth: number = 20): string {
    const spaces = ' '.repeat(indent);
    const paddedKey = key.padEnd(keyWidth);
    return `${spaces}${chalk.gray(paddedKey)} ${chalk.white(value)}`;
  }

  /**
   * Format simple table
   */
  static table(headers: string[], rows: string[][]): string {
    const colWidths = headers.map((h, i) => {
      const maxContentWidth = Math.max(...rows.map(r => r[i]?.length || 0));
      return Math.max(h.length, maxContentWidth) + 2;
    });

    const headerRow = headers.map((h, i) => 
      chalk.bold.cyan(h.padEnd(colWidths[i]))
    ).join(' │ ');

    const separator = colWidths.map(w => '─'.repeat(w)).join('─┼─');

    const dataRows = rows.map(row => 
      row.map((cell, i) => chalk.white(cell.padEnd(colWidths[i]))).join(' │ ')
    );

    return '\n' + headerRow + '\n' + 
           chalk.gray(separator) + '\n' + 
           dataRows.join('\n') + '\n';
  }

  // ============================================
  // PROGRESS & LOADING
  // ============================================

  /**
   * Format progress bar with better visuals
   */
  static progress(current: number, total: number, width: number = 30): string {
    const percentage = Math.min(100, Math.round((current / total) * 100));
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    // Gradient progress bar
    const bar = chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
    const percent = chalk.bold.white(`${percentage}%`);
    
    return `[${bar}] ${percent} ${chalk.gray(`(${current}/${total})`)}`;
  }

  /**
   * Format step indicator
   */
  static step(current: number, total: number, description: string): string {
    const stepNum = chalk.cyan(`[${current}/${total}]`);
    return `${stepNum} ${description}`;
  }

  /**
   * Format spinner states
   */
  static spinner(frame: number): string {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    return chalk.cyan(frames[frame % frames.length]);
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Truncate long text with smart ellipsis
   */
  static truncate(text: string, maxLength: number = 100, position: 'end' | 'middle' = 'end'): string {
    if (text.length <= maxLength) {
      return text;
    }

    if (position === 'middle') {
      const half = Math.floor((maxLength - 3) / 2);
      return text.slice(0, half) + '...' + text.slice(-half);
    }

    return text.slice(0, maxLength - 3) + '...';
  }

  /**
   * Wrap text to specified width
   */
  static wrap(text: string, width: number = 80, indent: number = 0): string {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length > width) {
        if (currentLine) lines.push(currentLine.trim());
        currentLine = ' '.repeat(indent) + word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }

    if (currentLine) lines.push(currentLine.trim());
    return lines.join('\n');
  }

  /**
   * Center text
   */
  static center(text: string, width: number = 80): string {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  }

  /**
   * Format badge/tag
   */
  static badge(text: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): string {
    const colors = {
      success: chalk.bgGreen.black,
      error: chalk.bgRed.white,
      warning: chalk.bgYellow.black,
      info: chalk.bgCyan.black
    };

    return colors[type](` ${text.toUpperCase()} `);
  }

  /**
   * Format emoji with fallback
   */
  static emoji(name: string): string {
    const emojiMap: Record<string, string> = {
      rocket: '🚀',
      check: '✓',
      cross: '✗',
      warning: '⚠',
      info: 'ℹ',
      fire: '🔥',
      star: '⭐',
      folder: '📁',
      file: '📄',
      gear: '⚙',
      lock: '🔒',
      key: '🔑',
      brain: '🧠',
      lightning: '⚡'
    };

    return emojiMap[name] || '•';
  }

  /**
   * Format diff-style output
   */
  static diff(added: string[], removed: string[]): string {
    const output: string[] = [];
    
    if (removed.length > 0) {
      output.push(chalk.bold.red('\n━━━ Removed ━━━'));
      removed.forEach(line => output.push(chalk.red(`- ${line}`)));
    }

    if (added.length > 0) {
      output.push(chalk.bold.green('\n━━━ Added ━━━'));
      added.forEach(line => output.push(chalk.green(`+ ${line}`)));
    }

    return output.join('\n');
  }

  /**
   * Create a box around text
   */
  static box(text: string, padding: number = 1): string {
    const lines = text.split('\n');
    const maxLength = Math.max(...lines.map(l => l.length));
    const width = maxLength + (padding * 2);

    const top = '╔' + '═'.repeat(width) + '╗';
    const bottom = '╚' + '═'.repeat(width) + '╝';
    const empty = '║' + ' '.repeat(width) + '║';

    const content = lines.map(line => {
      const padded = line.padEnd(maxLength);
      const leftPad = ' '.repeat(padding);
      const rightPad = ' '.repeat(padding);
      return '║' + leftPad + padded + rightPad + '║';
    });

    const boxLines = [top];
    if (padding > 0) boxLines.push(empty);
    boxLines.push(...content);
    if (padding > 0) boxLines.push(empty);
    boxLines.push(bottom);

    return chalk.cyan(boxLines.join('\n'));
  }
}