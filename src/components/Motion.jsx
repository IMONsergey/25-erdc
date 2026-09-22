import { useEffect, useState } from "react";
export default function Motion() {
  const [current, setCurrent] = useState("city");
  useEffect(() => {
    const initialSection = document.getElementById(location.hash.slice(1));
    const initialFrame = initialSection
      ? requestAnimationFrame(() =>
          initialSection.scrollIntoView({ behavior: "instant" }),
        )
      : null;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            reveal.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      if (reduced) el.classList.add("is-visible");
      else reveal.observe(el);
    });
    const sections = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(e.target.id);
        }),
      { rootMargin: "-15% 0px -50% 0px" },
    );
    ["city", "regions", "mission", "projects"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) sections.observe(el);
    });
    return () => {
      if (initialFrame !== null) cancelAnimationFrame(initialFrame);
      reveal.disconnect();
      sections.disconnect();
    };
  }, []);
  return (
    <nav className="chapter-nav" aria-label="Разделы страницы">
      {[
        ["city", "Город"],
        ["regions", "Территории"],
        ["mission", "Миссия"],
        ["projects", "Проекты"],
      ].map(([id, label], i) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={current === id ? "location" : undefined}
        >
          <small>0{i + 1}</small>
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
