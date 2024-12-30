import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ProxyDeployed } from "../../generated/DelegateFactory/DelegateFactory";
import { ProvidersDelegate as ProvidersDelegateContract } from "../../generated/templates/ProvidersDelegate/ProvidersDelegate";
import { ProvidersDelegate } from "../../generated/templates";

import { getSubnet } from "../entities/Subnet";
import { getCounter, increaseCounter } from "../entities/Counter";

export function handleProxyDeployed(event: ProxyDeployed): void {
  const subnet = getSubnet(event.params.proxyAddress);

  subnet.fee = _callGetProvidersDelegatorFee(event.params.proxyAddress);
  subnet.deregistrationOpensAt = _callGetProvidersDelegatorDeregistrationOpenAt(event.params.proxyAddress);
  subnet.createdAt = event.block.timestamp;
  subnet.owner = event.transaction.from;
  subnet.save();

  const counter = getCounter();
  increaseCounter(counter);
  counter.save();

  ProvidersDelegate.create(event.params.proxyAddress);
}

function _callGetProvidersDelegatorFee(contractAddress: Address): BigInt {
  const contract = ProvidersDelegateContract.bind(contractAddress);

  return contract.fee();
}

function _callGetProvidersDelegatorDeregistrationOpenAt(contractAddress: Address): BigInt {
  const contract = ProvidersDelegateContract.bind(contractAddress);

  return contract.deregistrationOpensAt();
}