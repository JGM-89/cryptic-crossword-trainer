import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';

export interface CompleteAction {
  label: string;
  to: string;
  primary?: boolean;
}

interface Props {
  open: boolean;
  title: string;
  subtitle: string;
  actions: CompleteAction[];
  onClose: () => void;
}

const PALETTE = [
  'var(--accent)',
  'var(--def-hi)',
  'var(--good)',
  'var(--stage-A)',
  'var(--stage-B)',
  'var(--stage-C)',
];

/** A handful of confetti pieces with varied colour / position / timing. Purely
 *  decorative (aria-hidden); hidden entirely under prefers-reduced-motion. */
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        duration: 1.1 + Math.random() * 0.9,
        color: PALETTE[i % PALETTE.length],
        drift: Math.round((Math.random() * 2 - 1) * 60),
        wide: i % 3 === 0,
      })),
    [],
  );
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className={`confetti-piece ${p.wide ? 'wide' : ''}`}
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ['--drift' as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/** Celebratory overlay shown the moment a puzzle is solved. Fixed & centered so
 *  it's seen regardless of scroll position; dismissable (Esc / backdrop / X). */
export function PuzzleComplete({ open, title, subtitle, actions, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    cardRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <Confetti />
      <div
        ref={cardRef}
        className="modal-card pc-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pc-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="pc-dismiss" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <span className="pc-mark" aria-hidden>
          ✓
        </span>
        <h2 id="pc-title">{title}</h2>
        <p>{subtitle}</p>
        <div className="pc-actions">
          {actions.map((a) => (
            <Link
              key={a.to + a.label}
              to={a.to}
              className={`btn ${a.primary ? 'btn-primary' : 'btn-ghost'}`}
              onClick={onClose}
            >
              {a.label}
            </Link>
          ))}
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Review this grid
          </button>
        </div>
      </div>
    </div>
  );
}
