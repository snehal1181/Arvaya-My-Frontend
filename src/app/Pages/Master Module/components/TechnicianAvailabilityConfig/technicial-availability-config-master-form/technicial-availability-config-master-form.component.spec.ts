import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicialAvailabilityConfigMasterFormComponent } from './technicial-availability-config-master-form.component';

describe('TechnicialAvailabilityConfigMasterFormComponent', () => {
  let component: TechnicialAvailabilityConfigMasterFormComponent;
  let fixture: ComponentFixture<TechnicialAvailabilityConfigMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicialAvailabilityConfigMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicialAvailabilityConfigMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
