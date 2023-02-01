import { ApplicationRef, Component, createComponent, ElementRef, EnvironmentInjector, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService, Message } from './../rest.service';
import tableColumns from 'src/assets/tableColumns';
import { MessageTableCellComponent } from './../message-table-cell/message-table-cell.component';
import { TableColumsPropsService } from './../table-colums-props.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RemoveModalComponent } from './../remove-modal/remove-modal.component';

@Component({
    selector: 'app-message-table',
    templateUrl: './message-table.component.html',
    styleUrls: ['./message-table.component.scss']
})
export class MessageTableComponent {

    messages!: Message[];
    tableLoading?: boolean;
    selectedId?: number;
    tableColumns!: TableColumsPropsService['tableColumns'];
    cellData: [string | number, keyof Message, HTMLElement][] = [];
    hoveredRowIndex?: number;
    matchQuery = window.matchMedia('(hover: none)');
    shouldShowDeleteBtn = this.matchQuery.matches;

    constructor(
        private route: ActivatedRoute,
        private restService: RestService,
        private columnsService: TableColumsPropsService,
        private router: Router,
        private appRef: ApplicationRef,
        private injector: EnvironmentInjector,
        private modalService: NgbModal,
        private eRef: ElementRef
    ) { }

    ngOnInit() {
        this.tableColumns = this.columnsService.tableColumns;
        this.route.queryParams.subscribe(params => {
            this.selectedId = params['selectedId'];
        });
        this.restService.messages$.subscribe(data => this.messages = data);
        this.restService.messagesLoading$.subscribe(data => this.tableLoading = data);

        this.restService.getActualMessages();
        this.matchQuery.addEventListener('change', this.showRemoveBtnsOnMobile);
    }

    ngAfterViewChecked() {
        if (this.cellData.length) {
            this.cellData.forEach(data => this.createCell(...data));
            this.cellData = [];
        }
    }

    @HostListener('document:click', ['$event'])
    clickedOut(e: MouseEvent) {
        const target = (e.target as HTMLElement);
        if ((!target.closest('tr') || target.closest('th')) && this.selectedId) {
            this.showMessageDetails(undefined);
        }
    }

    trackByItems(index: number, item: this['tableColumns'][number]) {
        return item.key;
    }

    trackByMessages(index: number, item: Message) {
        return item.id;
    }

    showMessageDetails(e?: MouseEvent, id?: Message['id']) {
        e && e.stopPropagation();
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: { selectedId: id },
                queryParamsHandling: 'merge',
            });
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

    saveCellData(data: string | number, type: keyof Message, hostElement: HTMLElement) {
        if (hostElement.childElementCount) return;
        const existingDataIndex = this.cellData.findIndex(data => data[2] == hostElement);
        if (existingDataIndex != -1) {
            this.cellData[existingDataIndex] = [data, type, hostElement];
        } else {
            this.cellData.push([data, type, hostElement]);
        }
    }

    createCell(data: string | number, type: keyof Message, hostElement: HTMLElement) {
        const cellRef = createComponent(MessageTableCellComponent, {
            environmentInjector: this.injector,
            hostElement
        });
        cellRef.instance.data = data;
        cellRef.instance.type = type;

        this.appRef.attachView(cellRef.hostView);
    }

}
