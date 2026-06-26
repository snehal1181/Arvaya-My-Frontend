import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpecializationMasterComponent } from './add-specialization-master.component';

describe('AddSpecializationMasterComponent', () => {
  let component: AddSpecializationMasterComponent;
  let fixture: ComponentFixture<AddSpecializationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSpecializationMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSpecializationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
