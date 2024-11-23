import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StCartActionsComponent } from './st-cart-actions.component';

describe('StCartActionsComponent', () => {
  let component: StCartActionsComponent;
  let fixture: ComponentFixture<StCartActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StCartActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StCartActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
