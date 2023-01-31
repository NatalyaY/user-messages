import { Component } from '@angular/core';
import { pagination, RestService } from './../rest.service';
import { Router, ActivatedRoute } from '@angular/router';

type paginationItem = NonNullable<pagination>[number];
type withParams = Exclude<paginationItem, 'divider'>

@Component({
    selector: 'app-message-table-pagination',
    templateUrl: './message-table-pagination.component.html',
    styleUrls: ['./message-table-pagination.component.scss']
})
export class MessageTablePaginationComponent {

    pagination!: pagination;

    constructor(
    private restService: RestService,
    private router: Router,
    private route: ActivatedRoute,
    ) { }


    ngOnInit(): void {
        this.restService.pagination$.subscribe(data => {
            this.pagination = data;
        });
    }

    changePage(params: withParams['params']) {
        this.router
            .navigate(
                [],
                {
                    relativeTo: this.route,
                    queryParams: { _page: params._page == 1 ? undefined : params._page, _limit: params._limit == 20 ? undefined : params._limit},
                }).then(() => this.restService.getMessages().subscribe());
    }

}
