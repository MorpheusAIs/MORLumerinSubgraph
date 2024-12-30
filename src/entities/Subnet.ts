import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Subnet } from "../../generated/schema";

export function getSubnet(subnet: Address): Subnet {
  let entity = Subnet.load(subnet);

  if (entity == null) {
    entity = new Subnet(subnet);

    entity.name = '';
    entity.endpoint = '';
    entity.createdAt = BigInt.zero();
    entity.owner = Bytes.empty();

    entity.fee = BigInt.zero();

    entity.deregistrationOpensAt = BigInt.zero();
    entity.isDeregistered = false;

    entity.totalStaked = BigInt.zero();
    entity.totalClaimed = BigInt.zero();
    entity.totalUsers = BigInt.zero();
  }

  return entity;
}
