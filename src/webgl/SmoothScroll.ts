import { isMobileDevice } from '../utils/device';

// Ultra-performant Native-Synchronized Scroll Engine with Low-Pass Velocity Tracking
// Completely avoids wheel hijacking, layout thrashing, and RAF window.scrollTo locks.
export class SmoothScroll {
  public current: number = 0;
  public target: number = 0;
  public max: number = 0;
  public velocity: number = 0;
  public isMobile: boolean = false;

  private lastScrollY: number = 0;
  private lastScrollTime: number = 0;
  private onUpdateCallbacks: ((scroll: number, velocity: number, max: number) => void)[] = [];
  private resizeObserver: ResizeObserver | null = null;
  private updateMaxTimeout: number | null = null;

  constructor() {
    this.isMobile = isMobileDevice();
    this.current = typeof window !== 'undefined' ? window.scrollY || window.pageYOffset || 0 : 0;
    this.target = this.current;
    this.lastScrollY = this.current;
    this.lastScrollTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

    this.updateMax();
    this.bindEvents();
  }

  // Measure max scroll bounds without layout thrashing
  public updateMax() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const content = document.getElementById('smooth-content');
    const contentHeight = content ? content.offsetHeight : 0;
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      contentHeight
    );

    this.max = Math.max(0, docHeight - window.innerHeight);
  }

  // Debounced updateMax to avoid multiple reflows
  private scheduleUpdateMax() {
    if (this.updateMaxTimeout !== null) return;
    this.updateMaxTimeout = window.setTimeout(() => {
      this.updateMaxTimeout = null;
      this.updateMax();
    }, 150);
  }

  private bindEvents() {
    if (typeof window === 'undefined') return;

    // Passive resize listener with debounced max recalculation
    window.addEventListener(
      'resize',
      () => {
        this.scheduleUpdateMax();
      },
      { passive: true }
    );

    // Observe size changes efficiently via ResizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.scheduleUpdateMax();
      });
      this.resizeObserver.observe(document.body);
      const content = document.getElementById('smooth-content');
      if (content) {
        this.resizeObserver.observe(content);
      }
    }

    // 100% Native, zero-latency passive scroll listener
    // Never calls preventDefault or synchronous window.scrollTo!
    window.addEventListener(
      'scroll',
      () => {
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const curY = window.scrollY || window.pageYOffset || 0;
        const dt = Math.max(1, now - this.lastScrollTime);
        const delta = curY - this.lastScrollY;

        this.lastScrollY = curY;
        this.lastScrollTime = now;

        // Instant velocity estimation via low-pass filter
        const instantVel = (delta / dt) * 16;
        const clampedVel = Math.max(-25, Math.min(25, instantVel));
        this.velocity = this.velocity * 0.6 + clampedVel * 0.4;
        this.current = curY;
        this.target = curY;

        // Notify WebGL scene
        for (let i = 0; i < this.onUpdateCallbacks.length; i++) {
          this.onUpdateCallbacks[i](this.current, this.velocity, this.max);
        }
      },
      { passive: true }
    );
  }

  public scrollTo(targetY: number) {
    this.updateMax();
    const clamped = Math.max(0, Math.min(targetY, this.max));
    this.target = clamped;
    this.current = clamped;

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: clamped, behavior: 'smooth' });
    }
  }

  public onUpdate(callback: (scroll: number, velocity: number, max: number) => void) {
    this.onUpdateCallbacks.push(callback);
  }

  // Animation frame step called by RAF loop (Zero layout queries inside tick!)
  public tick() {
    // Smooth exponential velocity decay when scroll stops
    if (Math.abs(this.velocity) > 0.01) {
      this.velocity *= 0.88;
      if (Math.abs(this.velocity) < 0.01) {
        this.velocity = 0;
      }
      for (let i = 0; i < this.onUpdateCallbacks.length; i++) {
        this.onUpdateCallbacks[i](this.current, this.velocity, this.max);
      }
    }
  }

  public destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.updateMaxTimeout !== null) {
      clearTimeout(this.updateMaxTimeout);
      this.updateMaxTimeout = null;
    }
    this.onUpdateCallbacks = [];
  }
}
