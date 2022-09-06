import React, { useEffect } from "react";
import { Account, KeyringPair } from "../utils/provider";
import { useBalance } from "../_hooks/useBalance";
import { Seperator } from "./Seperator";
import { SVGLogo } from "./SVGLogo";
import "./Home.scss";
import { Popup } from "./Popup";
import { TransferWindow } from "./TransferWindow";

export function Home({
  accounts,
  selectedAccount,
  keypairs,
}: {
  accounts: Account[];
  selectedAccount: string;
  keypairs: KeyringPair[];
}) {
  const selectedKey = keypairs.find(
    (keypair) => keypair.address == selectedAccount
  );
  const [copiedAddress, setCopiedAddress] = React.useState<boolean>(false);
  const [openTransferWindow, setOpenTransferWindow] =
    React.useState<boolean>(false);

  if (!selectedKey) return <div>Account not found</div>;

  const { balance } = useBalance(selectedKey);
  
  useEffect(() => {
    if (copiedAddress) {
      setTimeout(() => setCopiedAddress(false), 2300);
    }
  }, [copiedAddress]);

  return balance.length == 0 ? null : (
    <>
      <div className="home-content">
        <h1 id={"balance"}>
          {parseFloat(balance).toFixed(3)}
          <span>
            <SVGLogo id={""} />
          </span>
        </h1>
        <div
          className={"address"}
          onClick={() => {
            navigator.clipboard.writeText(selectedAccount);
            setCopiedAddress(true);
          }}
        >
          <h3>Address</h3>
          <p>
            {selectedAccount}
            {copiedAddress ? (
              <>
                <br />
                <br />
                <b>Copied!</b>
              </>
            ) : null}
          </p>
        </div>
        <div className="actions flex-center">
          <button onClick={() => setOpenTransferWindow(true)}>Transfer</button>
        </div>
      </div>
      {openTransferWindow ? (
        <Popup close={() => setOpenTransferWindow(false)}>
          <TransferWindow
            balance={balance}
            keypair={selectedKey}
            accounts={accounts}
            onClose={() => setOpenTransferWindow(false)}
          />
        </Popup>
      ) : null}
    </>
  );
}
