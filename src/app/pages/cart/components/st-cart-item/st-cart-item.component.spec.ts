import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StCartItemComponent } from './st-cart-item.component';

describe('StCartItemComponent', () => {
  let component: StCartItemComponent;
  let fixture: ComponentFixture<StCartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StCartItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StCartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
