import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListhospitalreviewComponent } from './listhospitalreview.component';

describe('ListhospitalreviewComponent', () => {
  let component: ListhospitalreviewComponent;
  let fixture: ComponentFixture<ListhospitalreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListhospitalreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListhospitalreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
