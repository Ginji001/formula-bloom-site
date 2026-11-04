// rc171: Japanese official ingredient excerpts only, never complete domestic package formulas.
export const rc171PartialProductIds=new Set([
  "rc94-jp-official-minon-170",
  "rc94-jp-official-minon-174",
  "rc94-jp-official-minon-175",
  "rc94-jp-official-minon-164",
  "rc94-jp-official-minon-160",
  "rc100-cpb-90db1e727628",
  "rc100-cpb-fc594da7d987",
  "rc102-predia-c2e4dcfec590",
  "rc102-predia-186de3d58c2d",
  "rc102-predia-8a35928467b7",
  "rc102-predia-a1a72af4ff1a",
  "rc61-catalog-059",
  "rc61-catalog-057"
]);
export const hasRc171PartialNameEvidence=id=>rc171PartialProductIds.has(id);
