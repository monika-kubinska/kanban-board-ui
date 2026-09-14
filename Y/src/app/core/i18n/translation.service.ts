import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type Language = 'pl' | 'en';

type TranslationKey = keyof typeof translations.pl;

const translations = {
  pl: {
    account: 'Konto',
    addEstimation: 'Dodaj estymację',
    add: 'Dodaj',
    assignedUser: 'Przypisany użytkownik',
    boardLoading: 'Ładowanie tablicy...',
    backlog: 'Product backlog',
    backlogItems: 'Elementy backlogu',
    backlogEmpty: 'Backlog jest pusty.',
    cancel: 'Anuluj',
    createTeam: 'Utwórz zespół',
    creating: 'Tworzenie...',
    createItem: 'Utwórz element',
    createItemTitle: 'Nowy element',
    chooseType: 'Wybierz typ',
    chooseUser: 'Wybierz użytkownika',
    editEstimation: 'Edytuj estymację',
    estimation: 'Estymacja',
    formValid: 'Formularz jest poprawny',
    hours: 'Godziny',
    item: 'Element',
    language: 'Język',
    languageEnglish: 'English',
    languagePolish: 'Polski',
    loginStatus: 'Jesteś zalogowany',
    logoutStatus: 'Nie jesteś zalogowany',
    logout: 'Wyloguj',
    noAssignee: 'Nieprzypisany',
    points: 'Punkty',
    save: 'Zapisz',
    sessionActive: 'Masz aktywną sesję. Możesz korzystać z aplikacji.',
    state: 'Stan',
    teams: 'Zespoły',
    unit: 'Jednostka',
    myTeams: 'Moje zespoły',
    loadingTeams: 'Ładowanie zespołów...',
    noTeams: 'Nie należysz jeszcze do żadnego zespołu.',
    expand: 'Rozwiń',
    collapse: 'Zwiń',
    addUser: 'Dodaj użytkownika',
    adding: 'Dodawanie...',
    noMembers: 'Brak członków w tym zespole.',
    removing: 'Usuwanie...',
    remove: 'Usuń',
    profile: 'Profil użytkownika',
    role: 'Rola',
    teamsIntro: 'Zarządzaj zespołami, do których należysz.',
    teamIntro: 'Stwórz przestrzeń do współpracy nad projektem.',
    sprintBoard: 'Sprint board',
    team: 'Zespół',
    workView: 'Widok pracy',
    noSprintItems: 'Brak elementów na sprint boardzie.',
    user: 'Użytkownik',
    login: 'Zaloguj',
    register: 'Zarejestruj',
    email: 'E-mail',
    password: 'Hasło',
    registerPrompt: 'Nie masz konta? Zarejestruj się',
    registration: 'Rejestracja',
    loginSubmit: 'Zaloguj się',
    name: 'Imię',
  },
  en: {
    account: 'Account',
    addEstimation: 'Add estimate',
    add: 'Add',
    assignedUser: 'Assigned user',
    boardLoading: 'Loading board...',
    backlog: 'Product backlog',
    backlogItems: 'Backlog items',
    backlogEmpty: 'The backlog is empty.',
    cancel: 'Cancel',
    createTeam: 'Create team',
    creating: 'Creating...',
    createItem: 'Create item',
    createItemTitle: 'New item',
    chooseType: 'Choose a type',
    chooseUser: 'Choose a user',
    editEstimation: 'Edit estimate',
    estimation: 'Estimate',
    formValid: 'The form is valid',
    hours: 'Hours',
    item: 'Item',
    language: 'Language',
    languageEnglish: 'English',
    languagePolish: 'Polski',
    loginStatus: 'You are logged in',
    logoutStatus: 'You are not logged in',
    logout: 'Log out',
    noAssignee: 'Unassigned',
    points: 'Points',
    save: 'Save',
    sessionActive: 'You have an active session and can use the application.',
    state: 'State',
    teams: 'Teams',
    unit: 'Unit',
    myTeams: 'My teams',
    loadingTeams: 'Loading teams...',
    noTeams: 'You do not belong to any team yet.',
    expand: 'Expand',
    collapse: 'Collapse',
    addUser: 'Add user',
    adding: 'Adding...',
    noMembers: 'There are no members in this team.',
    removing: 'Removing...',
    remove: 'Remove',
    profile: 'User profile',
    role: 'Role',
    teamsIntro: 'Manage the teams you belong to.',
    teamIntro: 'Create a space for project collaboration.',
    sprintBoard: 'Sprint board',
    team: 'Team',
    workView: 'Work view',
    noSprintItems: 'There are no items on the sprint board.',
    user: 'User',
    login: 'Log in',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    registerPrompt: "Don't have an account? Register",
    registration: 'Registration',
    loginSubmit: 'Log in',
    name: 'Name',
  },
} as const;

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  readonly language = signal<Language>(this.readLanguage());

  constructor() {
    effect(() => {
      const language = this.language();
      this.document.documentElement.lang = language;
      if (isPlatformBrowser(this.platformId)) {
        const storage = globalThis.localStorage;
        if (typeof storage?.setItem === 'function') {
          storage.setItem('kanban-language', language);
        }
      }
    });
  }

  translate(key: TranslationKey): string {
    return translations[this.language()][key];
  }

  setLanguage(language: Language): void {
    this.language.set(language);
  }

  private readLanguage(): Language {
    if (!isPlatformBrowser(this.platformId)) {
      return 'pl';
    }

    const storage = globalThis.localStorage;
    return typeof storage?.getItem === 'function' && storage.getItem('kanban-language') === 'en' ? 'en' : 'pl';
  }
}