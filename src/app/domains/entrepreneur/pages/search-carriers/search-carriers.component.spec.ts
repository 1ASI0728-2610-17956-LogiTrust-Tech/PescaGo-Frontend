import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCarriersComponent } from './search-carriers.component';

describe('SearchCarriersComponent', () => {
  let component: SearchCarriersComponent;
  let fixture: ComponentFixture<SearchCarriersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCarriersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchCarriersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
