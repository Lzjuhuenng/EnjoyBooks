import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookshelvesComponent } from './bookshelves.component';

describe('BookshelvesComponent', () => {
  let component: BookshelvesComponent;
  let fixture: ComponentFixture<BookshelvesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookshelvesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookshelvesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
