import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import { BuilderSubnet } from "../../generated/schema";

export function getBuilderSubnet(id: Bytes): BuilderSubnet {
  let entity = BuilderSubnet.load(id);

  if (entity == null) {
    entity = new BuilderSubnet(id);

    entity.name = "";
    entity.admin = Bytes.empty();
    entity.claimAdmin = Bytes.empty();
    entity.minimalDeposit = BigInt.zero()
    entity.withdrawLockPeriodAfterDeposit = BigInt.zero()
  
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
