import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureNextDocumentsMasterComponent } from './secure-next-documents-master.component';

describe('SecureNextDocumentsMasterComponent', () => {
  let component: SecureNextDocumentsMasterComponent;
  let fixture: ComponentFixture<SecureNextDocumentsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecureNextDocumentsMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecureNextDocumentsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
