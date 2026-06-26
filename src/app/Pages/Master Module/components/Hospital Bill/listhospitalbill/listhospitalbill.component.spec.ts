import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListhospitalbillComponent } from './listhospitalbill.component';

describe('ListhospitalbillComponent', () => {
  let component: ListhospitalbillComponent;
  let fixture: ComponentFixture<ListhospitalbillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListhospitalbillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListhospitalbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
