import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuButtonPage } from './menu-button.page';

describe('MenuButtonPage', () => {
  let component: MenuButtonPage;
  let fixture: ComponentFixture<MenuButtonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuButtonPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuButtonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
