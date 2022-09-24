import { createSignal, onMount } from "solid-js";
import { Button } from "../../../../common/buttons";
import { InfoComponent } from "../../../../common/help";
import { Input } from "../../../../common/inputs";
import { Loader } from "../../../../common/loaders";
import {
  createState,
  fetchSavedStates,
  login,
  passmanStore,
} from "../../state";
import "./index.scss";
import {
  SaveStateComponent,
  SaveStateFileChooser,
} from "./save-state-component";

export default () => {
  // States
  const { currentSavedState } = passmanStore;
  const [password, setPassword] = createSignal<string | any>("");

  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [status, setStatus] = createSignal("Initializing password manager...");

  // Effects
  onMount(() => {
    setLoading(true);
    setStatus("Fetching logins");
    fetchSavedStates().finally(() => {
      setLoading(false);
      setStatus("");
    });
  });

  // Handlers
  const handleOnCreateState = async () => {
    createState();
  };

  const handleOnLogin = () => {
    if (loading()) return;
    if (password().length === 0) {
      setError("Invalid password");
      return;
    }
    if (password().length === 0) {
      setError("Invalid password");
      return;
    }
    if (currentSavedState() === null) {
      setError("A key store must be selected");
      return;
    }

    setLoading(true);
    setError(null);

    if (currentSavedState() !== null) {
      try {
        login(password(), currentSavedState()!);
      } catch (e) {
        setError("Could not decrypt passwords.");
      }
      setLoading(false);
      setStatus("");
    } else {
      setLoading(false);
      setStatus("");
    }
  };

  const handleOnLoginKeypress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleOnLogin();
    }
  };

  // Render
  return (
    <div
      id="passman-login-page"
      class="passman-login-page"
      onKeyPress={handleOnLoginKeypress}
    >
      <div class="passman-login-container">
        {currentSavedState() !== null ? (
          <>
            {/* LOCAL STORAGE */}
            <SaveStateComponent />
            {/* UPLOAD STORAGE */}
            <SaveStateFileChooser />

            {currentSavedState().passwords === null && (
              <>
                <InfoComponent>
                  This is a new key store without any saved passwords.
                </InfoComponent>
                <InfoComponent>
                  The password you now use to log in will become the master
                  password for this key store.
                </InfoComponent>
              </>
            )}

            {/* LOGIN */}
            <div>
              <label>Password</label>
              <Input
                class="password-input"
                accessor={password}
                onInput={(e: any) => setPassword(e.target.value)}
                onClear={() => setPassword("")}
                type="password"
                autofocus
              />
            </div>

            <Button id="login-btn" loading={loading} onClick={handleOnLogin}>
              LOGIN
            </Button>
            {loading() && <Loader status={status} />}
            {error() !== null && <h4 class="error-message">{error()}</h4>}
          </>
        ) : (
          /** CREATE IF NO STATES FOUND */
          <div class="create-save-state-component">
            <h4>No key stores found</h4>
            <Button onClick={handleOnCreateState}>Create new key store</Button>
            <p>or</p>
            <SaveStateFileChooser />
          </div>
        )}
      </div>
    </div>
  );
};
