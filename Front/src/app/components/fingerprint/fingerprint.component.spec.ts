import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FingerprintPage } from './fingerprint.page';

describe('FingerprintPage', () => {
  let component: FingerprintPage;
  let fixture: ComponentFixture<FingerprintPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FingerprintPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FingerprintPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
