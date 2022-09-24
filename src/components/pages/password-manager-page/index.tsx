import { createEffect, JSX, onMount } from "solid-js";
import PasswordLogin from "./components/login";
import { passmanStore } from "./state";
import "./index.scss";
import PasswordList from "./components/password-list";

export default () => {
  return (
    <div class="passman-container">
      <PasswordComponentRouter />
    </div>
  );
};

const PasswordComponentRouter = () => {
  const { Component } = passmanStore;
  const reroute = (component: JSX.Element) => {
    passmanStore.setComponent(component);
  };
  createEffect(() => {
    if (passmanStore.masterPassword() === null) {
      reroute(<PasswordLogin />);
    } else {
      reroute(<PasswordList />);
    }
  });

  return (
    <div class="passman-component-wrapper">{Component() && Component()}</div>
  );
};
