import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListServiceMasterComponent } from './list-service-master.component';

describe('ListServiceMasterComponent', () => {
  let component: ListServiceMasterComponent;
  let fixture: ComponentFixture<ListServiceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListServiceMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListServiceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
