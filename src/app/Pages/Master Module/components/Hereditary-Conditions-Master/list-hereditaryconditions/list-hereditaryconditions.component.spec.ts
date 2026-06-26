import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHereditaryconditionsComponent } from './list-hereditaryconditions.component';

describe('ListHereditaryconditionsComponent', () => {
  let component: ListHereditaryconditionsComponent;
  let fixture: ComponentFixture<ListHereditaryconditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListHereditaryconditionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHereditaryconditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
