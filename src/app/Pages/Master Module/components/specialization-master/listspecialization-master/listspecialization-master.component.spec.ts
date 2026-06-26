import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListspecializationMasterComponent } from './listspecialization-master.component';

describe('ListspecializationMasterComponent', () => {
  let component: ListspecializationMasterComponent;
  let fixture: ComponentFixture<ListspecializationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListspecializationMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListspecializationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
