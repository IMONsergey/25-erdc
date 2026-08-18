export function MaskedWords({ text }) {
  return String(text)
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => (
      <span className="mask-word" style={{ "--word-index": index }} key={`${word}-${index}`}>
        <span>{word}</span>
      </span>
    ));
}

function splitLines(value) {
  const text = String(value).replace(/\s+/g, " ").trim();
  if (!text) return [];
  const words = text.split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > 38 && line) {
      lines.push(line);
      line = word;
      return;
    }
    line = next;
  });

  if (line) lines.push(line);
  return lines;
}

export function FadeText({ children, as: Tag = "span", className = "" }) {
  const lines = typeof children === "string" ? splitLines(children) : [children];

  return (
    <Tag className={`fade-lines${className ? ` ${className}` : ""}`}>
      {lines.map((line, index) => (
        <span className="fade-line" style={{ "--line-index": index }} key={typeof line === "string" ? `${line}-${index}` : index}>
          {line}
        </span>
      ))}
    </Tag>
  );
}
