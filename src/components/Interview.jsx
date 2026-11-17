// Interview.jsx: "Interview me". Recruiters tap a question; it appears as their message, I'm "typing" for a
// moment, and my answer streams in word by word like a chat. Every answer is a real one from content.js
// (nothing is generated, no AI service is called). Asked questions are ticked off; "Start over" clears it.
// The chat remembers which questions were asked, not their words, so switching the language translates the
// whole conversation so far, not only what comes next.
import { useCallback, useEffect, useRef, useState } from "react";
import Head from "./Head";
import Photo from "./Photo";
import { fill, useContent } from "../hooks/language";
import { CheckIcon } from "./Icons";
import "./Interview.css";

// a message is { from: "me" | "you", hello: true } for my first hello, or { from, question: i, stream } for
// question i (from "you") and its answer (from "me")
const HELLO = { from: "me", hello: true };
const WORD_MS = 38; // how fast an answer streams in

/** One message. A new answer from me streams in word by word (unless reduced motion), then stays.
    count = how many words show; Infinity once the whole answer is out, so it stays whole when the language
    (and with it the number of words) changes. */
function Message({ from, text, stream, reduced, onGrow }) {
  const words = text.split(" ");
  const [count, setCount] = useState(stream && !reduced ? 0 : Infinity);

  useEffect(() => {
    if (count >= words.length) {
      if (count !== Infinity) setCount(Infinity); // finished streaming
      return undefined;
    }
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
  const { interview, person, ui } = useContent();
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

  /** The words of a message in the current language. */
  const textOf = (message) => {
    if (message.hello) return fill(ui.interview.hello, { name: person.firstName });
    const { q, a } = interview[message.question];
    return message.from === "you" ? q : a;
  };

  /** Asks question i: shows it, "types" a moment (longer for longer answers), then streams the answer. */
  const ask = (i) => {
    if (typing) return;
    const { a } = interview[i];
    setAsked((list) => (list.includes(i) ? list : [...list, i]));
    setMessages((list) => [...list, { from: "you", question: i }]);
    if (reduced) {
      setMessages((list) => [...list, { from: "me", question: i }]);
      return;
    }
    setTyping(true);
    timer.current = setTimeout(() => {
      setTyping(false);
      setMessages((list) => [...list, { from: "me", question: i, stream: true }]);
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
        <Head num={5} label={ui.interview.label} title={ui.interview.title} />

        <div className="interview__grid">
          <div className="interview__questions" data-reveal>
            <p className="interview__lead">{ui.interview.lead}</p>
            <ul>
              {interview.map(({ q }, i) => (
                <li key={i}>
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
                <p className="chat__sub mono">{ui.interview.sub}</p>
              </div>
              <button type="button" className="chat__restart mono" onClick={restart} disabled={messages.length === 1}>
                {ui.interview.restart}
              </button>
            </div>
            <ol className="chat__log" ref={log} data-lenis-prevent role="log" aria-live="polite" aria-label={ui.interview.chat}>
              {messages.map((message, i) => (
                <Message key={i} from={message.from} text={textOf(message)} stream={message.stream} reduced={reduced}
                  onGrow={toBottom} />
              ))}
              {typing && (
                <li className="msg msg--me msg--typing" aria-label={ui.interview.typing}>
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
