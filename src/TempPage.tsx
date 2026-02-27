import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'idle' | 'holdStart' | 'running' | 'holdStop';

function TempPage() {

    const [solves, setSolves] = useState<number[]>([]);

    const [phase, setPhase] = useState<Phase>('idle');
    const phaseRef = useRef<Phase>(phase);

    const [time, setTime] = useState<number>(0);
    const isRunning = phase === 'running';

    const intervalIdRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

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
        setSolves(prev => [...prev, finalTime]);
    }, [setPhaseRef]);

    function formatTime(ms: number): string {
        return (ms / 1000).toFixed(2);
    }

    function formatRunningTime(ms: number): string {
        return Math.floor(ms / 1000).toString();
    }

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Space') e.preventDefault();
        if (e.repeat) return;

        const p = phaseRef.current;

        if (p === 'running') {
            stop();
        }
        else if (e.code === "Space" && p === 'idle') {
            setPhaseRef('holdStart');
        }
    }, [stop, setPhaseRef]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Space') e.preventDefault();

        const p = phaseRef.current;

        if (p === 'holdStop') {
            setPhaseRef('idle');
        } else if (e.code === "Space" && p === 'holdStart') {
            start();
        }
    }, [start, setPhaseRef]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    return (
        <>
            <div>
                {phase}
                {isRunning ? 
                     <>{formatRunningTime(time)}</>
                    :
                    <>{formatTime(time)}</>
                }
            </div>
            <ul>
                {solves.map((s, i) => (
                    <li key={i}>{formatTime(s)}</li>
                ))}
            </ul>
           
        </>
    )
}

export default TempPage