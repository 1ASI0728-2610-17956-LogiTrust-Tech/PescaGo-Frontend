import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacketDetailsComponent } from './packet-details.component';

describe('PacketDetailsComponent', () => {
  let component: PacketDetailsComponent;
  let fixture: ComponentFixture<PacketDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacketDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacketDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
