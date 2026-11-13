import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import { DemoDataService } from '../../services/demo-data.service';
import { GradePipe } from '../../shared/format.pipes';
import { GradeScaleComponent } from '../../shared/grade-scale.component';

/** "Notes" tab: general average, then each subject with its grades out of 20. */
@Component({
  selector: 'app-notes-tab',
  templateUrl: './notes-tab.component.html',
  styleUrl: './notes-tab.component.scss',
  imports: [DatePipe, GradePipe, GradeScaleComponent],
})
export class NotesTabComponent {
  protected readonly data = inject(DemoDataService);

  readonly childId = input.required<number>();

  protected readonly subjects = computed(() => this.data.getSubjects(this.childId()));
  protected readonly generalAverage = computed(() => this.data.getGeneralAverage(this.childId()));
}
