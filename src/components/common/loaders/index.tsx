import { Accessor, JSX } from "solid-js";
import "./index.scss";

type VisLoadingAnimation = "spin";
export const SimpleLoader = ({
  icon = "့",
  animation = "spin",
}: {
  icon?: any;
  animation?: VisLoadingAnimation;
}) => {
  return <div class={`vis-loading-icon ${animation}`}>{icon}</div>;
};
export const Loader = ({
  status,
  loader,
}: {
  status: Accessor<string>;
  loader?: JSX.Element | undefined;
}) => {
  return (
    <div class="vis-loader">
      {loader} {status()}
    </div>
  );
};
