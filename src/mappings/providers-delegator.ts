import { BigInt } from "@graphprotocol/graph-ts";
import { Claimed, EndpointUpdated, NameUpdated, Staked } from "../../generated/templates/ProvidersDelegate/ProvidersDelegate";
import { getSubnet } from "../entities/Subnet";
import { getSubnetUser } from "../entities/SubneUser";

export function handleNameUpdated(event: NameUpdated): void {
  const entity = getSubnet(event.address);

  entity.name =event.params.name;

  entity.save();
}

export function handleEndpointUpdated(event: EndpointUpdated): void {
  const entity = getSubnet(event.address);

  entity.endpoint =event.params.endpoint;

  entity.save();
}

export function handleStaked(event: Staked): void {
  const subnet = getSubnet(event.address);
  const user = getSubnetUser(event.address, event.params.staker)

  if (user.staked.equals(BigInt.zero())) {
    subnet.totalUsers =  subnet.totalUsers.plus(BigInt.fromI32(1));
  }

  subnet.totalStaked = event.params.totalStaked;
  user.staked = event.params.staked;

  subnet.save();
  user.save();
}

export function handleClaimed(event: Claimed): void {
  const subnet = getSubnet(event.address);
  const user = getSubnetUser(event.address, event.params.staker)

  const claimedAmount = event.params.claimed.minus(user.claimed);

  subnet.totalClaimed = subnet.totalClaimed.plus(claimedAmount);
  user.claimed = event.params.claimed;

  subnet.save();
  user.save();
}