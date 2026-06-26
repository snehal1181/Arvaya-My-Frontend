import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddproductureComponent } from './addproducture.component';

describe('AddproductureComponent', () => {
  let component: AddproductureComponent;
  let fixture: ComponentFixture<AddproductureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddproductureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddproductureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
