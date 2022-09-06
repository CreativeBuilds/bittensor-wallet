import React from 'react';
import { $keypairs, $accounts, KeyringPair, Account } from "../utils/provider";

export const useAccounts = () => {
    const [accounts, setAccounts] = React.useState<Account[]>([]);
    const [keypairs, setKeypairs] = React.useState<KeyringPair[]>([]);

    React.useEffect(() => {
        let subscription = $accounts.subscribe(setAccounts);

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    React.useEffect(() => {
        let subscription = $keypairs.subscribe(setKeypairs);
        return () => {
            subscription.unsubscribe();
        }
    }, []);

    return {accounts, keypairs };
}