const SERVICE_WORDS = [
  "а", "без", "бы", "в", "во", "где", "да", "для", "до", "же", "за", "и", "из", "изо",
  "или", "если", "к", "как", "когда", "ко", "ли", "либо", "между", "на", "над", "не", "ни",
  "но", "о", "об", "обо", "от", "ото", "по", "под", "при", "про", "с", "со", "так", "тем",
  "то", "у", "чем", "через", "что", "чтобы", "это",
];

const SERVICE_WORD_PATTERN = new RegExp(
  `(^|[\\s([{"«„“—–-])(${SERVICE_WORDS.join("|")}) +(?=[\\p{L}\\p{N}])`,
  "giu",
);

const EXCLUDED_TAGS = new Set(["CODE", "PRE", "SCRIPT", "STYLE", "TEXTAREA"]);

export function typographText(value) {
  return value.replace(SERVICE_WORD_PATTERN, "$1$2\u00a0");
}

function processTextNode(node) {
  if (!node.nodeValue?.trim() || EXCLUDED_TAGS.has(node.parentElement?.tagName)) return;
  const processed = typographText(node.nodeValue);
  if (processed !== node.nodeValue) node.nodeValue = processed;
}

function processTree(root) {
  if (root.nodeType === Node.TEXT_NODE) {
    processTextNode(root);
    return;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    processTextNode(node);
    node = walker.nextNode();
  }
}

export function installTypographer(root) {
  processTree(root);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "characterData") processTextNode(mutation.target);
      mutation.addedNodes.forEach(processTree);
    });
  });

  observer.observe(root, { childList: true, characterData: true, subtree: true });
  return () => observer.disconnect();
}
