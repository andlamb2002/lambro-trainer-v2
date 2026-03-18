from utils import load_json, save_json, invert_alg, generate_case, generate_auf_variations, choose_unique_solutions, solve_then_invert_to_scramble

SKIP_SUBSETS = {
    ("H", 1): {3, 4, 9, 11},
    ("H", 2): {3, 4, 10, 12},
}

def build_bases_from_oll_cross(oll_data: list[dict]) -> list[dict]:
    cross_olls = [o for o in oll_data if o.get('set') == 'cross' and o.get('label', '').lower() != 'skip']
    if len(cross_olls) < 7:
        raise ValueError(f"Expected 7 OLL 'cross' entries, found {len(cross_olls)}.")
    set_order = ["H", "Pi", "U", "T", "L", "AS", "S"]
    cross_sorted = sorted(cross_olls, key=lambda x: x.get('label', ''))
    bases = []
    for i, set_name in enumerate(set_order):
        item = cross_sorted[i]
        bases.append({"set": set_name, "alg": item["scramble"]})
    return bases

ADJ_PLL_ORDER = ["Aa", "Ab", "F", "Ga", "Gb", "Gc", "Gd", "Ja", "Jb", "Ra", "Rb", "T"]
AUF_ORDER_FOUR = ["", "U", "U2", "U'"] 

def subset_index_case1(label: str, auf: str) -> int:
    if label == "skip": return 1
    if label == "H":    return 2
    if label == "Z":    return 3 if auf == "" else 4
    if label == "Ua":   return 5 + AUF_ORDER_FOUR.index(auf)
    if label == "Ub":   return 9 + AUF_ORDER_FOUR.index(auf)
    raise ValueError(f"Case1 unexpected PLL '{label}'/AUF '{auf}'")

def subset_index_case2(label: str, auf: str) -> int:
    if label == "Na": return 1
    if label == "Nb": return 2
    if label == "E":  return 3 if auf == "" else 4
    if label == "V":  return 5 + AUF_ORDER_FOUR.index(auf)
    if label == "Y":  return 9 + AUF_ORDER_FOUR.index(auf)
    raise ValueError(f"Case2 unexpected PLL '{label}'/AUF '{auf}'")

def fixed_auf_for_parent_idx(parent_idx: int) -> str:
    if parent_idx == 3: return ""
    if parent_idx == 4: return "U2"
    if parent_idx == 5: return "U"
    if parent_idx == 6: return "U'"
    raise ValueError(f"Unexpected parent_idx '{parent_idx}' for fixed AUF")

def process_zbll(oll_data: list[dict], pll_data: list[dict]):
    by_label = {p['label']: p for p in pll_data}
    required = {"H", "Z", "Ua", "Ub", "Na", "Nb", "E", "V", "Y"} | set(ADJ_PLL_ORDER)
    missing = [lab for lab in required if lab not in by_label]
    if missing:
        raise ValueError(f"Missing PLL(s) in pll.json: {missing}")

    bases = build_bases_from_oll_cross(oll_data)
    cases = []

    for base in bases:
        set_name = base['set']
        base_alg = base['alg']
        base_inv = invert_alg(base_alg)

        parent_plan = [(1, 1), (2, 2), (4, 3), (5, 4)] if set_name == "H" else [(i, i) for i in range(1, 7)]

        for raw_idx, canon_idx in parent_plan:
            base_code = f"{set_name}{canon_idx:02d}"
            buckets = {i: [] for i in range(1, 13)}

            if raw_idx == 1:
                plan = [
                    ("skip", [""]), 
                    ("H",    [""]),
                    ("Z",    ["", "U"]),
                    ("Ua",   AUF_ORDER_FOUR),
                    ("Ub",   AUF_ORDER_FOUR),
                ]
                for lab, aufs in plan:
                    pll = by_label.get(lab, {"label": "skip", "scramble": ""}) if lab == "skip" else by_label[lab]
                    for auf in aufs:
                        subset = subset_index_case1(lab, auf)
                        core = ' '.join(x for x in [pll["scramble"], auf, base_inv] if x)
                        for var in generate_auf_variations(core):
                            scramble = solve_then_invert_to_scramble(var)
                            buckets[subset].append(scramble)

            elif raw_idx == 2:
                plan = [
                    ("Na", [""]),
                    ("Nb", [""]),
                    ("E",  ["", "U"]),
                    ("V",  AUF_ORDER_FOUR),
                    ("Y",  AUF_ORDER_FOUR),
                ]
                for lab, aufs in plan:
                    pll = by_label[lab]
                    for auf in aufs:
                        subset = subset_index_case2(lab, auf)
                        core = ' '.join(x for x in [pll["scramble"], auf, base_inv] if x)
                        for var in generate_auf_variations(core):
                            scramble = solve_then_invert_to_scramble(var)
                            buckets[subset].append(scramble)

            else:
                fixed_auf = fixed_auf_for_parent_idx(raw_idx)
                for i, lab in enumerate(ADJ_PLL_ORDER):
                    subset = i + 1
                    pll = by_label[lab]
                    core = ' '.join(x for x in [pll["scramble"], fixed_auf, base_inv] if x)
                    for var in generate_auf_variations(core):
                        scramble = solve_then_invert_to_scramble(var)
                        buckets[subset].append(scramble)

            skip_set = SKIP_SUBSETS.get((set_name, raw_idx), set())
            kept_subsets = [s for s in range(1, 13) if s not in skip_set]
            subset_map = {old: new for new, old in enumerate(kept_subsets, start=1)}

            for old_subset in kept_subsets:
                scrambles = choose_unique_solutions(buckets[old_subset], max_solutions=4)
                new_subset = subset_map[old_subset]
                case_id = f"ZBLL{base_code}_{new_subset:02d}"
                label   = f"{base_code}_{new_subset:02d}"
                case = generate_case(
                    case_id=case_id,
                    label=label,
                    scrambles=scrambles,
                    original_alg=base_alg,
                    img_stage="ll",
                    set_name=set_name
                )
                case["subset"] = new_subset
                cases.append(case)

            print(f"{set_name} {base_code}: {len(kept_subsets)} subsets × 4 scrambles")

    return cases

def main():
    pll_data = load_json("pll.json")
    oll_data = load_json("oll.json")
    all_cases = process_zbll(oll_data, pll_data)
    save_json(all_cases, "zbll_cases.json")
    print(f"Total cases: {len(all_cases)}")

if __name__ == "__main__":
    main()
