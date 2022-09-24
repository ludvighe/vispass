import { Route, Router, Routes } from "@solidjs/router";
import PasswordManagerPage from "./components/pages/password-manager-page";

const PageRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<PasswordManagerPage />} />
      </Routes>
    </Router>
  );
};

export default PageRouter;
