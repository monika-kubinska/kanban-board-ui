import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { TeamsService } from '../teams/teams.service';
import { BoardFacade } from './board.facade';
import { ItemsService } from './items.service';

describe('BoardFacade', () => {
  let facade: BoardFacade;
  let itemsService: {
    getItems: ReturnType<typeof vi.fn>;
    changeState: ReturnType<typeof vi.fn>;
    createItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    itemsService = {
      getItems: vi.fn(() => of([])),
      changeState: vi.fn(() => of(undefined)),
      createItem: vi.fn(() => of(undefined)),
    };

    TestBed.configureTestingModule({
      providers: [
        BoardFacade,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: {}, paramMap: { get: () => 'team-1' } } },
        },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: TeamsService, useValue: { getTeams: () => of([{ id: 'team-1', name: 'Team 1' }]) } },
        { provide: ItemsService, useValue: itemsService },
      ],
    });

    facade = TestBed.inject(BoardFacade);
  });

  it('groups sprint items by state and excludes To Do items', () => {
    facade.items.set([
      { id: '1', title: 'Backlog item', state: 'To Do' },
      { id: '2', title: 'Active item', state: 'In Progress' },
      { id: '3', title: 'Completed item', state: 'Done' },
      { id: '4', title: 'Another active item', state: 'In Progress' },
    ]);

    expect(facade.sprintColumns()).toEqual([
      {
        state: 'In Progress',
        items: [
          { id: '2', title: 'Active item', state: 'In Progress' },
          { id: '4', title: 'Another active item', state: 'In Progress' },
        ],
      },
      {
        state: 'Done',
        items: [{ id: '3', title: 'Completed item', state: 'Done' }],
      },
    ]);
  });

  it('reloads items after changing an item state', () => {
    facade.items.set([{ id: '1', title: 'Active item', state: 'In Progress' }]);

    facade.changeState('1', 'Done');

    expect(itemsService.changeState).toHaveBeenCalledWith('1', 'Done');
    expect(itemsService.getItems).toHaveBeenCalledTimes(2);
  });

  it('creates a To Do item for the selected team and reloads items', () => {
    facade.createItem({
      teamId: 'team-1',
      title: 'Prepare release',
      type: 'Task',
      state: 'To Do',
      estimation: 3,
    }).subscribe();

    expect(itemsService.createItem).toHaveBeenCalledWith({
      teamId: 'team-1',
      title: 'Prepare release',
      type: 'Task',
      state: 'To Do',
      estimation: 3,
    });
    expect(itemsService.getItems).toHaveBeenCalledTimes(2);
  });
});