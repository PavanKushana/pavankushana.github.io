// VideoEmbed.jsx: a YouTube video that loads only when someone presses play. Until then it's a Bauhaus cover
// drawn by the site (not YouTube's picture), so nothing is loaded from YouTube and no cookies are set for
// visitors who never watch. The player comes from youtube-nocookie.com, YouTube's privacy-enhanced mode.
import { useState } from "react";
import "./VideoEmbed.css";

/** id: the YouTube video id; title: what the video is. */
export default function VideoEmbed({ id, title }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="video">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" className="video__cover" onClick={() => setPlaying(true)} aria-label={`Play: ${title}`}>
          <span className="video__shape video__shape--a" aria-hidden="true" />
          <span className="video__shape video__shape--b" aria-hidden="true" />
          <span className="video__play" aria-hidden="true" />
          <span className="video__title">{title}</span>
          <span className="video__note mono">Plays from YouTube</span>
        </button>
      )}
    </div>
  );
}
