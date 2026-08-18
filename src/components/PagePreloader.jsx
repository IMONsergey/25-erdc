import { useEffect, useState } from "react";

export default function PagePreloader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const startedAt = window.performance.now();
    let removeTimer;

    const finish = () => {
      const elapsed = window.performance.now() - startedAt;
      const wait = Math.max(520 - elapsed, 0);
      window.setTimeout(() => {
        setLeaving(true);
        removeTimer = window.setTimeout(() => setVisible(false), 420);
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`page-preloader${leaving ? " is-leaving" : ""}`} role="status" aria-live="polite">
      <div className="page-preloader-mark" aria-hidden="true">25</div>
      <div className="page-preloader-bar" aria-hidden="true"><span /></div>
      <span className="visually-hidden">Загрузка страницы</span>
    </div>
  );
}
