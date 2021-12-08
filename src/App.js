import "./styles.css";

// import { useHistory } from "react-router"; //used for page redirection
import { Link, useNavigate } from "react-router-dom";

export default function App() {
  // const history = useHistory();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.room.value);
    navigate("/room", { state: e.target.room.value });
    // history.push({
    //   pathname: "/room",
    //   state: { happy: true } // your data array of objects
    // });
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="room" id="room" />
        <input type="submit" />
      </form>
    </div>
  );
}
