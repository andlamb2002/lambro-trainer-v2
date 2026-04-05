import { formatTime, formatRunningTime } from '../../lib/format'

import type { Phase } from '../../types/types';

type Props = {
    phase: Phase;
    time: number;
}

function TimerDisplay({ phase, time }: Props) {

    const colorClass: Record<Phase, string> = {
        idle: '',
        holdStart: 'text-success',
        running: '',
        holdStop: 'text-danger',
        cooldown: '',
    };


    return (
         <h1 className={`${colorClass[phase]} sm:h-96 text-6xl text-center py-12 sm:py-8 select-none`}>
            {phase === 'running' ? formatRunningTime(time) : formatTime(time)}
        </h1>
    )
}

export default TimerDisplay