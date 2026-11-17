/**
 * Character Maker's icon: a twenty-sided die on a lime tile, its top face
 * in the lighter green, in fixed Light Matcha colours like every irmahs.dev
 * app icon, with a `text` rim so its edge shows on either header.
 */
export const Logo = ({ size = 40 }: { size?: number }) => (
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
    <path
      d="M20 8 L31 14.5 V25.5 L20 32 L9 25.5 V14.5 Z"
      fill="#fff3cf"
      stroke="#2f3b34"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M20 13 L26 23 H14 Z"
      fill="#afc584"
      stroke="#2f3b34"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M20 8 L20 13 M31 14.5 L26 23 M9 14.5 L14 23 M14 23 L20 32 M26 23 L20 32"
      stroke="#2f3b34"
      strokeWidth="1.2"
    />
  </svg>
);
