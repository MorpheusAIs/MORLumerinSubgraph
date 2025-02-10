import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { AdminClaimed, BuilderPoolCreated, BuilderPoolEdited, Builders, Builders__usersDataResult, FeePaid, UserDeposited, UserWithdrawn } from "../../generated/Builders/Builders";

import { getBuildersProject } from "../entities/BuildersProject";
import { getBuildersUser } from "../entities/BuildersUser";
import { getCounter, increaseTotalBuildersProjectsCounter } from "../entities/Counter";

export function handleBuilderPoolCreated(event: BuilderPoolCreated): void {
  const buildersProject = getBuildersProject(event.params.builderPoolId);

  buildersProject.name = event.params.builderPool.name;
  buildersProject.admin = event.params.builderPool.admin;
  buildersProject.startsAt = event.params.builderPool.poolStart;
  buildersProject.withdrawLockPeriodAfterDeposit = event.params.builderPool.withdrawLockPeriodAfterDeposit;
  buildersProject.claimLockEnd = event.params.builderPool.claimLockEnd;
  buildersProject.minimalDeposit = event.params.builderPool.minimalDeposit;
  buildersProject.save();

  const counter = getCounter();
  increaseTotalBuildersProjectsCounter(counter);
  counter.save();
}

export function handleBuilderPoolEdited(event: BuilderPoolEdited): void {
  const entity = getBuildersProject(event.params.builderPoolId);

  entity.name = event.params.builderPool.name;
  entity.admin = event.params.builderPool.admin;
  entity.startsAt = event.params.builderPool.poolStart;
  entity.withdrawLockPeriodAfterDeposit = event.params.builderPool.withdrawLockPeriodAfterDeposit;
  entity.claimLockEnd = event.params.builderPool.claimLockEnd;
  entity.minimalDeposit = event.params.builderPool.minimalDeposit;

  entity.save();
}

export function handleUserDeposited(event: UserDeposited): void {
  const buildersUser = getBuildersUser(event.params.user, event.params.builderPool);

  const buildersProject = getBuildersProject(event.params.builderPool);
  buildersProject.totalStaked =  buildersProject.totalStaked.plus(event.params.amount);
  if (buildersUser.staked.equals(BigInt.zero())) {
    buildersProject.totalUsers = buildersProject.totalUsers.plus(BigInt.fromI32(1));
  }
  buildersProject.save();

  buildersUser.staked = buildersUser.staked.plus(event.params.amount);
  buildersUser.lastStake = event.block.timestamp;
  buildersUser.save();
}

export function handleUserWithdrawn(event: UserWithdrawn): void {
  const userData = _callToGetUsersData(event.address, event.params.builderPool, event.params.user)
  if (userData == null) {
    return;
  }

  const buildersUser = getBuildersUser(event.params.user, event.params.builderPool);
  const deposited = userData.getDeposited();
  const withdrawn = buildersUser.staked.minus(deposited)

  buildersUser.staked = deposited;
  buildersUser.save();

  const buildersProject = getBuildersProject(event.params.builderPool);
  buildersProject.totalStaked = buildersProject.totalStaked.minus(withdrawn);
  if (buildersUser.staked.equals(BigInt.zero())) {
    buildersProject.totalUsers = buildersProject.totalUsers.minus(BigInt.fromI32(1));
  }
  buildersProject.save();
}

export function handleAdminClaimed(event: AdminClaimed): void {
  const buildersProject = getBuildersProject(event.params.builderPool);
  buildersProject.totalClaimed = buildersProject.totalClaimed.plus(event.params.amount);
  buildersProject.save();
}

function _callToGetUsersData(
  buildersAddress: Address,
  builderProjectId: Bytes,
  userAddress: Address,
): Builders__usersDataResult | null {
  const builders = Builders.bind(buildersAddress);
  const result = builders.try_usersData(userAddress, builderProjectId);

  if (!result.reverted) {
    return result.value;
  }

  return null;
}