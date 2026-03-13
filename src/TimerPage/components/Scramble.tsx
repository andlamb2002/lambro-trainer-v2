import type { Case } from '../../types/types'

type Props = {
    currentCase: Case | null;
    currentScramble: string;
}

function Scramble({ currentCase, currentScramble }: Props) {
  return (
    <>
        <div>{currentCase ? currentCase.label : ""}</div>
        <div>{currentScramble}</div>
    </>
  )
}

export default Scramble