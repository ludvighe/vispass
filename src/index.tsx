/* @refresh reload */
import { render } from "solid-js/web";

import "./index.scss";
import PageRouter from "./routes";

render(() => <PageRouter />, document.getElementById("root") as HTMLElement);
