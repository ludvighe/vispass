import { Accessor, JSX } from "solid-js";
import { PropAliases } from "solid-js/web";
import { SimpleLoader } from "../loaders";
import "./index.scss";

type ButtonClass = "vis-button-primary" | "vis-button-transparent";

interface VisButton {
  loading?: Accessor<boolean> | null;
  loadingIcon?: JSX.Element;
  buttonStyle?: ButtonClass;
}

export const Button = ({
  loading = null,
  loadingIcon = <SimpleLoader />,
  children,
  buttonStyle: buttonClass = "vis-button-primary",
  ...props
}: VisButton & JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button class={`vis-button ${buttonClass}`} {...props}>
      {loading !== null && loading() ? loadingIcon : children}
    </button>
  );
};

interface VisIconButton {
  icon?: any;
  buttonClass?: ButtonClass;
}

export const IconButton = ({
  icon,
  buttonClass = "vis-button-transparent",
  ...props
}: VisIconButton & JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button class={`vis-icon-button ${buttonClass}`} {...props}>
      {icon}
    </button>
  );
};
