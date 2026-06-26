import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthrecordstableComponent } from './healthrecordstable.component';

describe('HealthrecordstableComponent', () => {
  let component: HealthrecordstableComponent;
  let fixture: ComponentFixture<HealthrecordstableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthrecordstableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthrecordstableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
