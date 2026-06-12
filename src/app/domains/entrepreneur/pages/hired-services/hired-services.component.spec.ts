import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiredServicesComponent } from './hired-services.component';

describe('HiredServicesComponent', () => {
  let component: HiredServicesComponent;
  let fixture: ComponentFixture<HiredServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiredServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiredServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
