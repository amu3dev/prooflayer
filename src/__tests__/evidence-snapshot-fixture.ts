import { buildEvidenceSnapshot } from "../evidence-snapshots.js";
import { pinTargetEvidenceSnapshot } from "../target-evidence-pin.js";

export async function pinCurrentEvidenceSnapshot(
  workspace: string,
  targetId: string,
  now?: () => Date,
): Promise<string> {
  const snapshot = await buildEvidenceSnapshot(workspace, { now });
  await pinTargetEvidenceSnapshot(
    workspace,
    targetId,
    snapshot.snapshotId,
    { now },
  );
  return snapshot.snapshotId;
}
