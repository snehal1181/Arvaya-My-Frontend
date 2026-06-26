import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicialAvailabilityConfigMasterComponent } from './technicial-availability-config-master.component';

describe('TechnicialAvailabilityConfigMasterComponent', () => {
  let component: TechnicialAvailabilityConfigMasterComponent;
  let fixture: ComponentFixture<TechnicialAvailabilityConfigMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicialAvailabilityConfigMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicialAvailabilityConfigMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
