import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControlOptions } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/rest.service';
import { EmptyStringValidatorService } from './../empty-string-validator.service';
import { CustomDatepickerI18n, I18n, CustomDateParserFormatter } from './../datepicker.service';


@Component({
    selector: 'app-add-modal',
    templateUrl: './add-modal.component.html',
    styleUrls: ['./add-modal.component.scss'],
    providers: [
        I18n,
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    ]
})
export class AddModalComponent {

    form!: FormGroup;
    submitting = false;
    submitted = false;

    private subscripton$?: Subscription;

    constructor(
        public activeModal: NgbActiveModal,
        private restService: RestService,
        private formBuilder: FormBuilder,
        private validator: EmptyStringValidatorService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: new FormControl('', Validators.compose([Validators.required, this.validator.validate])),
            date: new FormControl('', Validators.required),
            time: new FormControl('', Validators.required),
            message: new FormControl('', Validators.compose([Validators.required, this.validator.validate])),
        });
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
        const {date, time, ...message} = this.form.value;
        const datetime = new Date(date.year, date.month - 1, date.day, time.hour, time.minute, 0).getTime();
        this.restService.addMessage({ ...message, datetime }).subscribe();
    }

}
