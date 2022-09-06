import React from "react";
import { firstValueFrom } from "rxjs";
import {
    $api,
  Account,
  isValidAddressPolkadotAddress,
  KeyringPair,
} from "../utils/provider";
import { useFee } from "../_hooks/useFee";
import "./TransferWindow.scss";

export function TransferWindow({
  keypair,
  balance,
  accounts,
  onClose,
}: {
  accounts: Account[];
  balance: string;
  keypair: KeyringPair;
  onClose: () => void;
}) {
  const bal = parseFloat(balance);
  const fee = useFee();
  const maxPage = 2;

  const [to, setTo] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(0);
  const [hash, setHash] = React.useState<string>("");

  const InvalidAmount = Number(amount) + fee > bal;
  console.log("InvalidAmount", InvalidAmount, Number(amount), fee, bal);
  const InvalidToAddress = !isValidAddressPolkadotAddress(to);
  return (
    <div className="transfer-window flex-center">
      {page == 0 ? (
        <>
          <h1>Transfer</h1>
          {/* input titled "from" */}
          <div className="input">
            <span>From</span>
            <input type="text" value={keypair.address} readOnly />
          </div>
          {/* input titled "to" */}
          <div className="input">
            <span>To</span>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          {InvalidToAddress && to.length > 0 ? (
            <p className="error">Invalid to address</p>
          ) : null}
          {/* input titled "amount" with max button */}
          <div className="input">
            <div className="flex-between">
              <span>Amount</span>
              <span>{balance}</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              className="inline"
              onClick={() => setAmount((bal > fee ? bal - fee : 0).toString())}
            >
              Max
            </button>
          </div>
          <div className="flex-between">
            <span>Fee</span>
            <span>{fee}</span>
          </div>
          <hr />
          <div className="flex-between">
            <span>Total</span>
            <span>{Number(amount) + fee}</span>
          </div>
          {/* error if balance is too low */}
          {InvalidAmount ? <p className="error">Insufficient balance</p> : null}
          <div className="back-or-forward">
            <div></div>
            <button
              onClick={() => setPage(1)}
              disabled={
                page == 0
                  ? InvalidAmount || to.length == 0 || InvalidToAddress
                  : false
              }
            >
              Next
            </button>
          </div>
        </>
      ) : page == 1 ? <>
        <h1>Confirm Transfer</h1>
        <p style={{
            textAlign: "center",
            wordBreak: "break-all"
        }}>You are sending <b>{amount}</b> TAO to <b>{to}</b></p>
        <div className="back-or-forward">
            <div></div>
            <button
              onClick={() => StartTransfer()}
              style={{width: 'max-content'}}
            >
              Send TAO
            </button>
          </div>
      </> : <>
        <h1>Transfer Successful</h1>
        <p style={{
            textAlign: "center",
        }}>You have successfully sent <b>{amount}</b> TAO to <b>{to}</b></p>
        <p>
            You can view your tx <a href={`https://explorer.nakamoto.opentensor.ai/#/explorer/query/${hash}`} target="_blank">here</a>
        </p>
        <div className="back-or-forward">
            <div></div>
            <button
                onClick={() => {
                    setHash("");
                    onClose();
                }}
            >
                Close
            </button>
        </div>
        </>
        }
    </div>
  );

  async function StartTransfer() {
    const tx = await firstValueFrom($api).then(api => {
        return api.tx.balances.transfer(to, Math.floor(parseFloat(amount) * Math.pow(10, 9))).signAndSend(keypair).then(result => {
            setHash(result.toString())
            setPage(2);
        });
    })
  }
}
