import chalk from 'chalk';

export interface ProgressStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  message?: string;
  startTime?: number;
  endTime?: number;
}

// ============================================
// SPINNER FRAMES
// ============================================

const SPINNER_FRAMES = {
  dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  line: ['—', '\\', '|', '/'],
  arc: ['◜', '◠', '◝', '◞', '◡', '◟'],
  arrow: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],
  box: ['◰', '◳', '◲', '◱'],
  braille: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']
};

type SpinnerStyle = keyof typeof SPINNER_FRAMES;

// ============================================
// PROGRESS TRACKER (Original - Melhorado)
// ============================================

export class ProgressTracker {
  private steps: ProgressStep[] = [];
  private currentStepIndex: number = -1;

  constructor(steps: string[]) {
    this.steps = steps.map(name => ({
      name,
      status: 'pending' as const
    }));
  }

  start(stepIndex: number, message?: string): void {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.steps[stepIndex].status = 'running';
      this.steps[stepIndex].message = message;
      this.steps[stepIndex].startTime = Date.now();
      this.currentStepIndex = stepIndex;
      this.render();
    }
  }

  complete(stepIndex: number, message?: string): void {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.steps[stepIndex].status = 'completed';
      this.steps[stepIndex].message = message;
      this.steps[stepIndex].endTime = Date.now();
      this.render();
    }
  }

  error(stepIndex: number, message: string): void {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.steps[stepIndex].status = 'error';
      this.steps[stepIndex].message = message;
      this.steps[stepIndex].endTime = Date.now();
      this.render();
    }
  }

  private render(): void {
    // Limpar linha anterior
    process.stdout.write('\r\x1b[K');
    
    const output: string[] = [];
    
    this.steps.forEach((step, index) => {
      let icon = '';
      let color = chalk.gray;
      
      switch (step.status) {
        case 'pending':
          icon = '○';
          color = chalk.gray;
          break;
        case 'running':
          icon = '◐';
          color = chalk.cyan;
          break;
        case 'completed':
          icon = '✓';
          color = chalk.green;
          break;
        case 'error':
          icon = '✗';
          color = chalk.red;
          break;
      }
      
      const stepText = step.message || step.name;
      const duration = step.endTime && step.startTime 
        ? chalk.gray(` (${((step.endTime - step.startTime) / 1000).toFixed(2)}s)`)
        : '';
      
      output.push(color(`${icon} ${stepText}`) + duration);
    });
    
    console.log('\n' + output.join('\n'));
  }

  clear(): void {
    console.log('');
  }
}

// ============================================
// SIMPLE PROGRESS (Original - TURBINADO COM ANIMAÇÃO!)
// ============================================

export class SimpleProgress {
  private steps: string[];
  private current: number = 0;
  private isFirstStep: boolean = true;
  private spinnerInterval: NodeJS.Timeout | null = null;
  private frameIndex: number = 0;
  private spinnerStyle: SpinnerStyle = 'dots';
  private startTime: number = 0;

  constructor(steps: string[], options?: { spinnerStyle?: SpinnerStyle }) {
    this.steps = steps;
    if (options?.spinnerStyle) {
      this.spinnerStyle = options.spinnerStyle;
    }
  }

  next(message?: string): void {
    // Parar spinner anterior
    this.stopSpinner();
    
    if (!this.isFirstStep) {
      // Completar step anterior
      process.stdout.write('\r\x1b[K');
      const prevMessage = this.steps[this.current - 1];
      const duration = Date.now() - this.startTime;
      const timeStr = chalk.gray(` (${(duration / 1000).toFixed(2)}s)`);
      process.stdout.write(chalk.green(`✓ ${prevMessage}`) + timeStr + '\n');
    } else {
      this.isFirstStep = false;
    }
    
    if (this.current < this.steps.length) {
      const stepMessage = message || this.steps[this.current];
      this.startTime = Date.now();
      this.current++;
      
      // Iniciar animação do spinner
      this.startSpinner(stepMessage);
    }
  }

