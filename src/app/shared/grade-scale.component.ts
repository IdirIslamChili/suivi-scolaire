import { Component, input } from '@angular/core';

/**
 * A grade drawn on a ruler of 20 graduations: one tick per point out of 20.
 * Colours come from the parent through --scale-on / --scale-off.
 */
@Component({
  selector: 'app-grade-scale',
  template: `<span class="scale" [style.--fill.%]="value() * 5"></span>`,
  styles: `
    :host {
      display: block;
    }
    .scale {
      --tick: repeating-linear-gradient(
        to right,
        #000 0 calc(5% - 3px),
        transparent calc(5% - 3px) 5%
      );
      display: block;
      height: 8px;
      margin-right: -3px; // hides the gap after the 20th tick
      transform-origin: left center;
      animation: ss-bar-in 900ms 140ms both cubic-bezier(0.2, 0.75, 0.25, 1);
      background: linear-gradient(
        to right,
        var(--scale-on, #1e3a8a) var(--fill),
        var(--scale-off, #e2e8f0) var(--fill)
      );
      -webkit-mask: var(--tick);
      mask: var(--tick);
    }
  `,
  host: { 'aria-hidden': 'true' },
})
export class GradeScaleComponent {
  /** Grade out of 20. */
  readonly value = input.required<number>();
}
