import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCarrierComponent } from './register-carrier.component';

describe('RegisterCarrierComponent', () => {
  let component: RegisterCarrierComponent;
  let fixture: ComponentFixture<RegisterCarrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCarrierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
