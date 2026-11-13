import { Component, computed, input } from '@angular/core';

/** Photo placeholder: a coloured disc with the person's initials. */
@Component({
  selector: 'app-avatar',
  template: `<span class="avatar" [class]="'avatar--' + tone()" [style.--size.px]="size()">{{
    initials()
  }}</span>`,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
    }
    .avatar {
      display: grid;
      place-items: center;
      width: var(--size);
      height: var(--size);
      border-radius: 50%;
      font-size: calc(var(--size) * 0.36);
      font-weight: 800;
      letter-spacing: 0.02em;
    }
    .avatar--blue {
      background: linear-gradient(145deg, #3b82f6 0%, #1e3a8a 100%);
      color: #fff;
    }
    .avatar--sky {
      background: linear-gradient(145deg, #a78bfa 0%, #7c3aed 100%);
      color: #fff;
    }
    .avatar--navy {
      background: linear-gradient(145deg, #1e3a8a 0%, #7c3aed 115%);
      color: #fff;
    }
  `,
  host: { 'aria-hidden': 'true' },
})
export class AvatarComponent {
  readonly firstName = input.required<string>();
  readonly lastName = input.required<string>();
  readonly tone = input<'blue' | 'sky' | 'navy'>('blue');
  readonly size = input(48);

  protected readonly initials = computed(() =>
    `${this.firstName().charAt(0)}${this.lastName().charAt(0)}`.toUpperCase(),
  );
}
