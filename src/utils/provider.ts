import {ApiPromise, WsProvider, Keyring} from '@polkadot/api';
import {KeyringPair} from '@polkadot/keyring/types';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import {cryptoWaitReady} from '@polkadot/util-crypto';
import { BehaviorSubject, filter, switchMap } from 'rxjs';
import { decrypt } from './crypto';

export const keyring = new Keyring();

export const $provider = new BehaviorSubject(["wss://sub0.tensorswap.com"])
export const $api = $provider.pipe(
    switchMap(async provider => await ApiPromise.create({provider: new WsProvider(provider)})),
    filter(api => !!api.query.system)
)
export interface Account {
    address: string;
    encryptedMnemonic: {
        iv: string;
        content: string;
    };
    name: string;
}

export const $accounts = new BehaviorSubject<Account[]>(JSON.parse(localStorage.getItem("accounts") || "[]"));
export const $keypairs = new BehaviorSubject<KeyringPair[]>([]);


export const createPair = (mnemonic: string) => {
    keyring.setSS58Format(42);
    return cryptoWaitReady().then(() => keyring.addFromUri(mnemonic, undefined, 'sr25519'));
}

export const addAccount = (pair: KeyringPair) => {
    $keypairs.next([...$keypairs.value, pair]);
    $accounts.next(JSON.parse(localStorage.getItem("accounts") || "[]"));
    return pair;
}

export const unlockAccount = async (account: Account, password: string) => {
    const mnemonic = decrypt(account.encryptedMnemonic, password);
    const pair = await createPair(mnemonic);
    console.log("pair", pair);
    $keypairs.next([...$keypairs.value, pair]);
    return pair;
}

export type {
    KeyringPair
}

export const isValidAddressPolkadotAddress = (address: string) => {
    try {
      encodeAddress(
        isHex(address)
          ? hexToU8a(address)
          : decodeAddress(address)
      );
  
      return true;
    } catch (error) {
      return false;
    }
  };