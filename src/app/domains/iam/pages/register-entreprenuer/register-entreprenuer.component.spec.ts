import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEntreprenuerComponent } from './register-entreprenuer.component';

describe('RegisterEntreprenuerComponent', () => {
  let component: RegisterEntreprenuerComponent;
  let fixture: ComponentFixture<RegisterEntreprenuerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterEntreprenuerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterEntreprenuerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
