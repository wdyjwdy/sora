function parse(text: string) {
  const matchs = text.matchAll(/(.+) -> (.+?): (.+)/g);
  const results = [...matchs].map((v) => ({ A: v[1], B: v[2], T: v[3] }));

  const set = new Set<string>();
  for (let { A, B } of results) {
    set.add(A);
    set.add(B);
  }
  const actors = [...set];

  const signals = [];
  for (let { A, B, T } of results) {
    const gridX1 = actors.findIndex((v) => v === A);
    const gridX2 = actors.findIndex((v) => v === B);
    signals.push({ text: T, gridX1, gridX2 });
  }
  return { actors, signals };
}

type Data = {
  actors: string[];
  signals: { text: string; gridX1: number; gridX2: number }[];
};

function render(data: Data) {
  const { actors, signals } = data;
  const [gridLenX, gridLenY] = [actors.length, signals.length + 2];
  const [width, height] = [gridLenX * 150 - 50, gridLenY * 50];
  const actorsSvg = actors
    .map((v, i) => renderActorPairs(v, i, gridLenY))
    .join("");
  const signalSvg = signals
    .map((v, i) => renderSignal(v.text, v.gridX1, v.gridX2, i + 1))
    .join("");
  const defs = `<defs><marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>`;
  const svg = `<svg class="sequence-diagram" viewBox="0 0 ${width} ${height}" style="max-width: ${width};" width="100%">${defs + actorsSvg + signalSvg}</svg>`;
  return svg;
}

function renderLine(
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  hasArrow: boolean = false,
) {
  const arrowSvg = hasArrow ? `marker-end="url(#arrow)"` : "";
  return `<line x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}" stroke="black" ${arrowSvg} />`;
}

function renderText(x: number, y: number, text: string) {
  return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Courier New, STSong" font-size="20">${text}</text>`;
}

function renderRect(x: number, y: number) {
  return `<rect x="${x}" y="${y}" width="100" height="50" rx="8" fill="lightblue" />`;
}

function renderSignal(
  text: string,
  gridX1: number,
  gridX2: number,
  gridY: number,
) {
  const x1 = gridX1 * 150 + 50;
  const x2 = gridX2 * 150 + 50;
  const y1 = gridY * 50 + 25;
  const y2 = y1;
  const cx = (x1 + x2) / 2;
  const cy = y1 - 12.5;
  return `<g class="signal">${renderLine(x1, x2, y1, y2, true) + renderText(cx, cy, text)}</g>`;
}

function renderActorPairs(text: string, gridX: number, gridLenY: number) {
  return (
    renderActor(text, gridX, 0) +
    renderActorLine(gridX, gridLenY - 1) +
    renderActor(text, gridX, gridLenY - 1)
  );
}

function renderActor(text: string, gridX: number, gridY: number) {
  const x = gridX * 150;
  const y = gridY * 50;
  const cx = x + 50;
  const cy = y + 25;
  return `<g class="actor">${renderRect(x, y) + renderText(cx, cy, text)}</g>`;
}

function renderActorLine(gridX: number, gridLenY: number) {
  const x1 = gridX * 150 + 50;
  const x2 = x1;
  const y1 = 50;
  const y2 = gridLenY * 50;
  return `<g class="actor-line">${renderLine(x1, x2, y1, y2)}</g>`;
}

function generateSequenceDiagramSvg(text: string) {
  return render(parse(text));
}

export { generateSequenceDiagramSvg };
