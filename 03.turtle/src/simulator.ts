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
  private static readonly WORLD_WIDTH = 480;
  private static readonly WORLD_HEIGHT = 480;

  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly turtleImage: HTMLImageElement;
  private viewportWidth: number;
  private viewportHeight: number;
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
    this.turtleImage = new Image();
    this.turtleImage.src = '/logo_se.png';
    this.turtleImage.addEventListener('load', () => {
      this.render();
    });
    this.viewportWidth = canvas.width;
    this.viewportHeight = canvas.height;
    this.position = { x: 0, y: 0 };
    this.headingDegrees = 0;
    this.pathSegments = [];
    this.commandQueue = [];
    this.playbackId = 0;

    this.syncCanvasSize();
    this.position = { x: this.viewportWidth / 2, y: this.viewportHeight / 2 };
    window.addEventListener('resize', () => {
      this.syncCanvasSize();
      this.render();
    });

    this.reset();
  }

  reset(): void {
    this.playbackId += 1;
    this.syncCanvasSize();
    this.position = {
      x: TurtleSimulator.WORLD_WIDTH / 2,
      y: TurtleSimulator.WORLD_HEIGHT / 2,
    };
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

  private nextFrame(): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  }

  private render(): void {
    this.syncCanvasSize();
    this.context.fillStyle = '#ffffff';
    this.context.fillRect(0, 0, this.viewportWidth, this.viewportHeight);

    const scaleX = this.viewportWidth / TurtleSimulator.WORLD_WIDTH;
    const scaleY = this.viewportHeight / TurtleSimulator.WORLD_HEIGHT;

    this.context.save();
    this.context.scale(scaleX, scaleY);
    this.context.lineWidth = 2;
    this.context.strokeStyle = '#000000';
    this.context.lineCap = 'round';

    for (const segment of this.pathSegments) {
      this.context.beginPath();
      this.context.moveTo(segment.start.x, segment.start.y);
      this.context.lineTo(segment.end.x, segment.end.y);
      this.context.stroke();
    }

    this.context.translate(this.position.x, this.position.y);
    this.context.rotate((this.headingDegrees * Math.PI) / 180);

    if (this.turtleImage.complete && this.turtleImage.naturalWidth > 0) {
      const spriteSize = this.getSpriteSize();
      this.context.imageSmoothingEnabled = true;
      this.context.imageSmoothingQuality = 'high';
      this.context.drawImage(
        this.turtleImage,
        -spriteSize / 2,
        -spriteSize / 2,
        spriteSize,
        spriteSize,
      );
    } else {
      this.context.fillStyle = '#14866d';
      this.context.beginPath();
      this.context.moveTo(12, 0);
      this.context.lineTo(-8, 7);
      this.context.lineTo(-4, 0);
      this.context.lineTo(-8, -7);
      this.context.closePath();
      this.context.fill();
    }

    this.context.restore();
  }

  private getSpriteSize(): number {
    const worldScale = Math.min(TurtleSimulator.WORLD_WIDTH, TurtleSimulator.WORLD_HEIGHT);
    return Math.max(28, Math.min(96, worldScale * 0.067));
  }

  private syncCanvasSize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const cssWidth = Math.max(1, Math.round(rect.width || this.viewportWidth));
    const cssHeight = Math.max(1, Math.round(rect.height || this.viewportHeight));
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const pixelWidth = Math.round(cssWidth * dpr);
    const pixelHeight = Math.round(cssHeight * dpr);

    if (this.canvas.width === pixelWidth && this.canvas.height === pixelHeight) {
      return;
    }

    this.canvas.width = pixelWidth;
    this.canvas.height = pixelHeight;
    this.viewportWidth = cssWidth;
    this.viewportHeight = cssHeight;
    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}

export async function runTurtleProgram(code: string, simulator: TurtleSimulator): Promise<void> {
  simulator.reset();

  const execute = new Function('turtle', code) as (turtle: TurtleApi) => void;
  execute(simulator);
  await simulator.play();
}
