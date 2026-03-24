import { useState } from 'react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="announcement-bar">
      <span className="pulse-dot" />
      ⚡ Only 5 client spots available — <strong style={{ color: '#C6A84B' }}>&nbsp;2 spots remaining</strong>&nbsp; — Book yours before we close intake.
      <button className="close-btn" onClick={() => setVisible(false)} aria-label="Dismiss">✕</button>
    </div>
  );
}
