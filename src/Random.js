import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "./styles.css";

var TOTAL_PAGES = 9;

const Random = () => {
  let valueee = JSON.parse(localStorage.getItem("login"));
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [lastElement, setLastElement] = useState(null);
  const webSocket = useRef(null);
  const [token, setToken] = useState(valueee.token);
  const [username, setUsername] = useState(valueee.username);
  const messagesEndRef = useRef(null);
  // const [direction, setDirection] = useState("right");
  // const Chat = () => {
  //   const [messages, setMessages] = useState([]);
  //   const webSocket = useRef(null);

  //   useEffect(() => {
  //     webSocket.current = new WebSocket("ws://url");
  //     webSocket.current.onmessage = (message) => {
  //       setMessages((prev) => [...prev, message.data]);
  //     };
  //     return () => webSocket.current.close();
  //   }, []);
  //   return <p>{messages.join(" ")}</p>;
  // };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPageNum((no) => no + 1);
      }
    })
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e.target.msg.value);
    let message = e.target.msg.value;
    webSocket.current.send(
      JSON.stringify({
        message: message,
        username: username
      })
    );
    e.target.reset();
    scrollToBottom();
  };

  const callUser = async () => {
    // console.log(token, "hahaha");
    setLoading(true);
    let response = await axios.get(
      `https://django-channels.vishwas007.repl.co/chat/test/?page=${pageNum}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    // console.log(response.data);
    let finalData = [...response.data.results.data];
    finalData.reverse();
    let all = new Set([...finalData, ...allUsers]);
    setAllUsers([...all]);
    setLoading(false);
  };

  useEffect(() => {
    if (pageNum <= TOTAL_PAGES) {
      callUser();
    }
  }, [pageNum]);

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  useEffect(() => {
    webSocket.current = new WebSocket(
      `wss://django-channels.vishwas007.repl.co/ws/chat/hello/?token=${token}`
    );
    webSocket.current.onmessage = (message) => {
      message = JSON.parse(message.data);
      console.log(message);
      setAllUsers((prev) => [...prev, message]);
      scrollToBottom();
    };
    return () => webSocket.current.close();
  }, []);

  const ChatCard = ({ data }) => {
    var direction = "right";
    if (data.sender === username) {
      direction = "left";
    }
    return (
      <div>
        <div className="message-block">
          <div
            style={{
              float: direction,
              marginRight: "18px"
            }}
          >
            {data.sender}
          </div>
          <div
            className="message"
            style={{
              float: direction,
              marginRight: "18px",
              color: "white",
              backgroundColor: "#3B2A50",
              padding: "15px"
            }}
          >
            {data.message}
          </div>
          <span
            style={{
              float: direction,
              marginRight: "18px"
            }}
          >
            {data.chatdate}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>Simple Room</h1>

      {loading && <p className="text-center">loading...</p>}

      {pageNum - 1 === TOTAL_PAGES && <p>You have reached at end</p>}

      <div>
        {allUsers.length > 0 &&
          allUsers.map((chat, i) => {
            return i === 0 && !loading && pageNum <= TOTAL_PAGES ? (
              <div key={i} ref={setLastElement}>
                <ChatCard data={chat} />
              </div>
            ) : (
              <ChatCard data={chat} key={i} />
            );
          })}
      </div>

      <form onSubmit={handleSubmit}>
        <input type="text" name="msg" />
        <input type="submit" />
      </form>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Random;
