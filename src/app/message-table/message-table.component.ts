import { Component, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService, Message } from './../rest.service';
import { TableColumsPropsService } from './../table-colums-props.service';
import { NgbModal, NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { RemoveModalComponent } from './../remove-modal/remove-modal.component';
import { MessageDetailsComponent } from './../message-details/message-details.component';

@Component({
    selector: 'app-message-table',
    templateUrl: './message-table.component.html',
    styleUrls: ['./message-table.component.scss']
})
export class MessageTableComponent {

    @Input() isDesktop!: boolean;

    messages!: Message[];
    tableLoading?: boolean;
    selectedId?: number;
    tableColumns!: TableColumsPropsService['tableColumns'];
    cellData: [string | number, keyof Message, HTMLElement][] = [];
    hoveredRowIndex?: number;
    matchQuery = window.matchMedia('(hover: none)');
    shouldShowDeleteBtn = this.matchQuery.matches;
    private activeOffcanvas?: NgbOffcanvasRef;

    constructor(
        private route: ActivatedRoute,
        private restService: RestService,
        private columnsService: TableColumsPropsService,
        private router: Router,
        private modalService: NgbModal,
        private offcanvasService: NgbOffcanvas
    ) { }

    ngOnInit() {
        this.tableColumns = this.columnsService.tableColumns;
        this.route.queryParams.subscribe(params => {
            this.selectedId = params['selectedId'];
            if (!params['selectedId'] && this.activeOffcanvas) {
                this.activeOffcanvas.close();
                this.activeOffcanvas = undefined;
            } else if (!this.activeOffcanvas) {
                this.showMessageDetails(undefined, params['selectedId']);
            }
        });
        this.restService.messages$.subscribe(data => this.messages = data);
        this.restService.messagesLoading$.subscribe(data => this.tableLoading = data);

        this.restService.getActualMessages();
        this.matchQuery.addEventListener('change', this.showRemoveBtnsOnMobile);
    }

    ngOnDestroy() {
        this.matchQuery.removeEventListener('change', this.showRemoveBtnsOnMobile);
        this.restService.messages$.unsubscribe();
        this.restService.messagesLoading$.unsubscribe();
    }

    @HostListener('document:click', ['$event'])
    clickedOut(e: MouseEvent) {
        const target = (e.target as HTMLElement);
        if (
            (!target.closest('tr') || target.closest('th'))
            && this.selectedId
            && !target.closest('.messageDetails')
            && !target.closest('.modal')
        ) {
            this.showMessageDetails();
        }
    }

    trackByItems(index: number, item: this['tableColumns'][number]) {
        return item.key;
    }

    trackByMessages(index: number, item: Message) {
        return item.id;
    }

    showMessageDetails(e?: MouseEvent, id?: Message['id']) {
        if (e) {
            e && e.stopPropagation();
            this.router.navigate(
                [],
                {
                    relativeTo: this.route,
                    queryParams: { selectedId: id },
                    queryParamsHandling: 'merge',
                });
        }
        if (!this.isDesktop && id !== undefined) {
            this.activeOffcanvas = this.offcanvasService.open(MessageDetailsComponent);
            this.activeOffcanvas.componentInstance.isOffCanvas = true;
        }
    }

    setHoveredRowIndex(rowIndex: number) {
        this.hoveredRowIndex = rowIndex;
    }

    removeHoveredRowIndex() {
        this.hoveredRowIndex = undefined;
    }

    showRemoveBtnsOnMobile = (e: MediaQueryListEvent) => {
        this.shouldShowDeleteBtn = e.matches;
    };

    removeMessage(e: MouseEvent, id: Message['id']) {
        e.stopPropagation();
        const modalRef = this.modalService.open(RemoveModalComponent, { centered: true });
        modalRef.componentInstance.id = id;
    }

}
