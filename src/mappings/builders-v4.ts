import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  AdminClaimed,
  SubnetCreated,
  SubnetEdited,
  SubnetMetadataEdited,
  UserDeposited,
  UserWithdrawn,
} from "../../generated/BuildersV4/BuildersV4";

import { getCounter, increaseTotalBuilderSubnetsCounter } from "../entities/Counter";
import { getBuilderSubnet } from "../entities/BuilderSubnet";
import { getBuilderUser } from "../entities/BuilderUser";

export function handleSubnetCreated(event: SubnetCreated): void {
  const subnet = getBuilderSubnet(event.params.subnetId);

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
  const subnet = getBuilderSubnet(event.params.subnetId_);

  subnet.name = event.params.subnet.name;
  subnet.admin = event.params.subnet.admin;
  subnet.claimAdmin = event.params.subnet.claimAdmin;
  subnet.minimalDeposit = event.params.subnet.minimalDeposit;
  subnet.withdrawLockPeriodAfterDeposit = event.params.subnet.withdrawLockPeriodAfterDeposit;
  subnet.save();
}

export function handleSubnetMetadataEdited(event: SubnetMetadataEdited): void {
  const subnet = getBuilderSubnet(event.params.subnetId_);

  subnet.slug = event.params.metadata_.slug;
  subnet.description = event.params.metadata_.description;
  subnet.website = event.params.metadata_.website;
  subnet.image = event.params.metadata_.image;
  subnet.save();
}

export function handleUserDeposited(event: UserDeposited): void {
  const user = getBuilderUser(event.params.user, event.params.subnetId);
  const subnet = getBuilderSubnet(event.params.subnetId);

  // Compare deposited amount before the update
  if (user.deposited.equals(BigInt.zero())) {
    subnet.totalUsers = subnet.totalUsers.plus(BigInt.fromI32(1));
  }
  subnet.totalStaked = subnet.totalStaked.plus(event.params.amount);
  subnet.save();

  user.deposited = user.deposited.plus(event.params.amount);
  user.save();
}

export function handleUserWithdrawn(event: UserWithdrawn): void {
  const user = getBuilderUser(event.params.user, event.params.subnetId);
  const subnet = getBuilderSubnet(event.params.subnetId);

  user.deposited = user.deposited.minus(event.params.amount);
  user.save();

  if (user.deposited.equals(BigInt.zero())) {
    subnet.totalUsers = subnet.totalUsers.minus(BigInt.fromI32(1));
  }
  subnet.totalStaked = subnet.totalStaked.minus(event.params.amount);
  subnet.save();

}

export function handleAdminClaimed(event: AdminClaimed): void {
  const subnet = getBuilderSubnet(event.params.subnetId);

  subnet.totalClaimed = subnet.totalClaimed.plus(event.params.amount);
  subnet.save();
}
