import { useEffect, useRef, useState } from 'react';

function TempPage() {

    const [solves, setSolves] = useState<number[]>([]);

    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);

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