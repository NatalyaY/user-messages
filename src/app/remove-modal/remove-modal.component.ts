import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/rest.service';
import { Message } from './../rest.service';

@Component({
    selector: 'app-remove-modal',
    templateUrl: './remove-modal.component.html',
    styleUrls: ['./remove-modal.component.scss']
})
export class RemoveModalComponent {

  @Input() id!: Message['id'];
  submitting = false;
  submitted = false;

  private subscripton$?: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private restService: RestService,
  ) { }

  onSubmit() {
      this.subscripton$ = this.restService.messagesLoading$.subscribe(v => {
          if (!v) {
              this.submitting = false;
              this.submitted = true;
              setTimeout(() => this.activeModal.close(), 1000);
              this.subscripton$?.unsubscribe();
          }
      });
      this.submitting = true;
      this.restService.removeMessage(this.id).subscribe();
  }
}
