/**
 * Anime & Game Food's icon: a cream rice bowl with chopsticks across it,
 * on a lime tile, in fixed Light Matcha colours like every irmahs.dev app
 * icon, with a `text` rim so its edge shows on either header.
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
      d="M12 10 L29 19 M15 8.5 L30 17"
      stroke="#2f3b34"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M9 20 H31 A11 10 0 0 1 9 20 Z"
      fill="#fff3cf"
      stroke="#2f3b34"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M13 24.5 H27"
      stroke="#afc584"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 30 H24"
      stroke="#2f3b34"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
