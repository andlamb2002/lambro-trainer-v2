import type { SessionState } from '../types/types'

import { createSession } from './sessions'

const STORAGE_KEY = "session_state";

export function saveSessionState(state: SessionState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadSessionState(): SessionState {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
        const first = createSession("Session 1", "zbll");
        return { sessions: [first], activeSessionId: first.id };
    }

    return JSON.parse(json) as SessionState;
}