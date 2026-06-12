import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmedServicesComponent } from './confirmed-services.component';

describe('ConfirmedServicesComponent', () => {
  let component: ConfirmedServicesComponent;
  let fixture: ComponentFixture<ConfirmedServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmedServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmedServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
