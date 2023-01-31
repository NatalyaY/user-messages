import { Component } from '@angular/core';
import { PostMessage, RestService } from './../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    control!: FormControl;

    constructor(
        private route: ActivatedRoute,
        private restService: RestService,
        private router: Router,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.control = this.formBuilder.control({
                value: params['q'], disabled: false });
        });
    }

    add(message?: PostMessage) {
        const msg: PostMessage = {
            username: 'test',
            datetime: 123,
            message: 'string'
        };
        this.restService.addMessage(msg).subscribe();
    }

    search(q: string) {
        this.router
            .navigate(
                [],
                {
                    relativeTo: this.route,
                    queryParams: { q },
                })
            .then(() =>
                this.restService.getSearchResults().subscribe()
            );
    }

    onSubmit() {
        this.search(this.control.value);
    }

}
