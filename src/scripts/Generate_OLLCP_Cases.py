from utils import load_json, save_json,invert_alg, get_auf_moves, generate_case, generate_scramble

DOUBLE_SYM_DROP = {
    1:  {2: 1, 6: 5},
    20: {4: 3, 5: 3, 6: 3},
    21: {4: 3, 6: 5},
    55: {4: 3, 6: 5},
    56: {4: 3, 6: 5},
    57: {4: 3, 6: 5},
}

def canonical_subset_for(oll_idx: int, subset: int) -> int:
    return DOUBLE_SYM_DROP.get(oll_idx, {}).get(subset, subset)

def subset_from_pll_and_auf(pll_item: dict, auf: str) -> int:
    pll_set = pll_item.get("set", "")
    if pll_set == "edges_only":
        return 1
    if pll_set == "diag_swap":
        return 2
    if pll_set == "adj_swap":
        auf_map = {"": 3, "U2": 4, "U": 5, "U'": 6}
        try:
            return auf_map[auf]
        except KeyError:
            raise ValueError(f"Unexpected AUF '{auf}' for adj_swap PLL '{pll_item.get('label')}'")
    raise ValueError(f"Unknown PLL set '{pll_set}' for PLL '{pll_item.get('label')}'")

def process_ollcp(oll_data: list[dict], pll_data: list[dict]):
    cases = []
    counter = 1

    for oll in oll_data:
        if oll["label"].lower() == "skip":
            continue

        inv_oll = invert_alg(oll["scramble"])
        buckets = {i: [] for i in range(1, 7)}
        drop_subsets = DOUBLE_SYM_DROP.get(counter, set())

        for pll in pll_data:
            auf_list = get_auf_moves(pll["label"])
            for auf in auf_list:
                raw_subset = subset_from_pll_and_auf(pll, auf)
                if raw_subset in drop_subsets:
                    continue

                subset = canonical_subset_for(counter, raw_subset)
                scramble = invert_alg(generate_scramble(pll, auf, inv_oll))
                buckets[subset].append(scramble)

        present_subsets = [s for s, v in buckets.items() if v]
        counts = {k: len(v) for k, v in buckets.items()}
        print(f"OLL {counter:02d} '{oll['label']}': subset counts {counts}")

        for subset in sorted(present_subsets):
            case_id = f"OLL{counter:02d}_{subset:02d}"
            label = case_id
            case = generate_case(
                case_id=case_id,
                label=label,
                scrambles=buckets[subset],
                original_alg=oll["scramble"],
                img_stage="coll",
                set_name=oll["set"],
                shape=oll["label"]
            )
            case["subset"] = subset
            cases.append(case)

        counter += 1

    return cases

def main():
    pll_data = load_json("pll.json")
    oll_data = load_json("oll.json")
    all_cases = process_ollcp(oll_data, pll_data)
    save_json(all_cases, "ollcp_cases.json")

if __name__ == "__main__":
    main()
