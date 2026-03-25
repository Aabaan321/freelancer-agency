import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const { t } = useTranslation();
  if (!visible) return null;

  return (
    <div className="announcement-bar">
      <span className="pulse-dot" />
      ⚡ {t('announcement.text')} <strong style={{ color: '#C6A84B' }}>&nbsp;{t('announcement.highlight')}</strong>&nbsp; {t('announcement.suffix')}
      <button className="close-btn" onClick={() => setVisible(false)} aria-label="Dismiss">✕</button>
    </div>
  );
}
