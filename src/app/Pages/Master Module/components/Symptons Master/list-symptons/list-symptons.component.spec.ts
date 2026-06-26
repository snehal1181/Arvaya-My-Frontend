import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSymptonsComponent } from './list-symptons.component';

describe('ListSymptonsComponent', () => {
  let component: ListSymptonsComponent;
  let fixture: ComponentFixture<ListSymptonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSymptonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSymptonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
