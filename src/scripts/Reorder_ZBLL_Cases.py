import re
from utils import load_json, save_json

PARENT_DISPLAY_ORDER: dict[str, list[int]] = {
    "H":  [3, 4, 2, 1],
    "Pi": [4, 3, 5, 6, 2, 1],
    "U":  [2, 1, 3, 4, 6, 5],
    "T":  [2, 1, 6, 5, 4, 3],
    "L":  [3, 4, 1, 2, 6, 5],
    "AS": [4, 3, 5, 6, 2, 1],
    "S":  [5, 6, 3, 4, 2, 1],
}

SUBSET_DISPLAY_ORDER: dict[str, list[int]] = {
    "H01": [2, 6, 4, 1, 8, 3, 7, 5],
    "H02": [2, 3, 4, 8, 6, 7, 1, 5],
    "H03": [4, 12, 1, 11, 7, 10, 6, 9, 3, 5, 2, 8],
    "H04": [6, 3, 1, 10, 4, 8, 5, 11, 12, 7, 2, 9],

    "Pi01": [1, 5, 4, 12, 7, 2, 3, 10, 11, 8, 6, 9],
    "Pi02": [2, 8, 11, 3, 5, 10, 12, 7, 9, 4, 6, 1],
    "Pi03": [12, 7, 9, 2, 8, 4, 5, 11, 10, 1, 6, 3],
    "Pi04": [12, 6, 10, 2, 11, 5, 4, 8, 9, 1, 7, 3],
    "Pi05": [3, 5, 8, 2, 10, 7, 6, 9, 11, 1, 4, 12],
    "Pi06": [3, 4, 11, 2, 9, 6, 7, 10, 8, 1, 5, 12],

    "U01": [12, 11, 9, 10, 1, 2, 3, 4, 8, 7, 6, 5],
    "U02": [9, 7, 5, 11, 4, 3, 1, 2, 12, 6, 10, 8],
    "U03": [10, 11, 8, 9, 1, 2, 3, 12, 5, 6, 4, 7],
    "U04": [6, 4, 5, 7, 2, 1, 12, 3, 8, 10, 11, 9],
    "U05": [8, 6, 5, 9, 10, 4, 11, 7, 12, 3, 1, 2],
    "U06": [8, 10, 9, 11, 1, 2, 12, 3, 7, 5, 6, 4],

    "T01": [11, 10, 12, 9, 1, 2, 4, 3, 7, 6, 5, 8],
    "T02": [12, 6, 8, 10, 3, 4, 1, 2, 11, 5, 9, 7],
    "T03": [8, 6, 5, 9, 10, 4, 11, 7, 12, 3, 1, 2],
    "T04": [8, 10, 9, 11, 1, 2, 12, 3, 7, 5, 6, 4],
    "T05": [6, 4, 5, 7, 2, 1, 12, 3, 8, 10, 11, 9],
    "T06": [10, 11, 8, 9, 1, 2, 3, 12, 5, 6, 4, 7],

    "L01": [11, 10, 12, 9, 1, 2, 4, 3, 7, 6, 5, 8],
    "L02": [7, 11, 9, 5, 4, 3, 2, 1, 6, 10, 8, 12],
    "L03": [11, 9, 10, 8, 1, 2, 12, 3, 6, 4, 7, 5],
    "L04": [4, 7, 6, 5, 2, 1, 3, 12, 10, 11, 9, 8],
    "L05": [10, 4, 6, 8, 11, 7, 9, 5, 3, 12, 1, 2],
    "L06": [7, 5, 4, 6, 2, 1, 12, 3, 11, 9, 8, 10],

    "AS01": [2, 10, 3, 7, 12, 1, 4, 5, 6, 9, 11, 8],
    "AS02": [1, 11, 8, 4, 12, 7, 5, 10, 6, 3, 9, 2],
    "AS03": [3, 9, 7, 1, 5, 11, 8, 4, 6, 2, 10, 12],
    "AS04": [3, 10, 6, 1, 4, 8, 11, 5, 7, 2, 9, 12],
    "AS05": [12, 8, 5, 1, 6, 9, 10, 7, 4, 2, 11, 3],
    "AS06": [12, 11, 4, 1, 7, 10, 9, 6, 5, 2, 8, 3],

    "S01": [4, 11, 2, 8, 9, 3, 1, 6, 12, 5, 7, 10],
    "S02": [4, 12, 5, 2, 6, 11, 9, 8, 7, 1, 10, 3],
    "S03": [2, 11, 4, 3, 9, 6, 7, 10, 5, 12, 8, 1],
    "S04": [2, 8, 5, 3, 10, 7, 6, 9, 4, 12, 11, 1],
    "S05": [2, 9, 7, 12, 8, 4, 5, 11, 6, 3, 10, 1],
    "S06": [2, 9, 6, 12, 11, 5, 4, 8, 7, 3, 9, 1],
}

