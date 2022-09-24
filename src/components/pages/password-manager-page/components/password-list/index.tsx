import { createSignal, For } from "solid-js";
import {
  enableLoadingOverlay as addLoadingOverlay,
  removeLoadingOverlay,
} from "../../../../../services/utils";
import { Button } from "../../../../common/buttons";
import {
  createNewPassword,
  generatePasswordHash,
  logout,
  passmanStore,
  Password,
  saveState,
} from "../../state";
import PasswordDetails from "../password-details";
import "./index.scss";

export default () => {
  const { setComponent } = passmanStore;
  const handleOnCreatePassword = () => {
    const newPassword = createNewPassword();
    setComponent(<PasswordDetails password={newPassword} />);
  };
  return (
    <div class="passman-list-page">
      <header>
        <Button buttonStyle="vis-button-transparent" onClick={() => logout()}>
          ‹ LOGOUT
        </Button>
        <div class="list-page-top-actions">
          <Button onClick={handleOnCreatePassword}>+ NEW PASSWORD</Button>
          <Button onClick={() => saveState(true)}>🡇 BACKUP</Button>
        </div>
      </header>
      <PasswordList />
    </div>
  );
};

const PasswordList = () => {
  const { passwords } = passmanStore;

  return (
    <div class="passman-list" id="passman-list">
      <For fallback="No saved passwords" each={passwords()}>
        {(password) => <PassmanListItem password={password} />}
      </For>
    </div>
  );
};

const PassmanListItem = ({ password }: { password: Password }) => {
  removeLoadingOverlay();

  const { setComponent } = passmanStore;
  const [loading, setLoading] = createSignal(false);
  const lastUsed =
    password.lastUsed === null
      ? "Never used"
      : "Last used " +
        password.lastUsed.toLocaleDateString("sv-SE") +
        " " +
        password.lastUsed.toLocaleTimeString("sv-SE");

  const handleOnCopyPassword = () => {
    if (loading()) return;
    addLoadingOverlay("passman-list");
    setLoading(true);
    setTimeout(() => {
      const hash = generatePasswordHash(password);
      navigator.clipboard.writeText(hash);
    }, 500);
  };

  return (
    <div class="passman-list-item">
      <div class="description">
        <h4>{password.title}</h4>
        <label>{lastUsed}</label>
      </div>
      <div class="actions">
        <Button
          buttonStyle="vis-button-transparent"
          onClick={() => setComponent(<PasswordDetails password={password} />)}
          style={{ width: "50px" }}
        >
          Edit
        </Button>
        <Button
          buttonStyle="vis-button-transparent"
          onClick={handleOnCopyPassword}
          loading={loading}
          style={{ width: "50px" }}
        >
          Copy
        </Button>
      </div>
    </div>
  );
};
