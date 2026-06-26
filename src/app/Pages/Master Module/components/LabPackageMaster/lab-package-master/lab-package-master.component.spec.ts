import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPackageMasterComponent } from './lab-package-master.component';

describe('LabPackageMasterComponent', () => {
  let component: LabPackageMasterComponent;
  let fixture: ComponentFixture<LabPackageMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabPackageMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabPackageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
