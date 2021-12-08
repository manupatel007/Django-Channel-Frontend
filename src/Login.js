import { useNavigate } from "react-router"; //used for page redirection

import { Link } from "react-router-dom";

export default function Login() {
  function sendData(e) {
    var ok = false;
    e.preventDefault();
    // console.log(e.target.username.value);
    fetch("https://Django-Channels.vishwas007.repl.co/token/", {
      // Adding method type
      method: "POST",

      // Adding body or contents to send
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value
      }),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json"
      }
    })
      // Converting to JSON
      .then((response) => {
        // console.log(response.status);
        if (response.status === 200) {
          // console.log("yes");
          ok = true;
        }
        return response.json();
      })

      // Displaying results to console
      .then((json) => {
        // console.log(json);
        // if (!json.ok) {
        //   throw Error(json);
        // }
        // console.log(json);
        if (ok) {
          localStorage.setItem(
            "login",
            JSON.stringify({
              login: true,
              token: json.access,
              username: json.username
            })
          );
        }
      })
      .then(() => {
        if (ok) {
          redirect();
        } else {
          alert("Please enter correct username/password");
        }
      })
      .catch((error) => console.log(error));
  }

  const history = useNavigate();

  const redirect = () => {
    history("/infinite");
  };

  return (
    <div id="formArea" className="container">
      <form onSubmit={(e) => sendData(e)}>
        <input type="text" name="username" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <input type="submit" />
      </form>
    </div>
  );
}
