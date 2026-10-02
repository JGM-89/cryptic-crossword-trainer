// The Daily's hint menu: pick any help in any order; each pick costs 1.

export type HintKind = 'definition' | 'device' | 'wordplay' | 'letter';

export interface HintMenuItem {
  kind: HintKind;
  label: string;
  disabled: boolean;
}

interface Props {
  items: HintMenuItem[];
  onPick: (kind: HintKind) => void;
  onClose: () => void;
}

export function HintMenu({ items, onPick, onClose }: Props) {
  return (
    <div
      className="hint-menu"
      role="group"
      aria-label="Choose a hint"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <p className="hint-menu-title">Each hint costs 1</p>
      <ul>
        {items.map((item) => (
          <li key={item.kind}>
            <button
              type="button"
              className="hint-menu-item"
              disabled={item.disabled}
              onClick={() => onPick(item.kind)}
            >
              <span>{item.label}</span>
              <span className="hint-menu-cost" aria-hidden>
                +1
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
