import { Address, Bytes } from "@graphprotocol/graph-ts";
import { DelegateContract } from "../../generated/schema";

export function getDelegateContract(from: Address, to: Address, rights: Bytes): DelegateContract {
  let id = from.concat(to).concat(rights);
  let entity = DelegateContract.load(id);

  if (entity == null) {
    entity = new DelegateContract(id);

    entity.from = from;
    entity.to = to;
    entity.rights = rights;
  }

  return entity;
}
