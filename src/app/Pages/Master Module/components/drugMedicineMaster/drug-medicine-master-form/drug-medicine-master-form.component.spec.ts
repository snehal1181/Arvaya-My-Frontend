import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugMedicineMasterFormComponent } from './drug-medicine-master-form.component';

describe('DrugMedicineMasterFormComponent', () => {
  let component: DrugMedicineMasterFormComponent;
  let fixture: ComponentFixture<DrugMedicineMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugMedicineMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrugMedicineMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
