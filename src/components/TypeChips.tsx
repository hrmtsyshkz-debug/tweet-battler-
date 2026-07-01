"use client";

import { TYPES } from "@/lib/data";

export function TypeChips({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (key: string | null) => void;
}) {
  return (
    <div className="chips">
      {TYPES.map((t) => (
        <div
          key={t.key}
          className={"chip" + (selected === t.key ? " active" : "")}
          onClick={() => onSelect(selected === t.key ? null : t.key)}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}
