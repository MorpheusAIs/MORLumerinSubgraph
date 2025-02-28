import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { BuilderSubnet } from "../../generated/schema";

export function getBuilderSubnet(id: Bytes): BuilderSubnet {
  let entity = BuilderSubnet.load(id);

  if (entity == null) {
    entity = new BuilderSubnet(id);

    entity.name = "";
    entity.owner = Bytes.empty();
    entity.minStake = BigInt.zero()
    entity.fee = BigInt.zero()
    entity.feeTreasury = Bytes.empty();
    entity.startsAt = BigInt.zero()
    entity.withdrawLockPeriodAfterStake = BigInt.zero()
    entity.maxClaimLockEnd = BigInt.zero();
  
    entity.slug = "";
    entity.description = "";
    entity.website = "";
    entity.image = "";
  
    entity.totalStaked = BigInt.zero();
    entity.totalClaimed = BigInt.zero();
    entity.totalUsers = BigInt.zero();
  }

  return entity;
}
