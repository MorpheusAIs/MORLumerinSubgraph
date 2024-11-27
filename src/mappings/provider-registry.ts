import { Address } from "@graphprotocol/graph-ts";
import {
  ProviderDeregistered,
  ProviderRegistered,
  ProviderRegistry,
  ProviderRegistry__getProviderResultValue0Struct,
} from "../../generated/ProviderRegistry/ProviderRegistry";
import { getProvider } from "../entities/Provider";

export function handleProviderRegisteredEvent(event: ProviderRegistered): void {
  let providerData = _callToGetProviderData(event.address, event.params.provider);
  if (providerData === null) {
    return;
  }

  let entity = getProvider(event.params.provider);
  entity.stake = providerData.stake;
  entity.endpoint = providerData.endpoint;

  entity.save();
}

export function handleProviderDeregisteredEvent(event: ProviderDeregistered): void {
  let providerData = _callToGetProviderData(event.address, event.params.provider);
  if (providerData === null) {
    return;
  }

  let entity = getProvider(event.params.provider);
  entity.stake = providerData.stake;

  entity.save();
}

function _callToGetProviderData(
  providerRegistryAddress: Address,
  providerAddress: Address,
): ProviderRegistry__getProviderResultValue0Struct | null {
  const providerRegistry = ProviderRegistry.bind(providerRegistryAddress);
  const result = providerRegistry.try_getProvider(providerAddress);

  if (!result.reverted) {
    return changetype<ProviderRegistry__getProviderResultValue0Struct>(result.value);
  }

  return null;
}
