import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListfaqmasterComponent } from './listfaqmaster.component';

describe('ListfaqmasterComponent', () => {
  let component: ListfaqmasterComponent;
  let fixture: ComponentFixture<ListfaqmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListfaqmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListfaqmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
