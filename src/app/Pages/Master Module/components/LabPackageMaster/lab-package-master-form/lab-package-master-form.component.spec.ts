import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPackageMasterFormComponent } from './lab-package-master-form.component';

describe('LabPackageMasterFormComponent', () => {
  let component: LabPackageMasterFormComponent;
  let fixture: ComponentFixture<LabPackageMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabPackageMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabPackageMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
