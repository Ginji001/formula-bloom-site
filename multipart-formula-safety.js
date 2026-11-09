// These archived palette entries contain multiple separate colour-area
// formulas concatenated together. Keep the archive, but never auto-analyze it
// as one formula. IDs refer to the saved records, not JANs.
const MULTIPART_ARCHIVE_IDS=new Set([
 'cezanne-4939553043294-eaaa9cd39','cezanne-4939553043294-8b019205d','cezanne-4939553043294-9375b8eff',
 'cezanne-4939553042921-b9bd12abe','cezanne-4939553042921-0fc60e805','cezanne-4939553042921-6b503f928',
 'cezanne-4939553040149-720e99750','cezanne-4939553042334-a6a96a8c5','cezanne-4939553042334-9cd10066d'
]);
export const needsMultipartFormulaReview=record=>MULTIPART_ARCHIVE_IDS.has(record?.productId);
