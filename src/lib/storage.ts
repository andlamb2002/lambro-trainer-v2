import type { SessionState, Session } from '../types/types'

import { createSession } from './sessions'

const STORAGE_KEY = "session_state";

export function saveSessionState(state: SessionState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// export function loadSessionState(): SessionState | null {
    
// }