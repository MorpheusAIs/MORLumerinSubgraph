import { Address, Bytes } from "@graphprotocol/graph-ts";
import { DelegateContract } from "../../generated/DelegateRegistry/DelegateRegistry";
import { getDelegateContract } from "../entities/DelegateContract";

const rawLumerinDiamond: string[] = [
  '0xb8C55cD613af947E73E262F0d3C54b7211Af16CF',
  '0x47176B2Af9885dC6C4575d4eFd63895f7Aaa4790'
];
let LUMERIN_DIAMOND = new Array<string>();

for (let i = 0; i < rawLumerinDiamond.length; i++) {
  LUMERIN_DIAMOND.push(rawLumerinDiamond[i].toLowerCase());
}

export function handleDelegateContractEvent(event: DelegateContract): void {
  let contractAddress = event.params.contract_.toHex().toLowerCase();

  if (!LUMERIN_DIAMOND.includes(contractAddress)) {
    return;
  }

  let entity = getDelegateContract(event.params.from, event.params.to, event.params.rights);
  if (event.params.enable == false) {
    entity.from = Address.zero();
    entity.to = Address.zero();
    entity.rights = Bytes.empty();
  }

  entity.save();
}
