import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Provider } from "../../generated/schema";

export function getProvider(provider: Address): Provider {
  let entity = Provider.load(provider);

  if (entity == null) {
    entity = new Provider(provider);

    entity.stake = BigInt.zero();
    entity.endpoint = "";
  }

  return entity;
}
