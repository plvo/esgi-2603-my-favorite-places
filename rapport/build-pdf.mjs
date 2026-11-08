import { marked } from "marked@15.0.12";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPOSITORY_URL = "https://github.com/plvo/esgi-2603-my-favorite-places";
const STYLE = `
@page { size: A4; margin: 18mm 16mm; }
body { font: 10.5pt/1.5 "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #1f2328; }
h1 { font-size: 22pt; margin: 0 0 12pt; }
h2 { font-size: 16pt; border-bottom: 1px solid #d0d7de; padding-bottom: 4pt; margin-top: 22pt; break-after: avoid; }
h3 { font-size: 12.5pt; margin-top: 16pt; break-after: avoid; }
pre { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 7pt 9pt; font-size: 7.6pt; line-height: 1.35; white-space: pre-wrap; overflow-wrap: anywhere; }
code { font-family: "DejaVu Sans Mono", Menlo, monospace; font-size: 88%; }
pre code { font-size: inherit; }
table { border-collapse: collapse; width: 100%; font-size: 9.5pt; margin: 8pt 0; break-inside: avoid; }
th, td { border: 1px solid #d0d7de; padding: 3pt 6pt; text-align: left; overflow-wrap: anywhere; }
th { background: #f6f8fa; }
img { display: block; max-width: 78%; margin: 8pt auto; border: 1px solid #d0d7de; break-inside: avoid; }
a { color: #0550ae; text-decoration: none; }
`;

const toRepositoryLinks = (html) =>
  html
    .replaceAll('href="../', `href="${REPOSITORY_URL}/blob/main/`)
    .replaceAll('href="sorties/', `href="${REPOSITORY_URL}/tree/main/rapport/sorties/`)
    .replaceAll('src="captures/', `src="file://${import.meta.dir}/captures/`);

const body = toRepositoryLinks(marked.parse(readFileSync(join(import.meta.dir, "rapport.md"), "utf8")));
const workDirectory = mkdtempSync(join(tmpdir(), "rapport-"));
const page = join(workDirectory, "rapport.html");
writeFileSync(page, `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Rapport de TP : Clusterisation de conteneurs</title><style>${STYLE}</style></head><body>${body}</body></html>`);

const { exitCode } = Bun.spawnSync([
  "google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox", "--no-pdf-header-footer",
  `--user-data-dir=${join(workDirectory, "chrome")}`,
  "--allow-file-access-from-files",
  `--print-to-pdf=${join(import.meta.dir, "rapport.pdf")}`,
  `file://${page}`,
]);
rmSync(workDirectory, { recursive: true, force: true });
process.exit(exitCode);
