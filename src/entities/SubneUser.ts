import { Address, BigInt } from "@graphprotocol/graph-ts";
import { SubnetUser } from "../../generated/schema";

export function getSubnetUser(subnet: Address, user: Address): SubnetUser {
  const id = subnet.concat(user);
  let entity = SubnetUser.load(id);

  if (entity == null) {
    entity = new SubnetUser(id);

    entity.staked = BigInt.zero();
    entity.claimed = BigInt.zero();
    entity.subnet = subnet;
    entity.address = user;
  }

  return entity;
}
