import { formatTime, formatRunningTime } from '../../lib/format'

import type { Phase } from '../../types/types';

type Props = {
    phase: Phase;
    time: number;
    hudHidden: boolean;
    onTouchStart: () => void;
    onTouchEnd: () => void;
}

function TimerDisplay({ phase, time, hudHidden, onTouchStart, onTouchEnd }: Props) {

    const colorClass: Record<Phase, string> = {
        idle: '',
        holdStart: 'text-success',
        running: '',
        holdStop: 'text-danger',
        cooldown: '',
    };

    return (
         <h1 
            className={`${colorClass[phase]} ${hudHidden ? 'h-96 bg-secondary sm:bg-primary' : ''} sm:h-96 text-6xl text-center py-12 sm:py-8 select-none`}            
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: 'manipulation' }}
        >
            {phase === 'running' ? formatRunningTime(time) : formatTime(time)}
        </h1>
    )
}

export default TimerDisplay