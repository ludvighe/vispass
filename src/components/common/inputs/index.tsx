import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  onMount,
} from "solid-js";
import "./index.scss";

declare interface VisInputAction {
  icon: any;
  title?: string;
  onClick?: () => void;
}

declare interface VisInput {
  accessor: Accessor<any>;
  onClear?: () => void;
}

declare interface VisInputAddons {
  actions: VisInputAction[];
}

const InputAction = ({ icon, title, onClick }: VisInputAction) => {
  return (
    <button class="vis-input-action" title={title} onClick={onClick}>
      <span>{icon}</span>
    </button>
  );
};

export const Input = ({
  accessor,
  onClear,
  ...inputProps
}: VisInput & JSX.InputHTMLAttributes<HTMLInputElement>) => {
  let ref: HTMLInputElement | ((el: HTMLInputElement) => void) | undefined;
  const [activeType, setActiveType] = createSignal(inputProps.type);

  const addons: Accessor<VisInputAddons> = createMemo(() => {
    let actions = [];
    if (onClear) {
      actions.push({
        icon: "x",
        title: `Clear ${inputProps.type}`,
        onClick: onClear,
      });
    }
    if (inputProps.type === "password") {
      actions.push({
        icon: "⚿",
        title: activeType() === "password" ? "Show password" : "Hide password",
        onClick: () =>
          setActiveType(activeType() === "password" ? "text" : "password"),
      });
    }

    return {
      actions,
    };
  });

  createEffect(() => {
    if (ref) {
      (ref as HTMLInputElement).value = accessor();
    }
  });

  return (
    <span class="vis-input">
      <input {...{ ...inputProps, type: activeType() }} ref={ref}></input>
      <div class="actions">
        {addons().actions.map((action) => (
          <InputAction {...action} />
        ))}
      </div>
    </span>
  );
};
