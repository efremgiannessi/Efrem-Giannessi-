import { isMobileDevice } from '../utils/device';

// Smooth Virtual Inertia Scroll Engine (Lenis-style with Velocity tracking & Full Native Interop)
export class SmoothScroll {
  public current: number = 0;
  public target: number = 0;
  public max: number = 0;
  public velocity: number = 0;
  public ease: number = 0.085;
  public isMobile: boolean = false;

  private isAutoScrolling: boolean = false;
  private lastScrollY: number = 0;
  private lastScrollTime: number = 0;
  private onUpdateCallbacks: ((scroll: number, velocity: number, max: number) => void)[] = [];

  constructor() {
    this.isMobile = isMobileDevice();
    this.current = typeof window !== 'undefined' ? window.scrollY || 0 : 0;
    this.target = this.current;
    this.lastScrollY = this.current;
    this.lastScrollTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

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
    if (typeof window === 'undefined') return;

    let lastWinWidth = window.innerWidth;

    window.addEventListener(
      'resize',
      () => {
        const curWidth = window.innerWidth;
        const widthChanged = Math.abs(curWidth - lastWinWidth) > 10;
        lastWinWidth = curWidth;

        // On mobile, ignore vertical-only resize events from address bar show/hide to prevent scroll jumps
        if (this.isMobile && !widthChanged) {
          return;
        }

        this.updateMax();
        this.target = Math.max(0, Math.min(this.target, this.max));
        this.current = Math.max(0, Math.min(this.current, this.max));
      },
      { passive: true }
    );

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

    // DESKTOP: Native wheel interception for continuous inertia
    if (!this.isMobile) {
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
    }

    // Scroll event listener (syncs native scrollbar, touch scroll, and external scroll)
    window.addEventListener(
      'scroll',
      () => {
        if (this.isAutoScrolling) return;

        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const curY = window.scrollY || window.pageYOffset || 0;
        const dt = Math.max(1, now - this.lastScrollTime);
        const delta = curY - this.lastScrollY;

        this.lastScrollY = curY;
        this.lastScrollTime = now;

        if (this.isMobile) {
          // On mobile, track velocity smoothly via low-pass filter without calling window.scrollTo
          const instantVel = (delta / dt) * 16;
          // Clamp velocity to prevent wild camera rotation jumps on flick
          const clampedVel = Math.max(-25, Math.min(25, instantVel));
          this.velocity = this.velocity * 0.65 + clampedVel * 0.35;
          this.current = curY;
          this.target = curY;

          for (let i = 0; i < this.onUpdateCallbacks.length; i++) {
            this.onUpdateCallbacks[i](this.current, this.velocity, this.max);
          }
          return;
        }

        // Desktop scroll fallback (scrollbar dragging or trackpad native flick)
        this.updateMax();
        this.current = curY;
        this.target = this.current;
        this.velocity = 0;

        for (let i = 0; i < this.onUpdateCallbacks.length; i++) {
          this.onUpdateCallbacks[i](this.current, this.velocity, this.max);
        }
      },
      { passive: true }
    );

    // Keyboard navigation (PageDown, PageUp, Arrows, Home, End) - primarily for desktop
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

    // NOTE: On mobile devices, we deliberately DO NOT intercept touchmove or call window.scrollTo.
    // Native mobile touch scrolling is already 120Hz hardware-accelerated on iOS/Android.
    // Hijacking touchmove and calling window.scrollTo was the direct cause of stuttering and fighting the compositor.
  }

  public scrollTo(targetY: number) {
    this.updateMax();
    const clamped = Math.max(0, Math.min(targetY, this.max));
    this.target = clamped;

    if (this.isMobile) {
      this.current = clamped;
      window.scrollTo({ top: clamped, behavior: 'smooth' });
    }
  }

  public onUpdate(callback: (scroll: number, velocity: number, max: number) => void) {
    this.onUpdateCallbacks.push(callback);
  }

  public tick() {
    // MOBILE MODE: Native hardware-accelerated scroll.
    // We only smoothly decay the velocity for WebGL shaders, never call window.scrollTo!
    if (this.isMobile) {
      this.current = window.scrollY || window.pageYOffset || 0;
      this.target = this.current;
      // Exponential velocity decay
      this.velocity *= 0.90;
      if (Math.abs(this.velocity) < 0.05) {
        this.velocity = 0;
      }

      // Dispatch updates to WebGL scene
      for (let i = 0; i < this.onUpdateCallbacks.length; i++) {
        this.onUpdateCallbacks[i](this.current, this.velocity, this.max);
      }
      return;
    }

    // DESKTOP MODE: Inertial Lerp Scroller
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
