import { useEffect, useState } from "react";
import { asset } from "../data.js";

export default function PagePreloader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("motion-armed");
    const startedAt = window.performance.now();
    let removeTimer;
    const disarmTimer = window.setTimeout(() => {
      document.documentElement.classList.remove("motion-armed");
    }, 1300);

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
      window.clearTimeout(disarmTimer);
      document.documentElement.classList.remove("motion-armed");
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`page-preloader${leaving ? " is-leaving" : ""}`} role="status" aria-live="polite">
      <img className="page-preloader-mark" src={asset("preloader-vector.svg")} alt="" aria-hidden="true" />
      <div className="page-preloader-bar" aria-hidden="true"><span /></div>
      <span className="visually-hidden">Загрузка страницы</span>
    </div>
  );
}
