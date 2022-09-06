import React from 'react';
import { combineLatest, filter, timer } from 'rxjs';
import { formatBalance } from "@polkadot/util"
import { $api, KeyringPair } from '../utils/provider';

export function useBalance(keypair: KeyringPair) {
    const [balance, setBalance] = React.useState<string>("");

    React.useEffect(() => {
        if (!keypair) return;
        let sub = combineLatest([$api, timer(0, 30000)]).subscribe(([api]) => {
            api.query.system.account(keypair.address).then(({data}: any) => {
                const newBalance = (data.free.toNumber() / Math.pow(10, 9)).toFixed(3);
                console.log(data.free.toString(), newBalance);
                if(newBalance != balance)
                    setBalance(newBalance);
            });
        });
        return () => sub.unsubscribe();
    }, [keypair]);

    return {balance};
}