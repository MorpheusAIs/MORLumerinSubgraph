import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { BuildersProject } from "../../generated/schema";

export function getBuildersProject(id: Bytes): BuildersProject {
  let entity = BuildersProject.load(id);

  if (entity == null) {
    entity = new BuildersProject(id);

    entity.name = "";
    entity.admin = Bytes.empty();
    entity.startsAt = BigInt.zero();
    entity.withdrawLockPeriodAfterDeposit = BigInt.zero();
    entity.claimLockEnd = BigInt.zero();
    entity.minimalDeposit = BigInt.zero();
    entity.totalStaked = BigInt.zero();
    entity.totalClaimed = BigInt.zero();
    entity.totalUsers = BigInt.zero();
  }

  return entity;
}
