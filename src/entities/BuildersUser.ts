import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { BuildersUser } from "../../generated/schema";

export function getBuildersUser(user: Bytes, builderSubnetId: Bytes): BuildersUser {
  const id = user.concat(builderSubnetId);
  let entity = BuildersUser.load(id);

  if (entity == null) {
    entity = new BuildersUser(id);

    entity.address = user;
    entity.buildersProject = builderSubnetId;
    entity.staked = BigInt.zero();
    entity.lastStake = BigInt.zero();
  }

  return entity;
}