import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  BuilderPoolCreated,
  BuilderPoolEdited,
  AdminClaimed,
  Upgraded as UpgradedEvent,
  SubnetCreated,
  SubnetEdited,
  SubnetMetadataEdited,
  UserDeposited,
  UserWithdrawn,
} from "../../generated/Builders/Builders";
import { Upgraded } from "../../generated/schema";
import { getCounter, increaseTotalBuilderSubnetsCounter } from "../entities/Counter";
import { getBuildersProject } from "../entities/BuildersProject";
import { getBuildersUser } from "../entities/BuildersUser";

// BUILDERS events
export function handleUserDeposited(event: UserDeposited): void {
  const user = getBuildersUser(event.params.user, event.params.subnetId);
  const subnet = getBuildersProject(event.params.subnetId);

  // Compare deposited amount before the update
  if (user.staked.equals(BigInt.zero())) {
    subnet.totalUsers = subnet.totalUsers.plus(BigInt.fromI32(1));
  }
  subnet.totalStaked = subnet.totalStaked.plus(event.params.amount);
  subnet.save();

  user.staked = user.staked.plus(event.params.amount);
  user.lastStake = event.block.timestamp;
  user.save();
}

export function handleUserWithdrawn(event: UserWithdrawn): void {
  const user = getBuildersUser(event.params.user, event.params.subnetId);
  const subnet = getBuildersProject(event.params.subnetId);

  user.staked = user.staked.minus(event.params.amount);
  user.save();

  if (user.staked.equals(BigInt.zero())) {
    subnet.totalUsers = subnet.totalUsers.minus(BigInt.fromI32(1));
  }
  subnet.totalStaked = subnet.totalStaked.minus(event.params.amount);
  subnet.save();

}

export function handleAdminClaimed(event: AdminClaimed): void {
  const subnet = getBuildersProject(event.params.subnetId);

  subnet.totalClaimed = subnet.totalClaimed.plus(event.params.amount);
  subnet.save();
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(event.transaction.hash.concatI32(event.logIndex.toI32()));

  entity.implementation = event.params.implementation;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}

// BUILDERS v1, v2 events
export function handleBuilderPoolCreated(event: BuilderPoolCreated): void {
  const subnet = getBuildersProject(event.params.builderPoolId);

  subnet.name = event.params.builderPool.name;
  subnet.admin = event.params.builderPool.admin;
  subnet.claimAdmin = event.params.builderPool.admin;
  subnet.startsAt = event.params.builderPool.poolStart;
  subnet.withdrawLockPeriodAfterDeposit = event.params.builderPool.withdrawLockPeriodAfterDeposit;
  subnet.minimalDeposit = event.params.builderPool.minimalDeposit;
  subnet.claimLockEnd = event.params.builderPool.claimLockEnd;
  subnet.save();

  const counter = getCounter();
  increaseTotalBuilderSubnetsCounter(counter);
  
  counter.save();
}

export function handleBuilderPoolEdited(event: BuilderPoolEdited): void {
  const subnet = getBuildersProject(event.params.builderPoolId);

  subnet.name = event.params.builderPool.name;
  subnet.admin = event.params.builderPool.admin;
  subnet.claimAdmin = event.params.builderPool.admin;
  subnet.startsAt = event.params.builderPool.poolStart;
  subnet.withdrawLockPeriodAfterDeposit = event.params.builderPool.withdrawLockPeriodAfterDeposit;
  subnet.minimalDeposit = event.params.builderPool.minimalDeposit;
  subnet.claimLockEnd = event.params.builderPool.claimLockEnd;

  subnet.save();
}

// BUILDERS v4 events
export function handleSubnetCreated(event: SubnetCreated): void {
  const subnet = getBuildersProject(event.params.subnetId);

  subnet.name = event.params.subnet.name;
  subnet.admin = event.params.subnet.admin;
  subnet.claimAdmin = event.params.subnet.claimAdmin;
  subnet.minimalDeposit = event.params.subnet.minimalDeposit;
  subnet.withdrawLockPeriodAfterDeposit = event.params.subnet.withdrawLockPeriodAfterDeposit;
  subnet.save();

  const counter = getCounter();
  increaseTotalBuilderSubnetsCounter(counter);
  
  counter.save();
}

export function handleSubnetEdited(event: SubnetEdited): void {
  const subnet = getBuildersProject(event.params.subnetId_);

  subnet.name = event.params.subnet.name;
  subnet.admin = event.params.subnet.admin;
  subnet.claimAdmin = event.params.subnet.claimAdmin;
  subnet.minimalDeposit = event.params.subnet.minimalDeposit;
  subnet.withdrawLockPeriodAfterDeposit = event.params.subnet.withdrawLockPeriodAfterDeposit;
  subnet.save();
}

export function handleSubnetMetadataEdited(event: SubnetMetadataEdited): void {
  const subnet = getBuildersProject(event.params.subnetId_);

  subnet.slug = event.params.metadata_.slug;
  subnet.description = event.params.metadata_.description;
  subnet.website = event.params.metadata_.website;
  subnet.image = event.params.metadata_.image;
  subnet.save();
}