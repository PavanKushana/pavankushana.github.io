// Interview.jsx: "Interview me". Recruiters tap a question; it appears as their message, I'm "typing" for a
// moment, and my answer streams in word by word like a chat. Every answer is a real one from content.js
// (nothing is generated, no AI service is called). Asked questions are ticked off; "Start over" clears it.
import { useCallback, useEffect, useRef, useState } from "react";
import Head from "./Head";
import Photo from "./Photo";
import { interview, person } from "../content";
import { CheckIcon } from "./Icons";
import "./Interview.css";

const HELLO = { from: "me", text: `Hi, I'm ${person.firstName}. Pick a question and I'll answer. These are my real answers.` };
const WORD_MS = 38; // how fast an answer streams in

/** One message. A new answer from me streams in word by word (unless reduced motion), then stays. */
function Message({ from, text, stream, reduced, onGrow }) {
  const words = text.split(" ");
  const [count, setCount] = useState(stream && !reduced ? 0 : words.length);

  useEffect(() => {
    if (count >= words.length) return undefined;
    const timer = setTimeout(() => {
      setCount((n) => n + 1);
      onGrow();
    }, WORD_MS);
    return () => clearTimeout(timer);
  }, [count, words.length, onGrow]);

  return (
    <li className={`msg msg--${from}`}>
      <p>
        {words.slice(0, count).join(" ")}
        {count < words.length && <span className="msg__caret" aria-hidden="true" />}
      </p>
    </li>
  );
}

export default function Interview({ reduced }) {
  const [messages, setMessages] = useState([HELLO]);
  const [asked, setAsked] = useState([]);
  const [typing, setTyping] = useState(false);
  const log = useRef(null);
  const timer = useRef(0);

  /** Keeps the newest message in view inside the chat window (stable, so streaming isn't restarted). */
  const toBottom = useCallback(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, []);
  useEffect(toBottom, [messages, typing]);
  useEffect(() => () => clearTimeout(timer.current), []);

  /** Asks question i: shows it, "types" a moment (longer for longer answers), then streams the answer. */
  const ask = (i) => {
    if (typing) return;
    const { q, a } = interview[i];
    setAsked((list) => (list.includes(i) ? list : [...list, i]));
    setMessages((list) => [...list, { from: "you", text: q }]);
    if (reduced) {
      setMessages((list) => [...list, { from: "me", text: a }]);
      return;
    }
    setTyping(true);
    timer.current = setTimeout(() => {
      setTyping(false);
      setMessages((list) => [...list, { from: "me", text: a, stream: true }]);
    }, 650 + Math.min(a.length * 3, 900));
  };

  /** Clears the chat back to the first hello. */
  const restart = () => {
    clearTimeout(timer.current);
    setTyping(false);
    setMessages([HELLO]);
    setAsked([]);
  };

  return (
    <section id="interview" className="section interview">
      <div className="container">
        <Head num={5} label="Interview me" title="Ask what you'd ask in an interview" />

        <div className="interview__grid">
          <div className="interview__questions" data-reveal>
            <p className="interview__lead">Tap a question:</p>
            <ul>
              {interview.map(({ q }, i) => (
                <li key={q}>
                  <button type="button" className={`question${asked.includes(i) ? " is-asked" : ""}`} onClick={() => ask(i)}
                    disabled={typing}>
                    <span className="question__box" aria-hidden="true">{asked.includes(i) && <CheckIcon />}</span>
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="chat" data-reveal>
            <div className="chat__head">
              <Photo slot="portrait" shape="circle" accent={0} bare className="chat__avatar" />
              <div>
                <p className="chat__name">{person.name}</p>
                <p className="chat__sub mono">answers from my CV and projects</p>
              </div>
              <button type="button" className="chat__restart mono" onClick={restart} disabled={messages.length === 1}>
                Start over
              </button>
            </div>
            <ol className="chat__log" ref={log} data-lenis-prevent role="log" aria-live="polite" aria-label="Chat">
              {messages.map((message, i) => (
                <Message key={i} {...message} reduced={reduced} onGrow={toBottom} />
              ))}
              {typing && (
                <li className="msg msg--me msg--typing" aria-label="typing">
                  <span />
                  <span />
                  <span />
                </li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
