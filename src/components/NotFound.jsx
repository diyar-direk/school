import { useCallback } from "react";

import Button from "../components/buttons/Button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const nav = useNavigate();
  const handleBackHome = useCallback(() => nav("/"), [nav]);

  return (
    <main>
      <div className="container center flex-direction">
        <div className="flex gap-10">
          <img src={require("./404.png")} alt="" />
          <h1 className="error-404">ops the page not found</h1>
        </div>
        <Button onClick={handleBackHome}>back to home</Button>
      </div>
    </main>
  );
};

export default NotFound;
