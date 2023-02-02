import { Component } from '@angular/core';
import { RestService } from './../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddModalComponent } from './../add-modal/add-modal.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    control!: FormControl;
    matchQuery = window.matchMedia('(min-width:600px)');
    isDesktop = this.matchQuery.matches;

    constructor(
        private route: ActivatedRoute,
        private restService: RestService,
        private router: Router,
        private formBuilder: FormBuilder,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.control = this.formBuilder.control({
                value: params['q'], disabled: false
            });
        });
        this.matchQuery.addEventListener('change', this.changeIsDesktop);
    }

    ngOnDestroy() {
        this.matchQuery.removeEventListener('change', this.changeIsDesktop);
    }

    changeIsDesktop = (e: MediaQueryListEvent) => {
        this.isDesktop = e.matches;
    };

    add() {
        this.modalService.open(AddModalComponent, { centered: true });
    }

    search(q: string) {
        const query: string = q.trim();
        if (!query.length) {
            if (this.route.snapshot.queryParams['q']) {
                this.router
                    .navigate(
                        [],
                        {
                            relativeTo: this.route,
                            queryParams: { q: undefined, _page: undefined },
                        })
                    .then(() =>
                        this.restService.getMessages().subscribe()
                    );

            } else return;
        } else {
            this.router
                .navigate(
                    [],
                    {
                        relativeTo: this.route,
                        queryParams: { q: query, _page: undefined },
                    })
                .then(() =>
                    this.restService.getSearchResults().subscribe()
                );
        }
    }

    onSubmit() {
        this.search(this.control.value);
    }

}
