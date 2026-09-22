import { useEffect } from "react";

export default function Motion() {
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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            reveal.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((element) => {
      if (reduced) element.classList.add("is-visible");
      else reveal.observe(element);
    });
    return () => {
      if (initialFrame !== null) cancelAnimationFrame(initialFrame);
      reveal.disconnect();
    };
  }, []);
  return null;
}
