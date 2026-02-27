import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'idle' | 'holdStart' | 'running' | 'holdStop';

function TempPage() {

    const [solves, setSolves] = useState<number[]>([]);

    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);

    const [phase, setPhase] = useState<Phase>('idle');
    const phaseRef = useRef<Phase>(phase);

    const intervalIdRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        if (isRunning) {
            intervalIdRef.current = setInterval(() => {
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

    function start(): void {
        setTime(0);
        setIsRunning(true);
        startTimeRef.current = performance.now();
    }

    function stop(): void {
        const finalTime = performance.now() - startTimeRef.current;
        setTime(finalTime);
        setIsRunning(false);
        setSolves(prev => [...prev, finalTime]);
    }

    function formatTime(ms: number): string {
        return (ms / 1000).toFixed(2);
    }

    function formatRunningTime(ms: number): string {
        return Math.floor(ms / 1000).toString();
    }

    useEffect(() => {
        phaseRef.current = phase;
    }, [phase]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (phaseRef.current === 'running') {
            setPhase('holdStop');
            stop();
        }
        else if (e.code === "Space") {
            if (phase === 'idle') {
                setPhase('holdStart');
            } 
        }
    }, [phase]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (e.code === "Space") {
            if (phase === 'holdStart') {
                setPhase('running');
                start();
            } else if (phase === 'holdStop') {
                setPhase('idle');
            }
        }
    }, [phase]);

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
                <button onClick={() => isRunning ? stop() : start()}>
                    {isRunning ? "Stop" : "Start"}
                </button>
                {isRunning ? 
                     <>{formatRunningTime(time)}</>
                    :
                    <>{formatTime(time)}</>
                }
                {phase}
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