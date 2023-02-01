import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Message, RestService } from 'src/app/rest.service';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmptyStringValidatorService } from './../empty-string-validator.service';

@Component({
    selector: 'app-edit-modal',
    templateUrl: './edit-modal.component.html',
    styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent {

    @Input() messageText!: Message['message'];
    @Input() id!: Message['id'];

    form!: FormGroup;
    submitting = false;
    submitted = false;

    private subscripton$?: Subscription;


    constructor(
        public activeModal: NgbActiveModal,
        private restService: RestService,
        private formBuilder: FormBuilder,
        private validator: EmptyStringValidatorService
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            message: new FormControl(
                this.messageText,
                Validators.required
            ),
        }, { validators: [this.validator.validate] } as AbstractControlOptions);
    }

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
        this.restService.editMessage(this.id, this.form.value.message).subscribe();
    }

}
