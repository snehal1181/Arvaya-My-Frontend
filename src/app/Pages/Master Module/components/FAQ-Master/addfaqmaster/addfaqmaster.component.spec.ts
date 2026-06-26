import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfaqmasterComponent } from './addfaqmaster.component';

describe('AddfaqmasterComponent', () => {
  let component: AddfaqmasterComponent;
  let fixture: ComponentFixture<AddfaqmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddfaqmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddfaqmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
