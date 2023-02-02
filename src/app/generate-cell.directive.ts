import { Directive, Input, createComponent, EnvironmentInjector, ApplicationRef } from '@angular/core';
import { Message } from './rest.service';
import { MessageTableCellComponent } from './message-table-cell/message-table-cell.component';

interface IArgs {
  data: string | number,
  type: keyof Message,
  hostElement: HTMLElement
}

@Directive({
    selector: '[appGenerateCell]'
})
export class GenerateCellDirective {
    private hasView = false;

    constructor(
      private injector: EnvironmentInjector,
      private appRef: ApplicationRef
    ) { }

  @Input() set appGenerateCell({ data, type, hostElement }: IArgs) {
        if (!this.hasView) {
            this.hasView = true;
            const cellRef = createComponent(MessageTableCellComponent, {
                environmentInjector: this.injector,
                hostElement
            });
            cellRef.instance.data = data;
            cellRef.instance.type = type;

            this.appRef.attachView(cellRef.hostView);
        }
    }

}
