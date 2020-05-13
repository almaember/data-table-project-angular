import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SzemDialogComponent } from './szem-dialog.component';

describe('SzemDialogComponent', () => {
  let component: SzemDialogComponent;
  let fixture: ComponentFixture<SzemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SzemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SzemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
