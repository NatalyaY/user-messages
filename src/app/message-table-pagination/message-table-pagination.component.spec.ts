import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTablePaginationComponent } from './message-table-pagination.component';

describe('MessageTablePaginationComponent', () => {
  let component: MessageTablePaginationComponent;
  let fixture: ComponentFixture<MessageTablePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageTablePaginationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageTablePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
