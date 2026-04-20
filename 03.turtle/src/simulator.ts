type TurtleApi = {
  move(distance: number): void;
  turn(angle: number): void;
};

type Point = {
  x: number;
  y: number;
};

type PathSegment = {
  start: Point;
  end: Point;
};

type Command =
  | { type: 'move'; distance: number }
  | { type: 'turn'; angle: number };

export class TurtleSimulator implements TurtleApi {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private position: Point;
  private headingDegrees: number;
  private readonly pathSegments: PathSegment[];
  private readonly commandQueue: Command[];
  private playbackId: number;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('2D canvas context is not available.');
    }

    this.canvas = canvas;
    this.context = context;
    this.position = { x: canvas.width / 2, y: canvas.height / 2 };
    this.headingDegrees = 0;
    this.pathSegments = [];
    this.commandQueue = [];
    this.playbackId = 0;
    this.reset();
  }

  reset(): void {
    this.playbackId += 1;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = '#ffffff';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.lineWidth = 2;
    this.context.strokeStyle = '#000000';
    this.context.lineCap = 'round';
    this.position = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    this.headingDegrees = 0;
    this.pathSegments.length = 0;
    this.commandQueue.length = 0;
    this.render();
  }

  move(distance: number): void {
    this.commandQueue.push({ type: 'move', distance });
  }

  turn(angle: number): void {
    this.commandQueue.push({ type: 'turn', angle });
  }

  async play(): Promise<void> {
    const activePlaybackId = ++this.playbackId;

    for (const command of this.commandQueue) {
      if (activePlaybackId !== this.playbackId) {
        return;
      }

      if (command.type === 'move') {
        await this.animateMove(command.distance, activePlaybackId);
        continue;
      }

      if (command.type === 'turn') {
        await this.animateTurn(command.angle, activePlaybackId);
        continue;
      }


    }

    this.commandQueue.length = 0;
  }

  private async animateMove(distance: number, activePlaybackId: number): Promise<void> {
    const start = { ...this.position };
    const radians = (this.headingDegrees * Math.PI) / 180;
    const target = {
      x: start.x + Math.cos(radians) * distance,
      y: start.y + Math.sin(radians) * distance,
    };

    const animatedSegment: PathSegment = { start, end: { ...start } };
    this.pathSegments.push(animatedSegment);

    const duration = Math.max(250, Math.min(1200, Math.abs(distance) * 8));
    const startedAt = performance.now();

    while (true) {
      if (activePlaybackId !== this.playbackId) {
        return;
      }

      const elapsed = performance.now() - startedAt;
      const progress = Math.min(1, elapsed / duration);
      const nextPoint = {
        x: start.x + (target.x - start.x) * progress,
        y: start.y + (target.y - start.y) * progress,
      };

      this.position = nextPoint;
      animatedSegment.end = { ...nextPoint };
      this.render();

      if (progress >= 1) {
        break;
      }

      await this.nextFrame();
    }
  }

  private async animateTurn(angle: number, activePlaybackId: number): Promise<void> {
    const startHeading = this.headingDegrees;
    const targetHeading = startHeading + angle;
    const duration = Math.max(120, Math.min(500, Math.abs(angle) * 6));
    const startedAt = performance.now();

    while (true) {
      if (activePlaybackId !== this.playbackId) {
        return;
    }

      const elapsed = performance.now() - startedAt;
      const progress = Math.min(1, elapsed / duration);
      this.headingDegrees = startHeading + (targetHeading - startHeading) * progress;
      this.render();

      if (progress >= 1) {
        break;
      }

      await this.nextFrame();
    }
  }

  private async animateMoveTo(target: Point, activePlaybackId: number): Promise<void> {
    const start = { ...this.position };
    const distance = Math.hypot(target.x - start.x, target.y - start.y);

    const animatedSegment: PathSegment = { start, end: { ...start } };
    this.pathSegments.push(animatedSegment);

    const duration = Math.max(250, Math.min(1200, distance * 8));
    const startedAt = performance.now();

    while (true) {
      if (activePlaybackId !== this.playbackId) {
        return;
      }

      const elapsed = performance.now() - startedAt;
      const progress = Math.min(1, elapsed / duration);
      const nextPoint = {
        x: start.x + (target.x - start.x) * progress,
        y: start.y + (target.y - start.y) * progress,
      };

      this.position = nextPoint;
      animatedSegment.end = { ...nextPoint };
      this.render();

      if (progress >= 1) {
        break;
      }

      await this.nextFrame();
    }
  }

  private nextFrame(): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  }

  private wait(durationMs: number, activePlaybackId: number): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        if (activePlaybackId === this.playbackId) {
          resolve();
          return;
        }

        resolve();
      }, durationMs);
    });
  }

  private render(): void {
    this.context.fillStyle = '#ffffff';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const segment of this.pathSegments) {
      this.context.beginPath();
      this.context.moveTo(segment.start.x, segment.start.y);
      this.context.lineTo(segment.end.x, segment.end.y);
      this.context.stroke();
    }

    this.context.save();
    this.context.translate(this.position.x, this.position.y);
    this.context.rotate((this.headingDegrees * Math.PI) / 180);
    this.context.fillStyle = '#14866d';
    this.context.beginPath();
    this.context.moveTo(12, 0);
    this.context.lineTo(-8, 7);
    this.context.lineTo(-4, 0);
    this.context.lineTo(-8, -7);
    this.context.closePath();
    this.context.fill();
    this.context.restore();
  }
}

export async function runTurtleProgram(code: string, simulator: TurtleSimulator): Promise<void> {
  simulator.reset();

  const execute = new Function('turtle', code) as (turtle: TurtleApi) => void;
  execute(simulator);
  await simulator.play();
}
