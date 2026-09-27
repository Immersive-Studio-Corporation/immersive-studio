/** One greeting per entry. Re-entries during a greeting never restart or queue it. */
export class AvatarGreeting {
  private started: number | null = null;
  private inside = false;
  count = 0;
  readonly duration = 3.4;

  enter(inside: boolean, time: number) {
    const entered = inside && !this.inside;
    this.inside = inside;
    if (
      entered &&
      (this.started === null || time - this.started >= this.duration)
    ) {
      this.started = time;
      this.count++;
    }
  }

  pose(time: number) {
    const elapsed = this.started === null ? this.duration : time - this.started;
    const smooth = (n: number) => {
      const x = Math.max(0, Math.min(1, n));
      return x * x * (3 - 2 * x);
    };
    const weight = smooth(elapsed / 0.55) * (1 - smooth((elapsed - 2.6) / 0.8));
    return {
      active: elapsed < this.duration,
      weight,
      swing: Math.sin(Math.max(0, elapsed - 0.55) * 12) * 0.24,
    };
  }
}
