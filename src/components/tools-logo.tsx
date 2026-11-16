/**
 * The Tools icon: a lime toolbox with a dark lid, its handle on top and a
 * yellow latch, in fixed Light Matcha colours that don't change with the
 * theme, as a favicon's can't. Its `text` rim is dark on Light Matcha and
 * cream on Dark Matcha, so the box's edge shows on either header.
 * public/favicon.svg is the same drawing.
 */
export const ToolsLogo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <path
      d="M14 13 V9.5 A2.5 2.5 0 0 1 16.5 7 H23.5 A2.5 2.5 0 0 1 26 9.5 V13"
      fill="none"
      stroke="#2f3b34"
      strokeWidth="2.5"
    />
    <rect
      x="4"
      y="13"
      width="32"
      height="21"
      rx="4"
      fill="#dde87e"
      stroke="var(--text)"
      strokeWidth="1.5"
    />
    <path
      d="M4.75 17 A3.25 3.25 0 0 1 8 13.75 H32 A3.25 3.25 0 0 1 35.25 17 V21 H4.75 Z"
      fill="#2f3b34"
    />
    <rect
      x="16.5"
      y="18"
      width="7"
      height="6.5"
      rx="1.5"
      fill="#ffd968"
      stroke="#2f3b34"
      strokeWidth="1.5"
    />
  </svg>
);
