import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFavoritesComponent } from './home-favorites.component';

describe('HomeFavoritesComponent', () => {
  let component: HomeFavoritesComponent;
  let fixture: ComponentFixture<HomeFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeFavoritesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
