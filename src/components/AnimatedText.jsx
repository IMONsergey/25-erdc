import { typographText } from "../typograph.js";

export function MaskedWords({ text }) {
  const words = typographText(String(text))
    .split(/[ \t\r\n]+/)
    .filter(Boolean);

  return words.map((word, index) => (
    <span className="mask-token" key={`${word}-${index}`}>
      <span className="mask-word" style={{ "--word-index": index }}>
        <span>{word}</span>
      </span>
      {index < words.length - 1 ? " " : null}
    </span>
  ));
}

export function Text({ children, as: Tag = "span", className = "" }) {
  return <Tag className={className}>{typeof children === "string" ? typographText(children) : children}</Tag>;
}

export function FadeText({ children, as: Tag = "span", className = "" }) {
  return (
    <Tag className={`fade-lines${className ? ` ${className}` : ""}`}>
      <span className="fade-line">{typeof children === "string" ? typographText(children) : children}</span>
    </Tag>
  );
}
