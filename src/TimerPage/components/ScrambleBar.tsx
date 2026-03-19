import { Link } from "react-router-dom";

import { MdArrowBack } from "react-icons/md";

type Props = {
    currentScramble: string;
    isActive: boolean;
    recapProgress: number;
    recapTotal: number;
    handleStartRecap: () => void;
    stopRecap: () => void;
}

function ScrambleBar({ currentScramble, isActive, recapProgress, recapTotal, handleStartRecap, stopRecap }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:mb-4 px-4">
            
            <div className="flex items-center gap-2">
                <Link
                    to="/cases"
                    className="btn btn-primary flex items-center gap-1 font-bold px-2 py-1 sm:px-4 sm:py-2"
                    title="Case Selection"
                    aria-label="Case Selection"
                >
                    <MdArrowBack size={24} />
                    Cases
                </Link>

                <div className="flex items-center gap-2 whitespace-nowrap">
                    <button
                        className="btn btn-primary font-bold px-2 py-1 sm:px-4 sm:py-2"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={isActive ? stopRecap : handleStartRecap}
                        title={isActive ? "End Recap" : "Recap Each Selected Case"}
                        aria-label={isActive ? "End Recap" : "Recap Each Selected Case"}
                    >
                        {isActive ? 'End' : 'Recap'}
                    </button>
                    {isActive && (
                        <span className="text-sm font-medium">
                            {recapProgress} / {recapTotal}
                        </span>
                    )}
                </div>
            </div>

            <p className="font-bold text-xl sm:text-2xl sm:pl-8">
                {currentScramble}
            </p>
        </div>
    );
}

export default ScrambleBar