import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StCartComponent } from './st-cart.component';

describe('StCartComponent', () => {
  let component: StCartComponent;
  let fixture: ComponentFixture<StCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
