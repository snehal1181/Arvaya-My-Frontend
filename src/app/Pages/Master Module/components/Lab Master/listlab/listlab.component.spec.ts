import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListlabComponent } from './listlab.component';

describe('ListlabComponent', () => {
  let component: ListlabComponent;
  let fixture: ComponentFixture<ListlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListlabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
