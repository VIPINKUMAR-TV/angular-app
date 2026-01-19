import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDayComponent } from './add-new-day.component';

describe('AddNewDayComponent', () => {
  let component: AddNewDayComponent;
  let fixture: ComponentFixture<AddNewDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
