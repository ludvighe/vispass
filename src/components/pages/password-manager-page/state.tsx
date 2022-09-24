import { Accessor, createSignal, JSX, Setter } from "solid-js";
import { createStore } from "solid-js/store";
import {
  decryptAES,
  encryptAES,
  generateSalt,
  generateSHAKE128Hash,
  generateUUID,
} from "../../../services/cryptography";
import { downloadTextFile } from "../../../services/utils";

export interface Password {
  id: string;
  title: string;
  description: string;

  iterations: number;
  length: number;
  salt: string;

  created: Date;
  updated: Date;
  lastUsed: Date | null;
}

interface PasswordManagerStore {
  passwords: Accessor<Password[]>;
  masterPassword: Accessor<string | null>;
  Component: Accessor<JSX.Element>;
  setComponent: Setter<JSX.Element>;
  currentSavedState: Accessor<any>;
}

// Password specific
const [passwords, setPasswords] = createSignal<Password[]>([]);
const [masterPassword, setMasterPassword] = createSignal<string | null>(null);

// Navigation
const [Component, setComponent] = createSignal<JSX.Element>(<></>);

// Storage
const [currentSavedState, setCurrentSavedState] =
  createSignal<SavedState | null>(null);

export const [passmanStore, setPassmanStore] = createStore({
  passwords,
  masterPassword,
  Component,
  setComponent,
  currentSavedState,
} as PasswordManagerStore);

export const createNewPassword = () => {
  // Create new default password
  const password: Password = {
    id: generateUUID(),
    title: "New password",
    description: "",

    iterations: 254,
    length: 64,
    salt: generateSalt(),

    created: new Date(),
    updated: new Date(),
    lastUsed: null,
  };
  setPasswords([...passwords(), password]);
  return password;
};

export const deletePassword = (password: Password) => {
  setPasswords(passwords().filter((pw) => pw.id !== password.id));
  saveState();
};

// Storage
const STORAGE_KEY = "passman-savestate";
const [meta, setMeta] = createSignal({
  localStorage: true,
  lastUpdated: new Date(),
});
export const fetchSavedStates = async (file?: File) => {
  let store = null;
  // File storage
  if (file) {
    try {
      const fileStore: SavedState = JSON.parse(await file.text());
      store = fileStore;
    } catch (e) {
      console.error("Could not parse file.");
    }
  } else {
    // Local storage
    store = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
  }

  setCurrentSavedState({
    ...store,
    meta: { ...store.meta, lastUpdated: new Date(store.meta.lastUpdated) },
  });
  // console.log(store);
  return store;
};

export const createState = () => {
  const state: SavedState = {
    id: generateUUID(),
    meta: meta(),
    passwords: null,
  };
  const encryptedState = JSON.stringify(state); // TODO: Encrypt with masterPassword()
  if (meta().localStorage) {
    window.localStorage.setItem(STORAGE_KEY, encryptedState);
  }
  setCurrentSavedState(state);
};

export const saveState = (download: boolean = false) => {
  if (
    passmanStore.masterPassword() === null ||
    passmanStore.masterPassword() === ""
  ) {
    throw "Invalid master password";
  }
  const state = {
    id: currentSavedState()?.id,
    meta: meta(),
    passwords: encryptAES(JSON.stringify(passwords()), masterPassword()!),
  };
  const encryptedState = JSON.stringify(state); // TODO: Encrypt with masterPassword()

  if (meta().localStorage) {
    window.localStorage.setItem(STORAGE_KEY, encryptedState);
  }
  // console.log("Saved key store");

  if (download && currentSavedState() !== null) {
    downloadTextFile(currentSavedState()!.id + ".pass", encryptedState);
  }
};

export interface SavedState {
  id: string;
  passwords: string | null; // Encrypted passwords
  meta: { localStorage: boolean; lastUpdated: Date };
}

export const login = (masterPassword: string, savedState: SavedState) => {
  let passwords: Password[] = [];
  if (savedState.passwords !== null) {
    // Decrypt passwords
    const decryptedPasswords = decryptAES(savedState.passwords, masterPassword);
    passwords = JSON.parse(decryptedPasswords);

    // Parse passwords
    passwords = passwords.map((password) => ({
      ...password,
      created: new Date(password.created),
      updated: new Date(password.updated),
      lastUsed: password.lastUsed !== null ? new Date(password.lastUsed) : null,
    }));
    setPasswords(passwords);
  }
  setMasterPassword(masterPassword);
};

export const logout = () => {
  setMasterPassword(null);
};

export const generatePasswordHash = (password: Password) => {
  // Set initial value of hash
  let hash = password + password.salt;

  // Iterate as many times as requested and rehash previous result
  for (let i = 1; i < password.iterations; i++) {
    hash = generateSHAKE128Hash(hash);
  }

  // Slice for correct length
  hash = hash.slice(0, password.length);

  // console.log("generatePasswordHash:", {
  //   password,
  //   salt: password.salt,
  //   saltLength: password.salt.length,
  //   length: password.length,
  //   iterations: password.iterations,
  //   hash,
  //   hashLength: hash.length,
  // });

  // Update used password
  setPasswords(
    passwords().map((pw: Password) => {
      if (pw.id === password.id) {
        return { ...password, lastUsed: new Date() };
      }
      return pw;
    })
  );

  saveState();
  return hash.slice(0, password.length);
};

export const savePassword = (password: Password) => {
  setPasswords(
    passwords().map((pw) => {
      if (pw.id === password.id) return { ...password, updated: new Date() };
      return pw;
    })
  );
  saveState();
};
