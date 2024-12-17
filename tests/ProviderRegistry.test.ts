import { Address, BigInt } from "@graphprotocol/graph-ts";
import { afterEach, assert, clearStore, describe, test } from "matchstick-as/assembly/index";
import {
  handleProviderDeregisteredEvent,
  handleProviderRegisteredEvent,
} from "../src/mappings/provider-registry";
import {
  createProviderDeregisteredEvent,
  createProviderRegisteredEvent,
  mockGetProviderDataCall,
} from "./utils/provider-registry.util";

describe("ProviderRegistry", () => {
  afterEach(() => {
    clearStore();
  });

  test("Should handle provider register call", () => {
    let provider = Address.fromString("0x86e08f7d84603AEb97cd1c89A80A9e914f181671");
    let amount = BigInt.fromI32(10);
    let endpoint = "endpoint_1"

    let event = createProviderRegisteredEvent(provider);
    mockGetProviderDataCall(event.address, provider, amount, endpoint)
    handleProviderRegisteredEvent(event);

    assert.entityCount("Provider", 1);
    assert.fieldEquals("Provider", provider.toHexString(), "stake", amount.toString());
    assert.fieldEquals("Provider", provider.toHexString(), "endpoint", endpoint);

    amount = BigInt.fromI32(20);
    endpoint = "endpoint_2"

    mockGetProviderDataCall(event.address, provider, amount, endpoint)
    handleProviderRegisteredEvent(event);

    assert.entityCount("Provider", 1);
    assert.fieldEquals("Provider", provider.toHexString(), "stake", amount.toString());
    assert.fieldEquals("Provider", provider.toHexString(), "endpoint", endpoint);
  });

  test("Should handle provider deregister call", () => {
    let provider = Address.fromString("0x86e08f7d84603AEb97cd1c89A80A9e914f181671");
    let amount = BigInt.fromI32(10);
    let endpoint = "endpoint_1"

    let event = createProviderDeregisteredEvent(provider);
    mockGetProviderDataCall(event.address, provider, amount, endpoint)
    handleProviderDeregisteredEvent(event);

    assert.entityCount("Provider", 1);
    assert.fieldEquals("Provider", provider.toHexString(), "stake", amount.toString());
    assert.fieldEquals("Provider", provider.toHexString(), "endpoint", "");

    amount = BigInt.fromI32(20);

    mockGetProviderDataCall(event.address, provider, amount, endpoint)
    handleProviderDeregisteredEvent(event);

    assert.entityCount("Provider", 1);
    assert.fieldEquals("Provider", provider.toHexString(), "stake", amount.toString());
    assert.fieldEquals("Provider", provider.toHexString(), "endpoint", "");
  });
});
