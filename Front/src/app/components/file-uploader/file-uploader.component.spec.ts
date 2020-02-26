import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploaderPage } from './file-uploader.page';

describe('FileUploaderPage', () => {
  let component: FileUploaderPage;
  let fixture: ComponentFixture<FileUploaderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUploaderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
