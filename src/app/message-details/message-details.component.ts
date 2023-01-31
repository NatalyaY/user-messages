import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService, Message } from './../rest.service';

@Component({
    selector: 'app-message-details',
    templateUrl: './message-details.component.html',
    styleUrls: ['./message-details.component.scss']
})
export class MessageDetailsComponent {

    selectedId?: number;
    isSelected?: boolean;
    message?: Message;
    messages?: Message[];

    constructor(
        private route: ActivatedRoute,
        private restService: RestService,
    ) { }


    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.selectedId = params['selectedId'];
            this.isSelected = params['selectedId'] ? true : false;
            this.message = this.messages?.find(msg => msg.id == this.selectedId);
        });
        this.restService.messages$.subscribe(data => {
            this.messages = data;
            if (!this.selectedId) return;
            this.message = data.find(msg => msg.id == this.selectedId);
        }
        );
    }

    edit(id: Message['id']) {
        this.restService.editMessage(id, 'test').subscribe();
    }

}
