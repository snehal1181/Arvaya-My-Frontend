import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTechniciansServiceMappingComponent } from './add-technicians-service-mapping.component';

describe('AddTechniciansServiceMappingComponent', () => {
  let component: AddTechniciansServiceMappingComponent;
  let fixture: ComponentFixture<AddTechniciansServiceMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTechniciansServiceMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTechniciansServiceMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
