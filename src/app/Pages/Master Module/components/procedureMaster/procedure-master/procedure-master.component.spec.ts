import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedureMasterComponent } from './procedure-master.component';

describe('ProcedureMasterComponent', () => {
  let component: ProcedureMasterComponent;
  let fixture: ComponentFixture<ProcedureMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcedureMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcedureMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
