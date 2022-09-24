import { createEffect, createSignal, JSX } from "solid-js";
import { generateSalt } from "../../../../../services/cryptography";
import { Button, IconButton } from "../../../../common/buttons";
import {
  deletePassword,
  passmanStore,
  Password,
  savePassword,
} from "../../state";
import PasswordList from "../password-list";
import "./index.scss";

export default ({ password }: { password: Password }) => {
  const { setComponent } = passmanStore;
  const [editedPassword, setEditedPassword] = createSignal(password);
  //   createEffect(() => {
  //     console.log(editedPassword());
  //   });
  const dateString = (date: Date) =>
    `${date.toLocaleDateString("sv-SE")} ${date.toLocaleTimeString("sv-SE")}`;

  const handleOnSave = () => {
    const newPassword = { ...editedPassword(), updated: new Date() };
    setEditedPassword(newPassword);
    savePassword(newPassword);
    setComponent(<PasswordList />);
  };

  const handleOnDelete = () => {
    deletePassword(editedPassword());
    setComponent(<PasswordList />);
  };

  const handleOnRegenerateSalt = () => {
    setEditedPassword({ ...editedPassword(), salt: generateSalt() });
  };

  return (
    <div class="passman-pw-details-page">
      <Button
        buttonStyle="vis-button-transparent"
        onClick={() => setComponent(<PasswordList />)}
        style={{ width: "max-content" }}
      >
        ‹ Back to passwords
      </Button>
      <header>
        <input
          id="title-input"
          value={editedPassword().title}
          onInput={(e: any) =>
            setEditedPassword({ ...editedPassword(), title: e.target.value })
          }
        />
      </header>
      <div class="dates-container">
        <label>Created</label>
        <span>{dateString(editedPassword().created)}</span>
        <label>Updated</label>
        <span>{dateString(editedPassword().updated)}</span>
        <label>
          {editedPassword().lastUsed === null ? "Never used" : "Last used"}
        </label>
        <span>
          {editedPassword().lastUsed !== null &&
            dateString(editedPassword().lastUsed!)}
        </span>
      </div>
      <Field label="Description">
        <textarea
          id="description-textarea"
          value={editedPassword().description}
          onInput={(e: any) =>
            setEditedPassword({
              ...editedPassword(),
              description: e.target.value,
            })
          }
        />
      </Field>
      <Field label="Length">
        <div class="length-input-container">
          <input
            id="length-number"
            type="number"
            min="1"
            max="1024"
            value={editedPassword().length}
            onInput={(e: any) =>
              setEditedPassword({
                ...editedPassword(),
                length: parseInt(e.target.value),
              })
            }
          />
          <input
            id="length-rangeslider"
            type="range"
            min="1"
            max="1024"
            value={editedPassword().length}
            onInput={(e: any) =>
              setEditedPassword({
                ...editedPassword(),
                length: parseInt(e.target.value),
              })
            }
          />
        </div>
      </Field>
      <details class="advanced-details-container">
        <summary>Advanced settings</summary>
        <div class="advanced-details">
          <div class="id-label">ID: #{editedPassword().id}</div>
          <Field label="Iterations">
            <div class="iteration-container">
              <input
                id="iteration-input"
                type="number"
                min="1"
                max="1024"
                value={editedPassword().iterations}
                onInput={(e: any) =>
                  setEditedPassword({
                    ...editedPassword(),
                    iterations: parseInt(e.target.value),
                  })
                }
              />
              {editedPassword().iterations > 1024 && (
                <span>Beware excessive iterations (max 1024 recommended)</span>
              )}
            </div>
          </Field>
          <Field label="Salt">
            <div class="salt-container">
              <input
                id="salt-input"
                type="text"
                value={editedPassword().salt}
                onInput={(e: any) =>
                  setEditedPassword({
                    ...editedPassword(),
                    salt: e.target.value,
                  })
                }
              />
              <div class="salt-actions">
                <Button
                  title="Regenerate"
                  buttonStyle="vis-button-transparent"
                  onClick={handleOnRegenerateSalt}
                >
                  Regenerate
                </Button>
              </div>
            </div>
          </Field>
        </div>
      </details>
      <div class="pw-actions-container">
        <Button onClick={handleOnSave}>🖫 SAVE</Button>
        <Button
          onClick={handleOnDelete}
          style={{ "background-color": "var(--clr-error)" }}
        >
          ⨯ DELETE
        </Button>
      </div>
    </div>
  );
};

const Field = ({
  children,
  label,
}: {
  children: JSX.Element;
  label: string;
}) => {
  return (
    <div class="pw-details-field">
      <header>
        <label>{label}</label>
      </header>
      <div>{children}</div>
    </div>
  );
};
