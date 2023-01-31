import { Injectable } from '@angular/core';
import tableColumns from 'src/assets/tableColumns';

@Injectable({
    providedIn: 'root'
})
export class TableColumsPropsService {
    tableColumns: typeof tableColumns;

    constructor() {
        this.tableColumns = tableColumns.sort((a, b) => a.order - b.order).filter(col => col.visible);
    }
}
