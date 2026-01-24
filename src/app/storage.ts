const LOCAL_STORAGE_KEY = 'unedStudio';

type QuizStatus = { [key: number]: 'correct' | 'fail' | 'pending' };
interface AreaState {
  currentQuestion: number;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  quizStatus: QuizStatus;
  selectedSections: string[];
  selectedQuestions: number[];
}
interface AppState {
  currentArea?: string;
  areas: {
    [areaKey: string]: Partial<AreaState>;
  };
}

export const storage = {
  getCurrentArea(): string | undefined {
    return getStoredState().currentArea;
  },

  setCurrentArea(areaKey: string | undefined) {
    const state = getStoredState();
    setStoredState({ ...state, currentArea: areaKey });
  },
};

function getStoredState(): AppState {
  if (typeof window === 'undefined') {
    return { areas: {} };
  }
  try {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (e) {
    console.error('Failed to parse state from localStorage', e);
  }
  return { areas: {} };
}

function setStoredState(state: AppState) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}

function getAreaState(areaKey: string): Partial<AreaState> {
  const state = getStoredState();
  return state.areas[areaKey] || {};
}

function updateAreaState(areaKey: string, newAreaState: Partial<AreaState>) {
  const state = getStoredState();
  const updatedState = {
    ...state,
    areas: {
      ...state.areas,
      [areaKey]: {
        ...(state.areas[areaKey] || {}),
        ...newAreaState,
      },
    },
  };
  setStoredState(updatedState);
}

function clearState() {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

function clearAreaState(areaKey: string) {
  const state = getStoredState();
  if (state.areas[areaKey]) {
    delete state.areas[areaKey];
    setStoredState(state);
  }
}
