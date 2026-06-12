import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferedPriceComponent } from './offered-price.component';

describe('OfferedPriceComponent', () => {
  let component: OfferedPriceComponent;
  let fixture: ComponentFixture<OfferedPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferedPriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferedPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