LABEL_RX = re.compile(r"^(?:ZBLL)?(H|Pi|U|T|L|AS|S)(\d{2})_(\d{2})$")

SET_PRINT_ORDER = ["H", "Pi", "U", "T", "L", "AS", "S"]

def reorder_zbll_cases(
    all_cases: list[dict],
    parent_order: dict[str, list[int]],
    subset_order: dict[str, list[int]],
    set_print_order: list[str] | None = None
) -> list[dict]:
    by_set_parent: dict[str, dict[int, list[dict]]] = {}

    for c in all_cases:
        m = LABEL_RX.match(c["label"])
        if not m:
            raise ValueError(f"Unexpected label format: {c['label']}")
        set_name = m.group(1)
        p_canon = int(m.group(2))
        s_canon = int(m.group(3))
        c["_set"] = set_name
        c["_pCanon"] = p_canon
        c["_sCanon"] = s_canon
        by_set_parent.setdefault(set_name, {}).setdefault(p_canon, []).append(c)

    if set_print_order is None:
        set_keys = sorted(by_set_parent.keys())
    else:
        set_keys = sorted(by_set_parent.keys(),
                          key=lambda k: set_print_order.index(k) if k in set_print_order else 999)

    out: list[dict] = []

    for set_name in set_keys:
        parents = by_set_parent[set_name]
        canon_parents_present = sorted(parents.keys())

        custom_p = parent_order.get(set_name, [])
        ordered_parents = [p for p in custom_p if p in parents] + \
                          [p for p in canon_parents_present if p not in custom_p]

        for disp_parent_idx, canon_parent in enumerate(ordered_parents, start=1):
            group = parents[canon_parent]
            s_canons_present = sorted({c["_sCanon"] for c in group})
            base_code = f"{set_name}{disp_parent_idx:02d}"
            canon_key = f"{set_name}{canon_parent:02d}"
            
            disp_key  = base_code
            custom_s  = subset_order.get(canon_key) or subset_order.get(disp_key, [])
            ordered_s_canons = [s for s in custom_s if s in s_canons_present] + \
                               [s for s in s_canons_present if s not in custom_s]
            s_map = {old: i for i, old in enumerate(ordered_s_canons, start=1)}

            group_sorted = sorted(group, key=lambda c: (s_map.get(c["_sCanon"], 999), c["_sCanon"]))

            for c in group_sorted:
                new_subset = s_map[c["_sCanon"]]
                c["id"] = f"ZBLL{base_code}_{new_subset:02d}"
                c["label"] = f"{base_code}_{new_subset:02d}"
                c["subset"] = new_subset
                out.append(c)

    for c in out:
        c.pop("_set", None)
        c.pop("_pCanon", None)
        c.pop("_sCanon", None)

    return out

def main():
    infile = "zbll_cases.json"
    outfile = "zbll_reordered_cases.json"
    cases = load_json(infile)
    cases = reorder_zbll_cases(
        cases,
        parent_order=PARENT_DISPLAY_ORDER,
        subset_order=SUBSET_DISPLAY_ORDER,
        set_print_order=SET_PRINT_ORDER,
    )
    save_json(cases, outfile)
    print(f"Reordered {len(cases)} ZBLL cases -> {outfile}")

if __name__ == "__main__":
    main()