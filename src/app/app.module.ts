import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageTableComponent } from './message-table/message-table.component';
import { MessageDetailsComponent } from './message-details/message-details.component';
import { MessageTableCellComponent } from './message-table-cell/message-table-cell.component';
import { MainComponent } from './main/main.component';
import { MessageTablePaginationComponent } from './message-table-pagination/message-table-pagination.component';
import { DatatimePipe } from './datatime.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { AddModalComponent } from './add-modal/add-modal.component';
import { RemoveModalComponent } from './remove-modal/remove-modal.component';
import { GenerateCellDirective } from './generate-cell.directive';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        MessageTableComponent,
        MessageDetailsComponent,
        MessageTableCellComponent,
        MainComponent,
        MessageTablePaginationComponent,
        DatatimePipe,
        EditModalComponent,
        AddModalComponent,
        RemoveModalComponent,
        GenerateCellDirective,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
