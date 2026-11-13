import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import { DemoDataService } from '../../services/demo-data.service';
import { DzdPipe } from '../../shared/format.pipes';

/** "Paiements" tab: what is left to pay, then the monthly fees. Display only. */
@Component({
  selector: 'app-payments-tab',
  templateUrl: './payments-tab.component.html',
  imports: [DatePipe, DzdPipe],
})
export class PaymentsTabComponent {
  private readonly data = inject(DemoDataService);

  readonly childId = input.required<number>();

  protected readonly payments = computed(() => this.data.getPayments(this.childId()));
  protected readonly amountDue = computed(() => this.data.getAmountDue(this.childId()));
  /** Closest due date among the unpaid fees. */
  protected readonly nextDueDate = computed(
    () =>
      this.data
        .getUnpaidPayments(this.childId())
        .map((payment) => payment.dueDate)
        .sort()[0],
  );
}
