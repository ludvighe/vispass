import { Accessor, createEffect, createSignal } from "solid-js";
import { Button } from "../../../../../common/buttons";
import { fetchSavedStates, passmanStore, SavedState } from "../../../state";
import "./index.scss";

export const SaveStateComponent = () => {
  const { currentSavedState } = passmanStore;

  if (currentSavedState() === null) return <></>;
  return (
    <div
      class="saved-state-component"
      title={`Last updated ${currentSavedState().meta.lastUpdated.toDateString()}`}
      style={{ "border-color": "var(--clr-primary)" }}
    >
      <header>
        <h4>Key store</h4>
        <span>#{currentSavedState().id}</span>
      </header>
    </div>
  );
};

export const SaveStateFileChooser = () => {
  const handleOnFileSelect = async (e: any) => {
    const file: File = e.target.files[0];
    fetchSavedStates(file);
  };
  return (
    <div class="saved-state-file-chooser-component">
      <label class="file-chooser-input">
        <input type="file" onInput={handleOnFileSelect} />
        Choose .pass file
      </label>
    </div>
  );
};
