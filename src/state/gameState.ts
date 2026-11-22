export type RouteHint = 'peace' | 'mixed' | 'violent';

export type GameState = {
  schemaVersion: 1;
  chapterId: 'opening';
  sceneId: string;
  playerName: string;
  prologueIndex: number;
  dormitorielResolve: number;
  recordRisk: number;
  routeHint: RouteHint;
  flags: {
    [key: string]: boolean;
  };
};

const STORAGE_KEY = 'underfail-save-v1';

export function createInitialState(): GameState {
  return {
    schemaVersion: 1,
    chapterId: 'opening',
    sceneId: 'title',
    playerName: '',
    prologueIndex: 0,
    dormitorielResolve: 0,
    recordRisk: 0,
    routeHint: 'peace',
    flags: {},
  };
}

export function loadGameState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (parsed.schemaVersion !== 1) return createInitialState();
    return { ...createInitialState(), ...parsed };
  } catch (error) {
    console.error('UNDERFAIL: 저장 데이터를 불러오지 못했습니다.', error);
    return createInitialState();
  }
}

export function saveGameState(state: GameState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('UNDERFAIL: 저장 데이터를 기록하지 못했습니다.', error);
    return false;
  }
}
