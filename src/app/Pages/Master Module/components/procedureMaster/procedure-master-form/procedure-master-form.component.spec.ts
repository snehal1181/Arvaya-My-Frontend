import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureMasterFormComponent } from './procedure-master-form.component';

describe('ProcedureMasterFormComponent', () => {
  let component: ProcedureMasterFormComponent;
  let fixture: ComponentFixture<ProcedureMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcedureMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcedureMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
