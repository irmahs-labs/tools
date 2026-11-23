/**
 * The Tools icon: a cream wrench and a hammer crossed on a lime tile, the
 * hammer's handle in the lighter green and its head dark, in fixed Light
 * Matcha colours that don't change with the theme, as a favicon's can't.
 * Its `text` rim is dark on Light Matcha and cream on Dark Matcha, so the
 * tile's edge shows on either header. public/favicon.svg is the same
 * drawing.
 */
export const ToolsLogo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <rect
      x="3"
      y="3"
      width="34"
      height="34"
      rx="9"
      fill="#d4dd9c"
      stroke="var(--text)"
      strokeWidth="1.5"
    />
    <g
      transform="rotate(-45 20 20)"
      fill="#fff3cf"
      stroke="#2f3b34"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <rect x="18.25" y="14" width="3.5" height="19" rx="1.75" />
      <path d="M18 8 V4.84 A6 6 0 1 0 22 4.84 V8 Z" />
    </g>
    <g
      transform="rotate(45 20 20)"
      stroke="#2f3b34"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <rect x="18.5" y="13" width="3" height="20" rx="1.5" fill="#afc584" />
      <rect x="12.5" y="7" width="15" height="7" rx="1.5" fill="#2f3b34" />
    </g>
  </svg>
);
