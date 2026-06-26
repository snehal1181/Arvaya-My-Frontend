import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHereditaryconditionsComponent } from './add-hereditaryconditions.component';

describe('AddHereditaryconditionsComponent', () => {
  let component: AddHereditaryconditionsComponent;
  let fixture: ComponentFixture<AddHereditaryconditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHereditaryconditionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHereditaryconditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
