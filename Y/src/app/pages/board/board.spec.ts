import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { TeamsService } from '../teams/teams.service';
import { Board } from './board';
import { ItemsService } from './items.service';

describe('Board', () => {
  let component: Board;
  let fixture: ComponentFixture<Board>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Board],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: {}, paramMap: { get: () => 'team-1' } } },
        },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: TeamsService, useValue: { getTeams: () => of([{ id: 'team-1', name: 'Team 1' }]) } },
        { provide: ItemsService, useValue: { getItems: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Board);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
