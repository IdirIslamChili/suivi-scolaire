import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import { DemoDataService } from '../../services/demo-data.service';

/** "Absences" tab: total for the term, then each absence with its status. */
@Component({
  selector: 'app-absences-tab',
  templateUrl: './absences-tab.component.html',
  imports: [DatePipe],
})
export class AbsencesTabComponent {
  protected readonly data = inject(DemoDataService);

  readonly childId = input.required<number>();

  protected readonly absences = computed(() => this.data.getAbsences(this.childId()));
  protected readonly justifiedCount = computed(
    () => this.absences().filter((absence) => absence.justified).length,
  );
  protected readonly unjustifiedCount = computed(
    () => this.absences().length - this.justifiedCount(),
  );
}