  complete(): void {
    this.stopSpinner();
    
    if (this.current > 0) {
      // Completar último step
      process.stdout.write('\r\x1b[K');
      const lastMessage = this.steps[this.current - 1];
      const duration = Date.now() - this.startTime;
      const timeStr = chalk.gray(` (${(duration / 1000).toFixed(2)}s)`);
      process.stdout.write(chalk.green(`✓ ${lastMessage}`) + timeStr + '\n');
    }
    console.log('');
  }

  error(message: string): void {
    this.stopSpinner();
    process.stdout.write('\r\x1b[K');
    process.stdout.write(chalk.red(`✗ ${message}\n\n`));
  }

  // ============================================
  // SPINNER ANIMATION
  // ============================================

  private startSpinner(message: string): void {
    this.frameIndex = 0;
    const frames = SPINNER_FRAMES[this.spinnerStyle];
    
    // Render inicial
    this.renderSpinner(message, frames);
    
    // Iniciar animação
    this.spinnerInterval = setInterval(() => {
      this.frameIndex = (this.frameIndex + 1) % frames.length;
      this.renderSpinner(message, frames);
    }, 80);
  }

  private renderSpinner(message: string, frames: string[]): void {
    process.stdout.write('\r\x1b[K');
    const frame = frames[this.frameIndex];
    process.stdout.write(chalk.cyan(`${frame} ${message}`) + chalk.gray('...'));
  }

  private stopSpinner(): void {
    if (this.spinnerInterval) {
      clearInterval(this.spinnerInterval);
      this.spinnerInterval = null;
    }
  }
}

// ============================================
// ANIMATED PROGRESS (NOVO - MAIS AVANÇADO)
// ============================================

export class AnimatedProgress {
  private stages: Array<{
    text: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startTime?: number;
    endTime?: number;
  }>;
  private currentIndex: number = -1;
  private interval: NodeJS.Timeout | null = null;
  private frameIndex: number = 0;
  private spinnerStyle: SpinnerStyle = 'dots';
  private color: 'cyan' | 'green' | 'yellow' | 'magenta' | 'blue' = 'cyan';

  constructor(
    stages: string[],
    options?: {
      spinnerStyle?: SpinnerStyle;
      color?: 'cyan' | 'green' | 'yellow' | 'magenta' | 'blue';
    }
  ) {
    this.stages = stages.map(text => ({
      text,
      status: 'pending' as const
    }));
    
    if (options?.spinnerStyle) {
      this.spinnerStyle = options.spinnerStyle;
    }
    
    if (options?.color) {
      this.color = options.color;
    }
  }

  next(): void {
    // Completar stage atual
    if (this.currentIndex >= 0) {
      this.completeCurrentStage();
    }

    // Mover para próximo
    this.currentIndex++;

    if (this.currentIndex >= this.stages.length) {
      return;
    }

    // Iniciar novo stage
    this.startStage(this.currentIndex);
  }

  complete(): void {
    if (this.currentIndex >= 0) {
      this.completeCurrentStage();
    }
    
    this.stopSpinner();
    
    console.log('');
    console.log(chalk.green.bold('  ✓ All stages completed successfully'));
    console.log('');
  }

  error(message: string): void {
    if (this.currentIndex >= 0) {
      this.failCurrentStage();
    }
    
    this.stopSpinner();
    
    console.log('');
    console.log(chalk.red.bold('  ✗ ' + message));
    console.log('');
  }

  private startStage(index: number): void {
    const stage = this.stages[index];
    stage.status = 'running';
    stage.startTime = Date.now();

    this.renderStage(index);
    this.startSpinner(index);
  }

  private completeCurrentStage(): void {
    this.stopSpinner();
    
    const stage = this.stages[this.currentIndex];
    stage.status = 'completed';
    stage.endTime = Date.now();

    this.clearCurrentLine();
    
    const duration = stage.endTime && stage.startTime 
      ? chalk.gray(` (${((stage.endTime - stage.startTime) / 1000).toFixed(2)}s)`)
      : '';
    
    console.log(chalk.green('  ✓ ') + chalk.gray(stage.text) + duration);
  }

  private failCurrentStage(): void {
    this.stopSpinner();
    
    const stage = this.stages[this.currentIndex];
    stage.status = 'failed';
    stage.endTime = Date.now();

    this.clearCurrentLine();
    console.log(chalk.red('  ✗ ') + chalk.gray(stage.text));
  }

