import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { BuilderUser } from "../../generated/schema";

export function getBuilderUser(user: Bytes, builderSubnetId: Bytes): BuilderUser {
  const id = user.concat(builderSubnetId);
  let entity = BuilderUser.load(id);

  if (entity == null) {
    entity = new BuilderUser(id);

    entity.address = user;
    entity.builderSubnet = builderSubnetId;
    entity.deposited = BigInt.zero();
  }

  return entity;
}