import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugMedicineMasterComponent } from './drug-medicine-master.component';

describe('DrugMedicineMasterComponent', () => {
  let component: DrugMedicineMasterComponent;
  let fixture: ComponentFixture<DrugMedicineMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugMedicineMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrugMedicineMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
