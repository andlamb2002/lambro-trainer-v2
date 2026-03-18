import json
import pycuber as pc
from pathlib import Path
import kociemba

DATA_DIR = Path(__file__).parent.parent / "data"

COLOR_MAP = {
    "white": "U", "red": "R", "green": "F",
    "yellow": "D", "orange": "L", "blue": "B"
}

Z2_MAP = {'U': 'D', 'D': 'U', 'R': 'L', 'L': 'R', 'F': 'F', 'B': 'B'}

U_MOVES = {'U', "U'", 'U2'}

def load_json(filename: str):
    with open(DATA_DIR / filename, "r") as f:
        return json.load(f)

def save_json(data, filename: str):
    with open(DATA_DIR / filename, "w") as f:
        json.dump(data, f, indent=2)

def invert_alg(alg: str) -> str:
    moves = alg.split()
    inverted = []
    for move in reversed(moves):
        if move.endswith("'"):
            inverted.append(move[:-1])
        elif move.endswith("2"):
            inverted.append(move)
        else:
            inverted.append(move + "'")
    return " ".join(inverted)

def rotate_move_z2(move: str) -> str:
    face = move[0]
    modifier = move[1:] if len(move) > 1 else ''
    return Z2_MAP[face] + modifier

def apply_z2_to_moves(moves_str: str) -> str:
    return ' '.join(rotate_move_z2(m) for m in moves_str.split())

def get_auf_moves(pll_label):
    if pll_label in {"skip", "H", "Na", "Nb"}:
        return [""]
    elif pll_label in {"E", "Z"}:
        return ["", "U"]
    else:
        return ["", "U", "U'", "U2"]

def cube_to_kociemba_string(cube: pc.Cube) -> str:
    face_order = ['U', 'R', 'F', 'D', 'L', 'B']
    s = ''
    for face in face_order:
        for row in range(3):
            for col in range(3):
                square = cube.get_face(face)[row][col]
                s += COLOR_MAP[square.colour.lower()]
    return s

def generate_case(case_id: str, label: str, scrambles: list[str],
                  original_alg: str, img_stage: str = None, set_name: str = None, shape: str = None):
    case = {
        "id": case_id,
        "set": set_name,
        "label": label,
        "originalAlg": original_alg,
        "scrambles": scrambles,
        "img": f"https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&bg=t&case={original_alg.replace(' ','')}",
    }
    if shape:
        case["shape"] = shape
    if img_stage == "oll":
        case["img"] = f"https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage={img_stage}&bg=t&case={original_alg.replace(' ','')}"
    elif img_stage:
        case["img"] = f"https://visualcube.api.cubing.net/visualcube.php?fmt=svg&view=plan&stage={img_stage}&bg=t&alg={scrambles[0].replace(' ','')}"
    return case

def generate_scramble(pll, auf, inv_oll):
    cube = pc.Cube()
    combo = ' '.join(x for x in [pll["scramble"], auf, inv_oll] if x)
    if combo.strip():
        cube(combo)
    cube("z2") 
    state_str = cube_to_kociemba_string(cube)
    solution = kociemba.solve(state_str)
    return apply_z2_to_moves(solution)

def _move_to_int(move: str) -> int | None:
    if move == 'U': return 1
    if move == 'U2': return 2
    if move == "U'": return 3
    return None

def _int_to_move(i: int) -> str:
    if i == 1: return 'U'
    if i == 2: return 'U2'
    if i == 3: return "U'"
    return ''

def merge_adjacent_u_moves(moves_list: list[str]) -> list[str]:
    result = []
    i = 0
    while i < len(moves_list):
        move = moves_list[i]
        if move and move[0] == 'U':
            total = _move_to_int(move) or 0
            i += 1
            while i < len(moves_list) and moves_list[i] and moves_list[i][0] == 'U':
                val = _move_to_int(moves_list[i])
                if val is not None:
                    total = (total + val) % 4
                i += 1
            if total != 0:
                result.append(_int_to_move(total))
        else:
            result.append(move)
            i += 1
    return result

def generate_auf_variations(sequence_str: str) -> list[str]:
    auf_moves = ['', 'U', "U'", 'U2']
    variations = []
    for prefix in auf_moves:
        for suffix in auf_moves:
            parts = []
            if prefix:
                parts.append(prefix)
            parts.append(sequence_str)
            if suffix:
                parts.append(suffix)
            merged = merge_adjacent_u_moves(' '.join(parts).split())
            variations.append(' '.join(merged))
    return variations

def choose_unique_solutions(solutions: list[str], max_solutions: int = 4) -> list[str]:
    chosen: list[str] = []
    used_first: set[str] = set()
    for sol in solutions:
        moves = sol.split()
        if not moves:
            continue
        first = moves[0]
        if first not in used_first:
            chosen.append(sol)
            used_first.add(first)
        if len(chosen) == max_solutions:
            break
    if len(chosen) < max_solutions:
        for sol in solutions:
            if sol not in chosen:
                chosen.append(sol)
            if len(chosen) == max_solutions:
                break
    return chosen

def remove_duplicate_solutions(solutions: list[str]) -> list[str]:
    seen: set[str] = set()
    unique: list[str] = []
    for sol in solutions:
        moves = sol.split()
        if not moves:
            continue
        if moves[-1] in U_MOVES:
            key = ' '.join(moves[:-1])
        else:
            key = sol
        if key not in seen:
            unique.append(sol)
            seen.add(key)
    return unique

def kociemba_solve_from_sequence(seq: str) -> str:
    cube = pc.Cube()
    if seq.strip():
        cube(seq)
    cube("z2")
    state = cube_to_kociemba_string(cube)
    solution = kociemba.solve(state)
    return apply_z2_to_moves(solution)

def solve_then_invert_to_scramble(seq: str) -> str:
    return invert_alg(kociemba_solve_from_sequence(seq))

def scrambles_from_base_sequence(base_scramble: str, max_solutions: int = 4) -> list[str]:
    solutions: list[str] = []
    for var in generate_auf_variations(base_scramble):
        sol = kociemba_solve_from_sequence(var)
        solutions.append(sol)
    return remove_duplicate_solutions(solutions)