import React from "react";
import "./LoadOrCreateAccount.scss";
import { SVGLogo } from "./SVGLogo";
import { generateMnemonic, validateMnemonic } from "bip39";
import {Portal} from 'react-portal'
import { Popup } from "./Popup";
import { SaveNewAccountInfo } from "./SaveNewAccountInfo";
import { Seperator } from "./Seperator";


export const LoadOrCreateAccount = () => {
  const [mnemonic, setMnemonic] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [isNew, setIsNew] = React.useState<boolean>(false);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);

  return (
    <>
    <div
      className="flex-center"
      style={{
        maxHeight: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        width: "max-content",
      }}
    >
      <button onClick={CreateAccountMnemonic}>Create New Account</button>
          {Seperator()}
          <div className="flex-center" style={{ width: "100%" }}>
            <textarea
              onChange={(e) => setMnemonic(e.target.value)}
              placeholder="Enter Backup Mnemonic"
            />
            <button disabled={!validateMnemonic(mnemonic)} onClick={() => {
              setIsLoaded(true);
            }}>Load Account</button>
          </div>
    </div>
    {mnemonic && (isNew || isLoaded) ? <Popup close={Back}>
      <SaveNewAccountInfo defaultPage={isLoaded ? 1 : 0} back={Back} mnemonic={mnemonic} />
    </Popup> : null}
    </>
  );

  function Back() {
    setMnemonic("");
    setIsNew(false);
    setError("");
  }

  function CreateAccountMnemonic() {
    console.log("Generating!!!")
    let newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    setIsNew(true);
  }
};

