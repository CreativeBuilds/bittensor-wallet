import { generateMnemonic } from 'bip39';
import React from 'react';
import { encrypt } from '../utils/crypto';
import { addAccount, createPair } from '../utils/provider';
import './SaveNewAccountInfo.scss';

export function SaveNewAccountInfo({
    back,
    defaultPage,
    mnemonic,
}: {
    back: () => void;
    defaultPage?: number;
    mnemonic: string;
}) {
    const maxPage = 2;

    const [timeLeft, setTimeLeft] = React.useState<number>((defaultPage || 0) > 0 ? 0 : 8);
    const [page, setPage] = React.useState<number>(defaultPage || 0);
    const [password, setPassword] = React.useState<string>("");
    const [confirmPassword, setConfirmPassword] = React.useState<string>("");
    const [accountName, setAccountName] = React.useState<string>("Default");
    const [copied, setCopied] = React.useState<boolean>(false);

    React.useEffect(() => {
        if(timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(timeLeft - 0.1);
        }, 100);
        return () => clearInterval(interval);
    }, [timeLeft]);

    React.useEffect(() => {
        if(copied) 
            setTimeout(() => {
                setCopied(false);
            }, 2500);
    }, [copied]);


    return <>
        {page === 0 ? <>
            <h1>
            New Key
        </h1>
        <p>
            This is your accounts recovery key, 
            please write this 12 word mnemonic down and keep it safe.
        </p>

        <div className="mnemonic">
            {mnemonic.split(" ").map((word, i) => <>
            {" "}
            <span key={i}>{word}</span>
            </>)}
        </div></> : page === 1 ? <>
            <h1>
                Set Password
            </h1>
            <p>
                Please enter a password to encrypt your account.
            </p>
            <div className="flex-center" style={{width: '100%'}}>
            <input value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <input value={confirmPassword} type="password" onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />

            {password !== confirmPassword && confirmPassword.length > 0 ? <p>Passwords do not match</p> : password.length < 8 ? <p>Password must be at least 8 characters</p> : null}
            </div>
        </> : page === 2 ? <>
            <h1>
                Set Name
            </h1>
            <p>
                Please enter a name for your account.
            </p>
            <div className="flex-center" style={{width: '100%'}}>
            <input value={accountName} type="text" onChange={e => setAccountName(e.target.value)} placeholder="Default" />
            </div>
            </>
            : null
            }

        <div className="back-or-forward">
            
                <button disabled={page == 0} onClick={() => setPage(page - 1)}>
                Back
            </button>
            
            {
                page == 0 ? <button disabled={copied} onClick={() => {navigator.clipboard.writeText(mnemonic);setCopied(true);}}>
                {copied ? "Copied!" : "Copy"}
                </button> : null
            }
            <button disabled={timeLeft > 0 || (page == 1 && (password !== confirmPassword || password.length < 8))} onClick={() => page + 1 <= maxPage ? setPage( page + 1) : FinishAccountCreation(mnemonic, password, accountName)}>
                {timeLeft > 0 ? `${timeLeft.toFixed(1)}s` : "Next"}
            </button>
        </div>
    </>

    
}

async function FinishAccountCreation(mnemonic: string, password: string, accountName: string) {
    // encrypt mnemonic with password
    // save to local storage
    // add mnemonic to accounts
    
    let pair = await createPair(mnemonic);
    let encrypted = encrypt(mnemonic, password);
    let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    accounts.push({
        address: pair.address,
        name: accountName,
        encryptedMnemonic: encrypted,
    });
    localStorage.setItem("accounts", JSON.stringify(accounts));
    console.log(JSON.parse(localStorage.getItem("accounts") || "[]"), "accounts");
    addAccount(pair);
    console.log("Finished");
    
}