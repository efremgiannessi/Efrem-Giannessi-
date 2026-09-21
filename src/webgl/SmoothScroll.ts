// Smooth Virtual Inertia Scroll Engine (Lenis-style with Velocity tracking & Full Native Interop)
export class SmoothScroll {
  public current: number = 0;
  public target: number = 0;
  public max: number = 0;
  public velocity: number = 0;
  public ease: number = 0.085;
  private isAutoScrolling: boolean = false;
  private onUpdateCallbacks: ((scroll: number, velocity: number, max: number) => void)[] = [];

  constructor() {
    this.current = typeof window !== 'undefined' ? window.scrollY || 0 : 0;
    this.target = this.current;
    this.updateMax();
    this.bindEvents();
  }

  public updateMax() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const content = document.getElementById('smooth-content');
    const contentHeight = content ? content.offsetHeight : 0;
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      contentHeight
    );

    // Exact maximum scroll: ends precisely where the footer meets the bottom of the viewport
    this.max = Math.max(0, docHeight - window.innerHeight);
  }

  private bindEvents() {
    window.addEventListener('resize', () => {
      this.updateMax();
      this.target = Math.max(0, Math.min(this.target, this.max));
      this.current = Math.max(0, Math.min(this.current, this.max));
    });

    // Observe document and smooth-content size mutations to keep max exact
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        this.updateMax();
      });
      ro.observe(document.body);
      const content = document.getElementById('smooth-content');
      if (content) {
        ro.observe(content);
      }
    }

    // Native wheel interception for continuous inertia
    window.addEventListener(
      'wheel',
      (e) => {
        // Allow default only if inside an explicit scrollable modal
        const target = e.target as HTMLElement | null;
        if (target && target.closest('[data-lenis-prevent]')) {
          return;
        }

        e.preventDefault();
        this.updateMax();
        const delta = e.deltaY;
        this.target += delta;
        this.target = Math.max(0, Math.min(this.target, this.max));
      },
      { passive: false }
    );

    // Native scroll event fallback / sync (e.g. scrollbar dragging, touch, iframe scroll)
    window.addEventListener(
      'scroll',
      () => {
        if (this.isAutoScrolling) return;

        this.updateMax();
        this.current = window.scrollY;
        this.target = this.current;
        this.velocity = 0;

        for (let i = 0; i < this.onUpdateCallbacks.length; i++) {
          this.onUpdateCallbacks[i](this.current, this.velocity, this.max);
        }
      },
      { passive: true }
    );

    // Keyboard navigation (PageDown, PageUp, Arrows, Home, End)
    window.addEventListener('keydown', (e) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      this.updateMax();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.target = Math.min(this.max, this.target + 120);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.target = Math.max(0, this.target - 120);
      } else if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        this.target = Math.min(this.max, this.target + window.innerHeight * 0.8);
      } else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        this.target = Math.max(0, this.target - window.innerHeight * 0.8);
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.target = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        this.target = this.max;
      }
    });

    // Touch support for mobile inertia
    let touchStartY = 0;
    window.addEventListener(
      'touchstart',
      (e) => {
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );

    window.addEventListener(
      'touchmove',
      (e) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest('[data-lenis-prevent]')) {
          return;
        }
        this.updateMax();
        const touchY = e.touches[0].clientY;
        const delta = (touchStartY - touchY) * 1.5;
        touchStartY = touchY;
        this.target += delta;
        this.target = Math.max(0, Math.min(this.target, this.max));
      },
      { passive: true }
    );
  }

  public scrollTo(targetY: number) {
    this.updateMax();
    this.target = Math.max(0, Math.min(targetY, this.max));
  }

  public onUpdate(callback: (scroll: number, velocity: number, max: number) => void) {
    this.onUpdateCallbacks.push(callback);
  }

  public tick() {
    this.updateMax();
    const prev = this.current;
    const diff = this.target - this.current;

    // Settle when very close to target to prevent micro-jitter
    if (Math.abs(diff) < 0.25) {
      this.current = this.target;
      this.velocity = 0;
    } else {
      this.current += diff * this.ease;
      this.velocity = (this.current - prev) * 0.1;
    }

    // Clamp firmly between 0 and this.max
    this.current = Math.max(0, Math.min(this.current, this.max));

    // Scroll window natively
    if (Math.abs(window.scrollY - this.current) >= 0.5) {
      this.isAutoScrolling = true;
      window.scrollTo(0, this.current);
      requestAnimationFrame(() => {
        this.isAutoScrolling = false;
      });
    }

    // Trigger registered update callbacks
    for (let i = 0; i < this.onUpdateCallbacks.length; i++) {
      this.onUpdateCallbacks[i](this.current, this.velocity, this.max);
    }
  }
}
