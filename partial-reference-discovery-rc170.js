// rc170: Only verified Japanese manufacturer named-ingredient reference excerpts, never complete formula snapshots.
export const rc170PartialProductIds=new Set([
  "rc101-visee-c8920ca65a8f",
  "rc102-predia-72d44ddbf311",
  "rc102-predia-1f8282dcdbb8",
  "rc102-predia-911316e467a2",
  "rc102-predia-4b91985bc515",
  "rc102-predia-4d37982ee1cf",
  "rc102-predia-690bd986dd3c",
  "rc100-attennir-81a25f6f8525",
  "rc101-visee-73e1398f7862",
  "rc100-attennir-aae024dc9df1",
  "rc101-visee-fde8aec5a08c",
  "rc100-attennir-a8afaf088d16",
  "rc101-visee-d113a83acd13",
  "rc100-attennir-e74e280f113a",
  "rc100-attennir-4bd1d86f959a",
  "rc102-hikarimirai-9f78bb1314d7",
  "rc102-hikarimirai-5f64ff02d640",
  "rc102-hikarimirai-b60d2e2fa1ff",
  "rc102-hikarimirai-30f05f0e41b9"
]);
export const hasRc170PartialNameEvidence=id=>rc170PartialProductIds.has(id);
