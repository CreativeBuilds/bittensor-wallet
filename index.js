import Bip39 from 'bip39';
import {ApiPromise, WsProvider, Keyring} from '@polkadot/api';


const wsProvider = new WsProvider("wss://sub0.tensorswap.com");
const api = await ApiPromise.create({ provider: wsProvider });
const keyring = new Keyring();

// Generate a new random 12 word seed with bip39
const KEY = Bip39.generateMnemonic();
let a = keyring.addFromMnemonic(KEY);

const MY_ADDY = "5EsS2gt39H8CwneWiKova8ADPi2CrLZVN83GppmXnguAgMpV";
const MY_HOT_ADDY = "5CdHSMAsgYN61VohPqEFCWk3AdgcapXyMPRZLKN6ebAXUiiS";
const NeuronUID = await api.query.subtensorModule.hotkeys(MY_HOT_ADDY);
// console.log(NeuronUID, "ID")
console.log(await api.query.subtensorModule.neurons.multi([NeuronUID]).then(x => x.map(y => y.value)))
// console.log(await api.query.system.account(MY_HOT_ADDY).then(res => res.data));
// console.log(await api.query.subtensorModule.hotkeys(MY_ADDY));
// const balance = await api.query.balances.reserves(MY_ADDY);
// console.log(balance);

console.log(KEY);


console.log(a.toJson());



// const result = await api.query.system.account(KEY);

// console.log(result);