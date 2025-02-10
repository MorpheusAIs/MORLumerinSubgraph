import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { BuildersUser } from "../../generated/schema";

export function getBuildersUser(user: Bytes, buildersProjectId: Bytes): BuildersUser {
  const id = user.concat(buildersProjectId);
  let entity = BuildersUser.load(id);

  if (entity == null) {
    entity = new BuildersUser(id);

    entity.staked = BigInt.zero();
    entity.address = user;
    entity.buildersProject = buildersProjectId;
    entity.lastStake = BigInt.zero();
  }

  return entity;
}