  private startSpinner(index: number): void {
    this.frameIndex = 0;
    
    this.interval = setInterval(() => {
      this.clearCurrentLine();
      this.renderStage(index);
      this.frameIndex = (this.frameIndex + 1) % SPINNER_FRAMES[this.spinnerStyle].length;
    }, 80);
  }

  private stopSpinner(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private renderStage(index: number): void {
    const stage = this.stages[index];
    const frames = SPINNER_FRAMES[this.spinnerStyle];
    const frame = frames[this.frameIndex];
    
    const colorMap = {
      cyan: chalk.cyan,
      green: chalk.green,
      yellow: chalk.yellow,
      magenta: chalk.magenta,
      blue: chalk.blue
    };
    
    const color = colorMap[this.color];

    process.stdout.write(
      color('  ' + frame + ' ') + 
      chalk.white(stage.text) + 
      chalk.gray('...')
    );
  }

  private clearCurrentLine(): void {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
  }
}

// ============================================
// MULTI-STAGE PROGRESS (NOVO)
// ============================================

export class MultiStageProgress {
  private stages: Array<{
    name: string;
    steps: string[];
    currentStep: number;
    status: 'pending' | 'running' | 'completed' | 'failed';
  }>;
  private currentStageIndex: number = -1;
  private spinner: AnimatedProgress | null = null;

  constructor(stages: Array<{ name: string; steps: string[] }>) {
    this.stages = stages.map(s => ({
      ...s,
      currentStep: -1,
      status: 'pending' as const
    }));
  }

  async nextStage(): Promise<void> {
    // Completar stage anterior
    if (this.currentStageIndex >= 0) {
      this.stages[this.currentStageIndex].status = 'completed';
      if (this.spinner) {
        this.spinner.complete();
      }
    }

    this.currentStageIndex++;

    if (this.currentStageIndex >= this.stages.length) {
      return;
    }

    const stage = this.stages[this.currentStageIndex];
    stage.status = 'running';

    // Mostrar header do stage
    console.log('');
    console.log(chalk.bold.cyan(`[STAGE ${this.currentStageIndex + 1}/${this.stages.length}] ${stage.name}`));
    console.log(chalk.gray('─'.repeat(70)));
    console.log('');

    // Criar spinner para os steps
    this.spinner = new AnimatedProgress(stage.steps, {
      spinnerStyle: 'dots',
      color: 'cyan'
    });
  }

  nextStep(): void {
    if (this.spinner) {
      this.spinner.next();
    }
  }

  completeStage(): void {
    if (this.spinner) {
      this.spinner.complete();
    }
  }

  fail(message: string): void {
    if (this.currentStageIndex >= 0) {
      this.stages[this.currentStageIndex].status = 'failed';
    }
    
    if (this.spinner) {
      this.spinner.error(message);
    }
  }

  complete(): void {
    console.log('');
    console.log(chalk.green.bold('━'.repeat(70)));
    console.log(chalk.green.bold('  ✓ ALL STAGES COMPLETED'));
    console.log(chalk.green.bold('━'.repeat(70)));
    console.log('');
  }
}

// ============================================
// PROGRESS BAR (NOVO - Para downloads/uploads)
// ============================================

export class ProgressBar {
  private total: number;
  private current: number = 0;
  private label: string;
  private width: number = 40;
  private startTime: number;

  constructor(total: number, label: string = 'Progress', width: number = 40) {
    this.total = total;
    this.label = label;
    this.width = width;
    this.startTime = Date.now();

    this.render();
  }

  update(current: number): void {
    this.current = Math.min(current, this.total);
    this.render();
  }

  increment(amount: number = 1): void {
    this.current = Math.min(this.current + amount, this.total);
    this.render();
  }

  complete(): void {
    this.current = this.total;
    this.render();
    console.log('');
  }

