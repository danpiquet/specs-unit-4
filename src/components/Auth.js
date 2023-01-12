import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/authContext.js";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(true);

  // const baseUrl = "https://socialmtn.devmountain.com";

  const authCtx = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();

    const bodyObj = { username, password };

    axios
      .post(register ? `/register` : `/login`, bodyObj)
      .then((res) => {
        console.log("AFTER AUTH", res.data);
        authCtx.login(res.data.token, res.data.exp, res.data.userId);

        console.log(res.data);
      })
      .catch((err) => {
        // setMessage(err.response.data);
        // setDisplay("block");
        setPassword("");
        setUsername("");
        console.log(err);
        alert(`Sorry, but we failed to register/log in username: ${username}`);
      });
    setRegister(!register);
    console.log("submitHandler called");
    console.log(bodyObj);
  };

  return (
    <main>
      <h1>Welcome!</h1>
      <form className="form auth-form" onSubmit={submitHandler}>
        <input
          className="form-input"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="form-input"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="form-btn">{register ? "Sign Up" : "Login"}</button>
      </form>
      <button className="form-btn">
        Need to {register ? "Login" : "Sign Up"}?
      </button>
    </main>
  );
};

export default Auth;
