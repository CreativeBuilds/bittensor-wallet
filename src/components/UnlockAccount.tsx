import { generateMnemonic } from "bip39";
import React, { useEffect } from "react";
import { STARTED_AT } from "../utils/initalized";
import { Account, KeyringPair, unlockAccount } from "../utils/provider";
import { LoadOrCreateAccount } from "./LoadOrCreateAccount";
import { Popup } from "./Popup";
import { SaveNewAccountInfo } from "./SaveNewAccountInfo";
import { Seperator } from "./Seperator";
import "./UnlockAccount.scss";

export function UnlockAccount({
  keypairs,
  accounts,
  selectedAccount,
  setSelectedAccount,
}: {
  keypairs: KeyringPair[];
  accounts: Account[];
  selectedAccount: string;
  setSelectedAccount: (account: string) => void;
}) {
  const TIME_SINCE_START = Date.now() - STARTED_AT;
  const maxPage = 2;
  
  const [password, setPassword] = React.useState<string>("");
  const [render, setRender] = React.useState<boolean>(TIME_SINCE_START > 3000);
  const [selectedAddress, setSelectedAddress] = React.useState<string>(accounts[0].address);
  const [error, setError] = React.useState<string>("");
    
  const [addAccount, setAddAccount] = React.useState<boolean>(false);

  useEffect(() => {
    if (render) return;
    setTimeout(() => setRender(true), 3000 - TIME_SINCE_START);
  }, []);

  return !render ? null : (
    <Popup close={addAccount ? () => setAddAccount(false) : undefined}>
      {
        addAccount ? <LoadOrCreateAccount /> : <>
        <h1>Unlock Account</h1>

        <div className="flex-center" style={{ width: "100%" }}>
          {/* dropdown input */}
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
          >
            {accounts.map((account) => (
              <option key={account.address} value={account.address}>
                {account.name}
              </option>
            ))}
          </select>
          <input
            disabled={selectedAddress.length == 0}
            value={password}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key == "Enter" ? FinishSigningIn() : null}
          />
          {error.length > 0 ? <p>{error}</p> : null}
          <Seperator />
            <button className="add-account" onClick={() => setAddAccount(true)}>
                Add Account
            </button>

        </div>
        <div className="back-or-forward">
            <div></div>
            <button onClick={() => FinishSigningIn()}>
                Next
            </button>
        </div>
      </>
      }
    </Popup>
  );

  async function FinishSigningIn() {
    // use password to unlock account
    const account = accounts.find((account) => account.address == selectedAddress);
    if (!account) return setError("Account not found");
    setSelectedAccount(account.address);
    await unlockAccount(account, password);
  }
}
