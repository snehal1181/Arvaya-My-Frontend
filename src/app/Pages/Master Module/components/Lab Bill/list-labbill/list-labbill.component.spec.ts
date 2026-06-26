import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLabbillComponent } from './list-labbill.component';

describe('ListLabbillComponent', () => {
  let component: ListLabbillComponent;
  let fixture: ComponentFixture<ListLabbillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLabbillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLabbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
