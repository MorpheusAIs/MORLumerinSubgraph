import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Counter } from "../../generated/schema";

const counterId = Bytes.empty();

export function getCounter(): Counter {
  let entity = Counter.load(counterId);

  if (entity == null) {
    entity = new Counter(counterId);

    entity.totalSubnets = BigInt.zero();
    entity.totalBuilderProjects = BigInt.zero();
  }

  return entity;
}

export function increaseTotalSubnetsCounter(counter: Counter): Counter {
  counter.totalSubnets = counter.totalSubnets.plus(BigInt.fromI32(1));

  return counter;
}

export function increaseTotalBuilderProjectsCounter(counter: Counter): Counter {
  counter.totalBuilderProjects = counter.totalBuilderProjects.plus(BigInt.fromI32(1));

  return counter;
}
