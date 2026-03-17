type Props = {
    currentScramble: string;
}

function Scramble({ currentScramble }: Props) {
  return (
    <>
        <div>{currentScramble}</div>
    </>
  )
}

export default Scramble