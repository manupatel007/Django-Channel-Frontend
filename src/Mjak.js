import React from "react";

class Mjak extends React.Component {
  constructor() {
    super();
    this.state = { chats: [] };
    this.page = 1;
  }
  // instance of websocket connection as a class property
  ws = new WebSocket("wss://django-channels.vishwas007.repl.co/ws/chat/hello/");

  componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log("connected");
    };

    this.ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data);
      this.setState({ dataFromServer: message });
      console.log(message);
    };

    this.ws.onclose = () => {
      console.log("disconnected");
      // automatically try to reconnect on connection loss
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e.target.msg.value);
    let message = "hs mt bhai";
    this.ws.send(
      JSON.stringify({
        message: message
      })
    );
    // history.push({
    //   pathname: "/room",
    //   state: { happy: true } // your data array of objects
    // });
  };

  test = () => {
    fetch(
      "https://django-channels.vishwas007.repl.co/chat/test/?page=" + this.page
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        this.page += 1;
        this.setState({ chats: [...this.state.chats, ...data.results.data] });
      });
  };

  render() {
    return (
      <div>
        {this.state.chats.length === 0
          ? "Loading chats..."
          : this.state.chats.map((chat) => <p>{chat.message}</p>)}
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="msg" />
          <input type="submit" />
        </form>
        <button onClick={this.test}>Click To Load Chats</button>
      </div>
    );
  }
}

export default Mjak;
