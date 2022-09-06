import React from "react";
import { Portal } from "react-portal";
import styled from "styled-components";
import "./Popup.scss"

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at center,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.3) 90%, rgba(0,0,0,0.4));

    opacity: 0;

    // fade in
    animation: fadeIn 0.3s ease-in forwards;
    @keyframes fadeIn {
        0% { opacity: 0; radial-gradient(ellipse at center,rgba(0,0,0,0) 0%,rgba(0,0,0,0) 90%, rgba(0,0,0,0)); }
        100% { opacity: 1; radial-gradient(ellipse at center,rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.3) 90%, rgba(0,0,0,0.4)); }
    }
`;

const Content = styled.div`
  width: max-content;
  height: max-content;
  max-width: min(45ch, calc(100vw - 2em));
  min-width: min(35ch, calc(100vw - 2em));
  overflow: auto;
  background: #f3f3f3;
  border-radius: 0.5em;
  padding: 1em;
  opacity: 0;
  position: relative;
  z-index: 2;

  // fade in up
  animation: fadePopupInUp 0.3s ease-in forwards;
  animation-delay: 0.3s;

  @keyframes fadePopupInUp {
    0% {
      opacity: 0;
      transform: translateY(1em);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export function Popup(props: {
  children: React.ReactNode;
  close?: () => void;
  ignoreBackground?: boolean;
}) {
  return (
    <Portal node={document.body}>
      <Overlay
        className="flex-center"
        onClick={
          props.close && !props.ignoreBackground
            ? (props.close as any)
            : undefined
        }
      />
      <div className="flex-center" style={{
        position: "fixed",
        height: "100%",
        width: "100%",
        top: 0,
        left: 0,
      }}>
        <div style={{
            position: 'relative',
            width: "max-content",
            height: "max-content",
        }}>
          <Content className="flex-center popup-content">{props.children}</Content>
          {props.close ? (
            <button
            onClick={props.close}
            style={{
              position: "absolute",
              top: "-1em",
              right: "-1em",
              padding: "1em",
              borderRadius: "50%",
              zIndex: 3
            }}
            className="flex-center close-button"
          >
            x
          </button>
          ) : null}
        </div>
      </div>
    </Portal>
  );
}
