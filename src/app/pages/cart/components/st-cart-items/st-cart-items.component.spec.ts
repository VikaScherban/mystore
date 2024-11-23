import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StCartItemsComponent } from './st-cart-items.component';

describe('StCartItemsComponent', () => {
  let component: StCartItemsComponent;
  let fixture: ComponentFixture<StCartItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StCartItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StCartItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
