import type { Session } from '../types/types'
import { getAlgSet } from '../data/algSets'
import { setInitialToggles } from './caseToggles'

export function createSession(label: string, setKey: string): Session {
    return {
        id: "session-" + Date.now(),
        label: label,
        setId: setKey,
        toggles: setInitialToggles(getAlgSet(setKey).cases),
        solves: []
    }
}

export function deleteSession(sessions: Session[], id: string): Session[] {
    return sessions.filter(session => session.id !== id);
}