  private render(): void {
    const percentage = Math.round((this.current / this.total) * 100);
    const filled = Math.round((percentage / 100) * this.width);
    const empty = this.width - filled;

    const bar = chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
    const stats = chalk.white(`${percentage}%`) + chalk.gray(` (${this.current}/${this.total})`);
    
    // Calcular velocidade/ETA
    const elapsed = (Date.now() - this.startTime) / 1000;
    const rate = this.current / elapsed;
    const remaining = this.total - this.current;
    const eta = remaining / rate;
    
    let speed = '';
    if (elapsed > 1 && this.current > 0) {
      speed = chalk.gray(` • ${rate.toFixed(1)}/s • ETA ${eta.toFixed(0)}s`);
    }

    this.clearLine();
    process.stdout.write(`  ${chalk.gray(this.label)}: [${bar}] ${stats}${speed}`);
  }

  private clearLine(): void {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
  }
}

// ============================================
// TASK PROGRESS (NOVO - Com header visual)
// ============================================

export class TaskProgress {
  private taskName: string;
  private subTasks: Array<{
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startTime?: number;
    endTime?: number;
  }>;
  private currentTask: number = -1;
  private spinner: NodeJS.Timeout | null = null;
  private frameIndex: number = 0;
  private spinnerStyle: SpinnerStyle = 'dots';

  constructor(taskName: string, subTasks: string[], options?: { spinnerStyle?: SpinnerStyle }) {
    this.taskName = taskName;
    this.subTasks = subTasks.map(name => ({
      name,
      status: 'pending' as const
    }));

    if (options?.spinnerStyle) {
      this.spinnerStyle = options.spinnerStyle;
    }

    // Mostrar header
    console.log('');
    console.log(chalk.bold.white('━'.repeat(70)));
    console.log(chalk.bold.cyan(`  ${taskName.toUpperCase()}`));
    console.log(chalk.bold.white('━'.repeat(70)));
    console.log('');
  }

  next(): void {
    // Completar anterior
    if (this.currentTask >= 0) {
      this.stopAnimation();
      const task = this.subTasks[this.currentTask];
      task.status = 'completed';
      task.endTime = Date.now();
      
      this.clearLine();
      
      const duration = task.endTime && task.startTime
        ? chalk.gray(` (${((task.endTime - task.startTime) / 1000).toFixed(2)}s)`)
        : '';
      
      console.log(chalk.green(`  ✓ ${task.name}`) + duration);
    }

    // Iniciar próximo
    this.currentTask++;
    if (this.currentTask >= this.subTasks.length) return;

    const task = this.subTasks[this.currentTask];
    task.status = 'running';
    task.startTime = Date.now();
    
    this.startAnimation();
  }

  complete(): void {
    this.stopAnimation();
    
    if (this.currentTask >= 0) {
      const task = this.subTasks[this.currentTask];
      task.status = 'completed';
      task.endTime = Date.now();
      
      this.clearLine();
      
      const duration = task.endTime && task.startTime
        ? chalk.gray(` (${((task.endTime - task.startTime) / 1000).toFixed(2)}s)`)
        : '';
      
      console.log(chalk.green(`  ✓ ${task.name}`) + duration);
    }

    console.log('');
    console.log(chalk.green.bold('  ✓ ' + this.taskName + ' completed'));
    console.log('');
  }

  error(message: string): void {
    this.stopAnimation();
    
    if (this.currentTask >= 0) {
      const task = this.subTasks[this.currentTask];
      task.status = 'failed';
      task.endTime = Date.now();
      
      this.clearLine();
      console.log(chalk.red(`  ✗ ${task.name}`));
    }

    console.log('');
    console.log(chalk.red.bold('  ✗ ' + message));
    console.log('');
  }

  private startAnimation(): void {
    this.frameIndex = 0;
    const frames = SPINNER_FRAMES[this.spinnerStyle];

    this.spinner = setInterval(() => {
      const task = this.subTasks[this.currentTask];
      const frame = frames[this.frameIndex];
      
      this.clearLine();
      process.stdout.write(
        chalk.cyan(`  ${frame} `) + 
        chalk.white(task.name) +
        chalk.gray('...')
      );

      this.frameIndex = (this.frameIndex + 1) % frames.length;
    }, 80);
  }

  private stopAnimation(): void {
    if (this.spinner) {
      clearInterval(this.spinner);
      this.spinner = null;
    }
  }

  private clearLine(): void {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
  }
}