import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTechnicianMappingComponent } from './add-technician-mapping.component';

describe('AddTechnicianMappingComponent', () => {
  let component: AddTechnicianMappingComponent;
  let fixture: ComponentFixture<AddTechnicianMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTechnicianMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTechnicianMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
