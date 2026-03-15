import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'idle' | 'holdStart' | 'running' | 'holdStop' | 'cooldown';

const START_COOLDOWN_MS = 500;

export function useTimer(onStop: (time: number) => void, isDisabled: boolean) {
    
        const [phase, setPhase] = useState<Phase>('idle');
        const phaseRef = useRef<Phase>(phase);
    
        const [time, setTime] = useState<number>(0);
        const isRunning = phase === 'running';
    
        const intervalIdRef = useRef<number | null>(null);
        const startTimeRef = useRef<number>(0);
    
        const cooldownIdRef = useRef<number | null>(null);
    
        const setPhaseRef = useCallback((p: Phase) => {
            phaseRef.current = p;
            setPhase(p);
        }, []);
    
        useEffect(() => {
            if (isRunning) {
                intervalIdRef.current = window.setInterval(() => {
                    setTime(performance.now() - startTimeRef.current);
                }, 10);
            }
    
            return () => {
                if (intervalIdRef.current !== null) {
                    clearInterval(intervalIdRef.current);
                    intervalIdRef.current = null;
                }
            };
        }, [isRunning]);
    
        const start = useCallback(() => {
            startTimeRef.current = performance.now();
            setTime(0);
            setPhaseRef('running');
        }, [setPhaseRef]);
    
        const stop = useCallback(() => {
            const finalTime = performance.now() - startTimeRef.current;
            setTime(finalTime);
            setPhaseRef('holdStop');
            onStop(finalTime);
        }, [onStop, setPhaseRef]);
    
        const handleKeyDown = useCallback((e: KeyboardEvent) => {
            if (isDisabled) return;
            if (e.code === 'Space') e.preventDefault();
            if (e.repeat) return;
    
            const p = phaseRef.current;
    
            if (p === 'running') {
                stop();
            }
            else if (e.code === "Space" && p === 'idle') {
                setPhaseRef('holdStart');
            }
        }, [stop, setPhaseRef, isDisabled]);
    
        const handleKeyUp = useCallback((e: KeyboardEvent) => {
            if (isDisabled) return;
            if (e.code === 'Space') e.preventDefault();
    
            const p = phaseRef.current;
    
            if (p === 'holdStop') {
                setPhaseRef('cooldown');
    
                if(cooldownIdRef.current !== null) {
                    clearTimeout(cooldownIdRef.current);
                }
    
                cooldownIdRef.current = window.setTimeout(() => {
                    setPhaseRef('idle');
                    cooldownIdRef.current = null;
                }, START_COOLDOWN_MS);
    
            } else if (e.code === "Space" && p === 'holdStart') {
                start();
            }
        }, [start, setPhaseRef, isDisabled]);
    
        useEffect(() => {
            document.addEventListener("keydown", handleKeyDown, { passive: false });
            document.addEventListener("keyup", handleKeyUp, { passive: false });
    
            return () => {
                document.removeEventListener("keydown", handleKeyDown);
                document.removeEventListener("keyup", handleKeyUp);
            };
        }, [handleKeyDown, handleKeyUp]);

    return {
        time,
        // formattedTime: formatTime(time),
        // formattedRunningTime: formatRunningTime(time),
        phase,
    }
}