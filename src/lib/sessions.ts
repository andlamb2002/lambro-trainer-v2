import type { Session, CaseToggles } from '../types/types'
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

export function updateSession(sessions: Session[], id: string, updater: (session: Session) => Session): Session[] {
    return sessions.map(session => session.id === id ? updater(session) : session)
}

export function updateSessionSet(sessions: Session[], id: string, newSetKey: string): Session[] {
    return sessions.map(session => {
        if (session.id === id) {
            const newToggles = setInitialToggles(getAlgSet(newSetKey).cases);
            return {
                ...session,
                setId: newSetKey,
                toggles: newToggles,
                solves: []
            }
        }
        return session;
    })
}

export function updateSessionToggles(sessions: Session[], id: string, newToggles: CaseToggles): Session[] {
    return sessions.map(session => {
        if (session.id === id) {
            return {
                ...session,
                toggles: newToggles
            }
        }
        return session;
    })
}

export function deleteSession(sessions: Session[], id: string): Session[] {
    return sessions.filter(session => session.id !== id);
}