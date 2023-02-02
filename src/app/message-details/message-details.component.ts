import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService, Message } from './../rest.service';
import { TableColumsPropsService } from './../table-colums-props.service';
import { EditModalComponent } from './../edit-modal/edit-modal.component';
import { Injector } from '@angular/core';  

@Component({
    selector: 'app-message-details',
    templateUrl: './message-details.component.html',
    styleUrls: ['./message-details.component.scss']
})
export class MessageDetailsComponent {

    @Input() isOffCanvas?: boolean;

    selectedId?: number;
    isSelected?: boolean;
    message?: Message;
    messages?: Message[];
    tableColumns!: TableColumsPropsService['tableColumns'];
    activeCanvas?: NgbActiveOffcanvas;

    constructor(
        private route: ActivatedRoute,
        private restService: RestService,
        private router: Router,
        private columnsService: TableColumsPropsService,
        private modalService: NgbModal,
        private injector: Injector
    ) {}


    ngOnInit() {
        if (this.isOffCanvas) {
            this.activeCanvas = <NgbActiveOffcanvas>this.injector.get(NgbActiveOffcanvas);
        }
        this.tableColumns = this.columnsService.tableColumns;
        this.restService.messages$.subscribe(data => {
            this.messages = data;
            if (!this.selectedId) return;
            this.message = data.find(msg => msg.id == this.selectedId);
            if (!this.message) {
                this.router
                    .navigate(
                        [],
                        {
                            relativeTo: this.route,
                            queryParams: { selectedId: undefined },
                            queryParamsHandling: 'merge',
                        });
            }
        }
        );
        this.route.queryParams.subscribe(params => {
            this.selectedId = params['selectedId'];
            this.isSelected = params['selectedId'] ? true : false;
            if (!this.messages) {
                this.restService.getActualMessages();
                return;
            }
            this.message = this.messages.find(msg => msg.id == this.selectedId);
        });
    }

    editMessage(message: Message) {
        const modalRef = this.modalService.open(EditModalComponent, { centered: true });
        modalRef.componentInstance.messageText = message.message;
        modalRef.componentInstance.id = message.id;
    }

}
