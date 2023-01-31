import { ApplicationRef, Component, createComponent, EnvironmentInjector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService, Message } from './../rest.service';
import tableColumns from 'src/assets/tableColumns';
import { MessageTableCellComponent } from './../message-table-cell/message-table-cell.component';

@Component({
    selector: 'app-message-table',
    templateUrl: './message-table.component.html',
    styleUrls: ['./message-table.component.scss']
})
export class MessageTableComponent {

    messages!: Message[];
    tableLoading?: boolean;
    selectedId?: number;
    tableColumns = tableColumns;
    cellData: [string | number, keyof Message, HTMLElement][] = [];

    constructor(
        private route: ActivatedRoute,
        private restService: RestService,
        private router: Router,
        private appRef: ApplicationRef,
        private injector: EnvironmentInjector
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.selectedId = params['selectedId'];
        });
        this.restService.messages$.subscribe(data => this.messages = data);
        this.restService.messagesLoading$.subscribe(data => this.tableLoading = data);

        this.restService.getActualMessages();
    }

    ngAfterViewChecked() {
        if (this.cellData.length) {
            this.cellData.forEach(data => this.createCell(...data));
            this.cellData = [];
        }
    }

    trackByItems(index: number, item: this['tableColumns'][number]) {
        return item.key;
    }

    trackByMessages(index: number, item: Message) {
        return item.id;
    }

    show(message: Message) {
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: { selectedId: message.id },
                queryParamsHandling: 'merge',
            });
    }

    remove(e: MouseEvent, id: Message['id']) {
        e.stopPropagation();
        this.restService.removeMessage(id).subscribe(_ => {
            const params = this.route.snapshot.queryParams;
            const selectedId = params['selectedId'];
            if (selectedId == id) {
                this.router.navigate(
                    [],
                    {
                        relativeTo: this.route,
                        queryParams: { selectedId: undefined },
                        queryParamsHandling: 'merge',
                    });
            }
        });
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
