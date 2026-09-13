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
    assignUser: ReturnType<typeof vi.fn>;
    updateItem: ReturnType<typeof vi.fn>;
    createItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    itemsService = {
      getItems: vi.fn(() => of([])),
      changeState: vi.fn(() => of(undefined)),
      assignUser: vi.fn(() => of(undefined)),
      updateItem: vi.fn(() => of({ id: '1', title: 'Item', state: 'Ready' })),
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

  it('filters the backlog to To Do items', () => {
    facade.items.set([
      { id: '1', title: 'Backlog item', state: 'To Do' },
      { id: '2', title: 'Ready item', state: 'Ready' },
      { id: '3', title: 'Review item', state: 'Code Review' },
    ]);

    expect(facade.backlogItems()).toEqual([
      { id: '1', title: 'Backlog item', state: 'To Do' },
    ]);
  });

  it('reloads items after changing an item state', () => {
    facade.items.set([{ id: '1', title: 'Active item', state: 'In Progress' }]);

    facade.changeState('1', 'Done');

    expect(itemsService.changeState).toHaveBeenCalledWith('1', 'Done');
    expect(itemsService.getItems).toHaveBeenCalledTimes(2);
  });

  it('requires estimation and unit before moving an item out of To Do', () => {
    facade.items.set([{ id: '1', title: 'Unestimated item', state: 'To Do' }]);
    facade.changeState('1', 'Ready');

    expect(itemsService.changeState).not.toHaveBeenCalled();
    expect(facade.error()).toBe('Przed opuszczeniem To Do dodaj estymację i jednostkę.');
  });

  it('requires an estimation unit even when an item has an estimation', () => {
    facade.items.set([{ id: '1', title: 'Item without unit', state: 'To Do', estimation: 5 }]);

    facade.changeState('1', 'In Progress');

    expect(itemsService.changeState).not.toHaveBeenCalled();
    expect(facade.error()).toBe('Przed opuszczeniem To Do dodaj estymację i jednostkę.');
  });

  it('allows leaving To Do when estimation and unit are present', () => {
    facade.items.set([{
      id: '1',
      title: 'Estimated item',
      state: 'To Do',
      estimation: 5,
      estimationUnit: 'points',
    }]);

    facade.changeState('1', 'Ready');

    expect(itemsService.changeState).toHaveBeenCalledWith('1', 'Ready');
  });

  it('assigns a user to an item and reloads items', () => {
    facade.items.set([{ id: '1', title: 'Item', state: 'Ready' }]);

    facade.assignUser('1', 'user-2');

    expect(itemsService.assignUser).toHaveBeenCalledWith('1', 'user-2');
    expect(facade.items()).toEqual([{ id: '1', title: 'Item', state: 'Ready', assigneeId: 'user-2' }]);
  });

  it('creates a To Do item for the selected team and reloads items', () => {
    facade.createItem({
      teamId: 'team-1',
      title: 'Prepare release',
      type: 'Story',
      state: 'To Do',
      estimation: 3,
    }).subscribe();

    expect(itemsService.createItem).toHaveBeenCalledWith({
      teamId: 'team-1',
      title: 'Prepare release',
      type: 'Story',
      state: 'To Do',
      estimation: 3,
    });
    expect(itemsService.getItems).toHaveBeenCalledTimes(2);
  });

  it('includes the selected team when updating an item estimate', () => {
    facade.items.set([{ id: '1', title: 'Item', state: 'Ready' }]);

    facade.updateItem('1', { estimation: 5, estimationUnit: 'hours' });

    expect(itemsService.updateItem).toHaveBeenCalledWith('1', {
      team: 'team-1',
      title: 'Item',
      state: 'Ready',
      estimation: 5,
      estimationUnit: 'hours',
    });
  });
});