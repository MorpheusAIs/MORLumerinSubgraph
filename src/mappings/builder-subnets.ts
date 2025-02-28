import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Claimed, FeePaid, Staked, SubnetEdited, SubnetFeeTreasurySet, SubnetMaxClaimLockEndSet, SubnetMetadataEdited, SubnetMinStakeSet, SubnetOwnerSet, Withdrawn } from "../../generated/BuilderSubnets/BuilderSubnets";

import { getCounter, increaseTotalBuilderProjectsCounter } from "../entities/Counter";
import { getBuilderSubnet } from "../entities/BuilderSubnet";
import { getBuilderUser } from "../entities/BuilderUser";

export function handleSubnetEdited(event: SubnetEdited): void {
  const subnet = getBuilderSubnet(event.params.subnetId);

  subnet.name = event.params.subnet.name;
  subnet.owner = event.params.subnet.owner;
  subnet.minStake = event.params.subnet.minStake;
  subnet.fee = event.params.subnet.fee;
  subnet.feeTreasury = event.params.subnet.feeTreasury;
  subnet.startsAt = event.params.subnet.startsAt;
  subnet.withdrawLockPeriodAfterStake = event.params.subnet.withdrawLockPeriodAfterStake;
  subnet.maxClaimLockEnd = event.params.subnet.maxClaimLockEnd;
  subnet.save();

  const counter = getCounter();
  increaseTotalBuilderProjectsCounter(counter);
  counter.save();
}

export function handleSubnetMetadataEdited(event: SubnetMetadataEdited): void {
  const subnet = getBuilderSubnet(event.params.subnetId);

  subnet.slug = event.params.subnetMetadata.slug;
  subnet.description = event.params.subnetMetadata.description;
  subnet.website = event.params.subnetMetadata.website;
  subnet.image = event.params.subnetMetadata.image;
  subnet.save();

}

export function handleSubnetFeeTreasurySet(event: SubnetFeeTreasurySet): void {
  const subnet = getBuilderSubnet(event.params.subnetId);

  subnet.feeTreasury = event.params.newValue;
  subnet.save();
}

export function handleSubnetMinStakeSet(event: SubnetMinStakeSet): void {
  const subnet = getBuilderSubnet(event.params.subnetId);

  subnet.minStake = event.params.newValue;
  subnet.save();
}

export function handleSubnetOwnerSet(event: SubnetOwnerSet): void {
  const subnet = getBuilderSubnet(event.params.subnetId);

  subnet.owner = event.params.newValue;
  subnet.save();
}

export function handleSubnetMaxClaimLockEndSet(event: SubnetMaxClaimLockEndSet): void {
  const subnet = getBuilderSubnet(event.params.subnetId);

  subnet.maxClaimLockEnd = event.params.newValue;
  subnet.save();
}

export function handleStaked(event: Staked): void {
  const user = getBuilderUser(event.params.stakerAddress, event.params.subnetId);
  const subnet = getBuilderSubnet(event.params.subnetId);

  subnet.totalStaked = subnet.totalStaked.plus(event.params.staker.staked).minus(user.staked);
  if (user.staked.equals(BigInt.zero())) {
    subnet.totalUsers = subnet.totalUsers.plus(BigInt.fromI32(1));
  }
  subnet.save();

  user.staked = event.params.staker.staked;
  user.claimLockEnd = event.params.staker.claimLockEnd;
  user.lastStake = event.block.timestamp;
  user.save();
}

export function handleWithdrawn(event: Withdrawn): void {
  const user = getBuilderUser(event.params.stakerAddress, event.params.subnetId);
  const subnet = getBuilderSubnet(event.params.subnetId);

  subnet.totalStaked = subnet.totalStaked.plus(event.params.staker.staked).minus(user.staked);
  if (event.params.staker.staked.equals(BigInt.zero())) {
    subnet.totalUsers = subnet.totalUsers.minus(BigInt.fromI32(1));
  }
  subnet.save();

  user.staked = event.params.staker.staked;
  user.claimLockEnd = event.params.staker.claimLockEnd;
  user.save();
}

export function handleClaimed(event: Claimed): void {
  const user = getBuilderUser(event.params.stakerAddress, event.params.subnetId);
  const subnet = getBuilderSubnet(event.params.subnetId);

  subnet.totalClaimed = subnet.totalStaked.plus(event.params.amount);
  subnet.save();

  user.claimed = user.claimed.plus(event.params.amount);
  user.save();
}

export function handleFeePaid(event: FeePaid): void {
  const subnet = getBuilderSubnet(event.params.subnetId);

  subnet.totalClaimed = subnet.totalStaked.plus(event.params.fee);
  subnet.save();
}