import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from './../rest.service';

@Component({
    selector: 'app-message-table-cell',
    templateUrl: './message-table-cell.component.html',
    styleUrls: ['./message-table-cell.component.scss']
})
export class MessageTableCellComponent implements OnInit {
    @Input() data!: any;
    @Input() type!: keyof Message;

    content?: any;

    constructor(
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        if (this.type == 'message' && this.data.length > 100) {
            this.content = this.data.slice(0, 101) + '...';
        } else {
            this.content = this.data;
        }
        this.route.queryParams.subscribe(params => {
            if (typeof this.content == 'number') return;
            const q = params['q'];
            this.content = this.content
                .replaceAll('<span class="highlight">', '')
                .replaceAll('</span>', '')
                .replace(
                    new RegExp(q, 'gi'),
                    (match: string) => '<span class="highlight">' + match + '</span>'
                );
        });
    }


}
