import { Component } from '@angular/core';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {
    matchQuery = window.matchMedia('(min-width:1024px)');
    isDesktop = this.matchQuery.matches;

    ngOnInit() {
        this.matchQuery.addEventListener('change', this.open);
    }

    ngOnDestroy() {
        this.matchQuery.removeEventListener('change', this.open);
    }

    open = (e: MediaQueryListEvent) => {
        this.isDesktop = e.matches;
    };
}
