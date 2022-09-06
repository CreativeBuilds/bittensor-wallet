import React, { useEffect } from "react";
import { LoadOrCreateAccount } from "./components/LoadOrCreateAccount";
import { useAccounts } from "./_hooks/useAccounts";
import "./app.scss";
import { SVGLogo } from "./components/SVGLogo";
import { UnlockAccount } from "./components/UnlockAccount";
import { STARTED_AT } from "./utils/initalized";
import { Home } from "./components/Home";

() => STARTED_AT;

export default () => {

  const {accounts, keypairs} = useAccounts();
  const [selectedAccount, setSelectedAccount] = React.useState<string>("");
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

  useEffect(() => {
    // check keypairs for selectedAccount
    if (keypairs.length == 0) return setLoggedIn(false);
    if (keypairs.find((keypair) => keypair.address == selectedAccount)) {
      setLoggedIn(true);
    } else {
      setSelectedAccount(keypairs[0].address);
    }
  }, [keypairs, selectedAccount]);

  return (
    <div className="flex-center" style={{height: 'inherit'}}>
      <div id="header">
        <SVGLogo id="logo"/>
      </div>
      <div id="content" className="flex-center" style={{width: "inherit", height: "inherit"}}>
    {
      accounts.length == 0 ?
        <LoadOrCreateAccount /> :
        !loggedIn ?
        <UnlockAccount keypairs={keypairs} accounts={accounts} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount}/> :
        <Home accounts={accounts} selectedAccount={selectedAccount} keypairs={keypairs} />
    }
    </div>
    </div>
  );
};
