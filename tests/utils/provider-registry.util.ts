import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { createMockedFunction, newMockEvent } from "matchstick-as";
import { ProviderDeregistered, ProviderRegistered } from "../../generated/ProviderRegistry/ProviderRegistry";

export function createProviderRegisteredEvent(provider: Address): ProviderRegistered {
  let event = changetype<ProviderRegistered>(newMockEvent());

  event.parameters = new Array();
  event.parameters.push(
    new ethereum.EventParam("provider", ethereum.Value.fromAddress(provider))
  );

  return event;
}

export function createProviderDeregisteredEvent(provider: Address): ProviderDeregistered {
  let event = changetype<ProviderDeregistered>(newMockEvent());

  event.parameters = new Array();
  event.parameters.push(
    new ethereum.EventParam("provider", ethereum.Value.fromAddress(provider))
  );

  return event;
}

export function mockGetProviderDataCall(contract: Address, provider: Address, stake: BigInt, endpoint: string): void {
  const result = new ethereum.Tuple();
  result.push(ethereum.Value.fromString(endpoint));
  result.push(ethereum.Value.fromUnsignedBigInt(stake));
  result.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromString("2"))); 
  result.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromString("3")));
  result.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromString("4")));
  result.push(ethereum.Value.fromBoolean(true));

  createMockedFunction(
    contract,
    "getProvider",
    "getProvider(address):((string,uint256,uint128,uint128,uint256,bool))",
  )
    .withArgs([ethereum.Value.fromAddress(provider)])
    .returns([ethereum.Value.fromTuple(result)])
}
