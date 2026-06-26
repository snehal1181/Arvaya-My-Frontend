import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddhospitalbillComponent } from './addhospitalbill.component';

describe('AddhospitalbillComponent', () => {
  let component: AddhospitalbillComponent;
  let fixture: ComponentFixture<AddhospitalbillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddhospitalbillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddhospitalbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
