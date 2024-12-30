import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Counter } from "../../generated/schema";

const counterId = Bytes.empty();

export function getCounter(): Counter {
  let entity = Counter.load(counterId);

  if (entity == null) {
    entity = new Counter(counterId);

    entity.totalSubnets = BigInt.zero();
  }

  return entity;
}

export function increaseCounter(counter: Counter): Counter {
  counter.totalSubnets = counter.totalSubnets.plus(BigInt.fromI32(1));

  return counter;
}
