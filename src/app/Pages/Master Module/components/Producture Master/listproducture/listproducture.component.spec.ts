import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListproductureComponent } from './listproducture.component';

describe('ListproductureComponent', () => {
  let component: ListproductureComponent;
  let fixture: ComponentFixture<ListproductureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListproductureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListproductureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
