// content.de.js: the German version of content.js. Same names, same order, same layout, so the two files can be
// read side by side. Links, photos and other data come from content.js where possible, so they stay in one place;
// only the words are German here. `npm run check` compares both files and lists anything that no longer matches.
//
// How the German is written:
// - "Sie" for the visitor (recruiters and team leads), "ich" for me, like the English.
// - Natural German word order and plain words, not word-for-word English. IT words that German teams really use
//   stay as they are (Cloud, DevOps, Container, Logs, Deployment); "KI" for AI.
// - Same rules as the English: only true things, single hyphens only, no stock phrases.
// - Long words in big headings get a soft hyphen (­), so a phone can break them cleanly.
import * as en from "./content.js"; // with ".js", so scripts/check.mjs (plain Node) can load this file too

// the same person and links; only the place is written in German
export const person = { ...en.person, location: "Weimar, Deutschland" };

export const nav = [
  { id: "about", label: "Über mich" },
  { id: "journey", label: "Werdegang" },
  { id: "work", label: "Projekte" },
  { id: "skills", label: "Kenntnisse" },
  { id: "interview", label: "Interview" },
  { id: "contact", label: "Kontakt" },
];

// the same photos (src from content.js); alt is what screen readers say, label and hint only show while
// showPhotoLabels is true
export const showPhotoLabels = en.showPhotoLabels;
export const photos = {
  portrait: { ...en.photos.portrait, alt: "Pavan Sai Kushana", label: "Porträt", hint: "hochkant, 4:5" },
  debate: { ...en.photos.debate, alt: "Das Projektteam der Debate Arena", label: "Debate Arena", hint: "Querformat" },
  weimar: { ...en.photos.weimar, alt: "", label: "Weimar", hint: "Querformat, 4:3" },
  moving: { ...en.photos.moving, alt: "Das Hauptgebäude der Bauhaus-Universität Weimar", label: "Umzug nach Deutschland", hint: "Querformat" },
  campus: { ...en.photos.campus, alt: "", label: "Campus", hint: "quadratisch" },
  hackathon: { ...en.photos.hackathon, alt: "Die Startseite von Lifeguard-Agent", label: "Hackathon", hint: "Querformat, 3:2" },
  desk: { ...en.photos.desk, alt: "", label: "Freie Wahl", hint: "hochkant, 3:4" },
};

export const hero = {
  eyebrow: "Portfolio · Weimar, Deutschland · 2026",
  status: "Offen für Werkstudentenstellen und Praktika",
  intro:
    "Masterstudent im Studiengang Computer Science for Digital Media an der Bauhaus-Universität Weimar. Ich " +
    "arbeite an Cloud-Infrastruktur, DevOps und KI-Systemen. Praktische AWS-Erfahrung habe ich in einem " +
    "IT-Operations-Praktikum gesammelt, und meine Projekte entwickle, deploye und teste ich von Anfang bis Ende selbst.",
  playHint: "Formen ziehen und werfen",
  playHintTouch: "Zum Schütteln tippen",
};

// Kandinsky's three shapes (Bauhaus, 1923), one for each thing I work on
export const shapes = {
  note:
    "Am Bauhaus ordnete Wassily Kandinsky jeder Grundform eine Farbe zu: dem Dreieck Gelb, dem Quadrat Rot " +
    "und dem Kreis Blau. Ich habe mir die drei Formen für die drei Bereiche geliehen, in denen ich arbeite.",
  fields: [
    { id: "cloud", shape: "circle", title: "Cloud & Linux",
      text: "AWS und Linux, von meinem Praktikum bis zur Nebius-VM, auf der ich einen echten Docker-Test gemacht habe." },
    { id: "devops", shape: "square", title: "DevOps",
      text: "Container, CI/CD und Monitoring. Ich lerne am eigenen Projekt: Lifeguard-Agent läuft in Docker und wird bei jedem Push getestet." },
    { id: "ai", shape: "triangle", title: "KI-Agenten",
      text: "Agenten, die Schritt für Schritt Tools aufrufen, und Tests, die zeigen, ob sie wirklich funktionieren." },
  ],
};

export const about = {
  title: "Kurz über mich",
  paragraphs: [
    "Ich habe in Indien Informationstechnologie studiert und bei Sears ein IT-Operations-Praktikum gemacht, bei " +
      "dem ich an AWS-Infrastruktur gearbeitet habe. Dort bin ich zur Cloud gekommen. Jetzt mache ich meinen " +
      "Master an der Bauhaus-Universität Weimar.",
    "Neben dem Studium bereite ich mich auf Stellen im Cloud- und DevOps-Engineering vor. Ich lerne Docker, " +
      "Kubernetes und CI/CD und arbeite auf die Zertifizierung AWS Solutions Architect Associate hin. Mein " +
      "neuestes Projekt, Lifeguard-Agent, ist ein KI-Agent für die Rufbereitschaft. Er findet heraus, warum ein " +
      "Server ausgefallen ist, und schlägt Lösungen vor. Ändern darf er aber nichts, solange kein Mensch zugestimmt hat.",
  ],
  // how I work: four habits, each from something that really happened in a project
  habits: [
    { title: "Erst messen, dann vertrauen", text: "Ich teste meine Arbeit an echten Beispielen, bevor ich sie für fertig erkläre. Lifeguard-Agent habe ich in 100 Durchläufen an 20 Fehlerszenarien getestet, und den Schiedsrichter aus meinem Masterprojekt haben wir an Debatten geprüft, die wir von Hand annotiert hatten." },
    { title: "Der Mensch behält die Kontrolle", text: "Ich baue KI so, dass sie Vorschläge macht, statt selbst zu handeln. Bei Lifeguard-Agent wird jede Lösung im Code geprüft und braucht die Freigabe eines Menschen." },
    { title: "Jede KI-Änderung prüfen", text: "Ich entwickle mit KI-Coding-Tools wie Claude Code und prüfe jede Änderung, bevor ich sie übernehme. Das habe ich gelernt, nachdem eine KI-Korrektur unbemerkt anderen Code verändert hatte." },
    { title: "Laufend dokumentieren", text: "Klare READMEs, Testberichte und Notizen, damit andere meine Arbeit verstehen, ausführen und darauf aufbauen können." },
  ],
};

// the same places and the same line on the globe; only the names are German
export const places = {
  india: { ...en.places.india, name: "Indien" },
  germany: { ...en.places.germany, name: "Deutschland" },
};
export const distanceKm = en.distanceKm;

export const chapters = [
  { year: "2020", place: "india", title: "B.Tech in Information Technology",
    text: "Die Grundlagen der Informatik: Datenstrukturen, Betriebssysteme, Datenbanken und Java. In meinem Abschlussprojekt habe ich ein Netzwerk aus Rechenzentren in Python simuliert." },
  { year: "2022", place: "india", title: "IT-Operations-Praktikant bei Sears",
    text: "Ich habe im Betrieb von AWS-Infrastruktur gearbeitet. Dort bin ich zur Cloud gekommen." },
  { year: "2025", place: "germany", title: "Umzug nach Deutschland",
    text: "Ich habe meinen Master in Computer Science for Digital Media an der Bauhaus-Universität Weimar begonnen, etwa 6.900 km von zu Hause entfernt.",
    photo: "moving", travel: true },
  { year: "2026", place: "germany", title: "Die Debate Arena",
    text: "Mein Masterprojekt in der Webis-Gruppe. Mit einem Teamkollegen habe ich den Logik-Teil eines Schiedsrichters für Debatten zwischen LLMs gebaut.",
    photo: "debate" },
  { year: "Okt. 2026", place: "germany", title: "Lifeguard-Agent",
    text: "Ein KI-Agent für die Rufbereitschaft, den ich allein für den Nebius x NVIDIA Global AI Hackathon gebaut habe.", photo: "hackathon" },
];

// The work, as an exhibition of posters. Each opens a case study.
export const projects = [
  {
    id: "lifeguard",
    title: "Lifeguard-Agent",
    year: "2026",
    kind: "Nebius x NVIDIA Global AI Hackathon · allein entwickelt",
    fields: ["cloud", "devops", "ai"],
    tagline: "Ein KI-Agent für die Rufbereitschaft kleiner Teams.",
    summary:
      "Wenn ein Server ausfällt, geht er der Sache nach wie ein SRE. Er liest den Alarm, prüft die Container, " +
      "die Logs und die letzten Änderungen, findet die Ursache und schlägt Lösungen vor. Geändert wird erst, wenn " +
      "ein Mensch zustimmt, auf der Webseite oder mit zweimal Tippen in Telegram.",
    why:
      "Die Idee stammt aus meinem Praktikum. Wenn dort etwas ausfiel, war oft ich derjenige, der die Logs geprüft hat. " +
      "Kleine Teams haben dasselbe Problem, können aber niemanden dafür bezahlen, nachts auf ihre Server aufzupassen.",
    stats: [
      { value: "100", label: "Testläufe mit 20 Fehlerszenarien" },
      { value: "0", label: "völlig falsche Ursachen" },
      { value: "80/80", label: "empfohlene Lösungen, die funktioniert haben" },
      { value: "3/3", label: "echte Fehler auf einer Nebius-VM behoben" },
    ],
    steps: [
      ["Alarm", "Auf dem Server fällt etwas aus."],
      ["Erster Blick", "Nemotron Nano liest den Alarm und gibt eine schnelle erste Einschätzung ab."],
      ["Schon mal gesehen?", "Frühere Störungen auf diesem Server, als Hinweis."],
      ["Untersuchung", "Nemotron Super nutzt nur lesende Tools wie docker ps, logs und df."],
      ["Websuche", "Tavily sucht einmal nach der wichtigsten Fehlermeldung."],
      ["Diagnose", "Nemotron Ultra schreibt Lösungsvorschläge samt Risiken."],
      ["Sicherheitsprüfung", "Code prüft jeden Vorschlag, bevor ein Mensch ihn sieht."],
      ["Freigabe", "Ein Mensch stimmt zu, auf der Webseite oder mit zweimal Tippen in Telegram."],
      ["Beheben und prüfen", "Der Agent führt die Lösung aus und weist dann nach, dass der Shop wieder funktioniert."],
    ],
    stack: ["Python", "FastAPI", "NVIDIA Nemotron", "Nebius Token Factory", "Tavily", "Docker", "Telegram-Bot",
      "three.js", "GitHub Actions", "Render"],
    video: { id: "2FNC4A2Uhls", title: "Demo-Video auf Englisch, 2:33" },
    links: [
      { label: "Live-Demo", href: "https://lifeguard-agent.com" },
      { label: "Code", href: "https://github.com/PavanKushana/lifeguard-agent" },
      { label: "Test auf echtem Server", href: "https://youtu.be/nOUMY-32X44" },
    ],
    shots: [
      { src: "photos/lifeguard-home.jpg", alt: "Die Startseite von Lifeguard-Agent mit der 3D-Ansicht des Demo-Shops", label: "Screenshot: die Startseite", hint: "16:10" },
      { src: "photos/lifeguard-fix-options.jpg", alt: "Lösungsvorschläge mit Schritten, Vor- und Nachteilen und wie man jeden rückgängig macht", label: "Screenshot: die Lösungsvorschläge", hint: "16:10" },
      { src: "photos/lifeguard-telegram.jpg", alt: "Telegram auf einem Handy: der Alarm, die Freigabe und das Ergebnis nach der Behebung", label: "Screenshot: Telegram auf dem Handy", hint: "hochkant" },
    ],
  },
  {
    id: "debate",
    title: "Die Debate Arena für LLMs",
    year: "2026",
    kind: "Masterprojekt · Webis-Gruppe, Bauhaus-Universität Weimar",
    fields: ["ai"],
    tagline: "Ein Schiedsrichter für Debatten zwischen zwei LLMs.",
    summary:
      "LLMs debattieren über ein Thema, und ein automatischer Schiedsrichter entscheidet, wer besser argumentiert " +
      "hat. Mit einem Teamkollegen habe ich den Logik-Teil gebaut: wie gut jedes Argument standhält, ob sich jemand " +
      "selbst widerspricht und welche Punkte widerlegt wurden. Dafür nutzen wir ein NLI-Modell und ein LLM als Schiedsrichter.",
    why:
      "Am meisten habe ich beim Testen gelernt. Wir haben den Schiedsrichter an Debatten geprüft, die wir von Hand " +
      "annotiert hatten, und dabei festgestellt, dass ein kleines Modell jeder Eingabe dieselbe Bewertung gab. Solche " +
      "Tests sind auch der Grund, warum die Argumentqualität inzwischen vom LLM statt vom NLI-Modell bewertet wird.",
    stack: ["Python", "FastAPI", "DeBERTa-v3 NLI", "Ollama", "LLM-as-a-judge", "GPU-Cluster (SLURM)"],
    links: [{ label: "Code", href: "https://github.com/PavanKushana/debate-arena-llm-judge" }],
    shots: [{ src: "photos/debate-team.jpg", alt: "Das Projektteam der Debate Arena", label: "Bild: das Projekt oder eine Folie", hint: "16:10" }],
  },
  {
    id: "datacenters",
    title: "Kostenminimierung für geografisch verteilte Rechenzentren",
    year: "2023",
    kind: "B.Tech-Projekt · Institute of Aeronautical Engineering",
    fields: ["cloud"],
    tagline: "Günstigere Wege für Daten zwischen Rechenzentren.",
    summary:
      "Eine Python-Simulation eines Netzwerks aus Rechenzentren an verschiedenen Standorten. LEACH-Clustering " +
      "gruppiert die Knoten, und Particle Swarm Optimization sucht die Routen mit dem geringsten Energieverbrauch.",
    why:
      "Bevor ich dem Optimierer vertraut habe, habe ich seine Routen in zufällig erzeugten Netzwerken mit " +
      "Brute-Force-Ergebnissen verglichen.",
    stack: ["Python", "Simulation", "Particle Swarm Optimization", "LEACH-Clustering"],
    links: [{ label: "Code", href: "https://github.com/PavanKushana/cost-minimization-datacenters" }],
    shots: [{ src: null, label: "Bild: die Simulation", hint: "16:10" }],
  },
];

// the last poster: what's coming next (not a project, so it has no case study)
export const nextUp = {
  title: "Als Nächstes",
  items: ["AWS Solutions Architect Associate, Prüfung im Dezember 2026", "Docker, Kubernetes und CI/CD", "Das zweite Jahr meines Masterstudiums"],
};

// skills as tiles; field = which shape and colour they belong to ("code" and "tools" are the black ones)
export const filters = [
  { id: "all", label: "Alle" },
  { id: "cloud", label: "Cloud", shape: "circle" },
  { id: "devops", label: "DevOps", shape: "square" },
  { id: "ai", label: "KI", shape: "triangle" },
  { id: "code", label: "Code", shape: "half" },
  { id: "tools", label: "Tools", shape: "bar" },
];
export const skills = [
  { name: "AWS", note: "EC2, EKS, IAM, S3, VPC, Route 53, RDS", field: "cloud" },
  { name: "Linux", note: "Ubuntu, CentOS", field: "cloud" },
  { name: "Netzwerke", note: "die Grundlagen", field: "cloud" },
  { name: "Nebius AI Cloud", note: "eine VM für einen echten Docker-Test", field: "cloud" },
  { name: "Docker", note: "Grundkenntnisse, genutzt in Lifeguard-Agent", field: "devops" },
  { name: "Kubernetes", note: "über EKS", field: "devops" },
  { name: "GitHub Actions", note: "Tests bei jedem Push", field: "devops" },
  { name: "New Relic", note: "Monitoring und Alarme", field: "devops" },
  { name: "Troubleshooting", note: "Störungen und Runbooks", field: "devops" },
  { name: "LLM-Agenten", note: "Tool-Aufrufe, Schritt für Schritt", field: "ai" },
  { name: "NVIDIA Nemotron", note: "Nano, Super und Ultra", field: "ai" },
  { name: "Hugging Face", note: "Transformers, DeBERTa-v3 NLI", field: "ai" },
  { name: "Ollama", note: "lokale LLMs", field: "ai" },
  { name: "LLM-as-a-judge", note: "und Evaluierung", field: "ai" },
  { name: "Prompt-Design", note: "strukturierte JSON-Ausgaben", field: "ai" },
  { name: "Python", note: "die meisten meiner Projekte", field: "code" },
  { name: "Bash", note: "für kleine Aufgaben", field: "code" },
  { name: "FastAPI", note: "zwei meiner Projekte", field: "code" },
  { name: "SQL", note: "Grundkenntnisse", field: "code" },
  { name: "REST-APIs", note: "selbst bauen und aufrufen", field: "code" },
  { name: "Java", note: "objektorientierte Programmierung", field: "code" },
  { name: "Git & GitHub", note: "alle meine Projekte", field: "tools" },
  { name: "GitLab", note: "Projekte an der Uni", field: "tools" },
  { name: "Claude Code", note: "ich prüfe jede Änderung", field: "tools" },
  { name: "GitHub Copilot", note: "", field: "tools" },
];

// "Interview me": the questions a recruiter might ask (with "Sie", as in a German interview), and my answers
export const interview = [
  { q: "Was suchen Sie?",
    a: "Eine Werkstudentenstelle oder ein Praktikum im Bereich Cloud, DevOps, Linux oder Python-Automatisierung. Überall in Deutschland, vor Ort oder hybrid, und ich kann sofort anfangen." },
  { q: "Wie viele Stunden können Sie arbeiten?",
    a: "20 Stunden pro Woche im Semester und Vollzeit in den Semesterferien. Ich habe eine Aufenthaltserlaubnis zum Studium in Deutschland." },
  { q: "Warum Cloud und DevOps?",
    a: "In meinem IT-Operations-Praktikum bei Sears habe ich mit AWS gearbeitet. Dort bin ich zur Cloud gekommen. Jetzt lerne ich Docker, Kubernetes und CI/CD richtig und bereite mich auf die Prüfung zum AWS Solutions Architect Associate im Dezember vor." },
  { q: "Was ist Lifeguard-Agent?",
    a: "Ein KI-Agent für die Rufbereitschaft, den ich allein für den Nebius x NVIDIA Global AI Hackathon gebaut habe. Drei NVIDIA-Nemotron-Modelle finden heraus, warum ein Server ausgefallen ist, und schlagen Lösungen vor. Geändert wird nichts, solange kein Mensch zugestimmt hat. Ich habe ihn in 100 Durchläufen getestet, und auf einer Nebius-VM hat er außerdem drei echte Fehler behoben." },
  { q: "Was haben Sie in der Debate Arena gemacht?",
    a: "Das ist mein Masterprojekt in der Webis-Gruppe, ein Schiedsrichter, der entscheidet, wer eine Debatte zwischen zwei LLMs gewonnen hat. Mit einem Teamkollegen habe ich den Logik-Teil gebaut: wie gut jedes Argument standhält, ob sich jemand selbst widerspricht und welche Punkte widerlegt wurden." },
  { q: "Wie nutzen Sie KI-Tools?",
    a: "Ich nutze Claude Code, GitHub Copilot und ChatGPT. In meinem Masterprojekt habe ich erlebt, wie eine KI-Korrektur unbemerkt anderen Code verändert hat. Deshalb prüfe ich jetzt jede Änderung, bevor ich sie übernehme." },
  { q: "Was haben Sie auf die harte Tour gelernt?",
    a: "Dass ein Modell so aussehen kann, als würde es arbeiten, und trotzdem nutzlos ist. In meinem Masterprojekt gab ein kleines Modell jeder Eingabe dieselbe Bewertung. Seitdem teste ich Modelle an echten Beispielen, bevor ich ihnen vertraue." },
  { q: "Sprechen Sie Deutsch?",
    a: "A2, und ich lerne weiter. Mein Masterstudium ist englischsprachig, mein Englisch ist auf C1-Niveau, und Telugu ist meine Muttersprache." },
];

export const certs = [
  { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", when: "2023, erneuert im Okt. 2026, gültig bis 2029",
    href: "https://drive.google.com/file/d/105Y2UhpDtHZ4K-49r94T_nVAWXDQtuZR/view?usp=sharing" },
  { name: "Claude Code in Action", issuer: "Anthropic", when: "Mai 2026",
    href: "https://drive.google.com/file/d/1nhwBZrxIzAATYvbfRV8eXRl8Sj4UW4DG/view?usp=sharing" },
  { name: "AWS Solutions Architect Associate", issuer: "Amazon Web Services", when: "Prüfung im Dezember 2026", inProgress: true },
];

export const languages = [
  { name: "Englisch", level: "C1" },
  { name: "Deutsch", level: "A2, ich lerne weiter" },
  { name: "Telugu", level: "Muttersprache" },
];

export const contact = {
  title: "Sagen Sie Hallo",
  text:
    "Ich suche eine Werkstudentenstelle oder ein Praktikum im Bereich Cloud, DevOps, Linux oder Python-Automatisierung, " +
    "überall in Deutschland. Ich kann sofort anfangen, und per E-Mail erreichen Sie mich am schnellsten.",
  availability: "20 Stunden pro Woche im Semester, Vollzeit in den Semesterferien",
};

// the page's own words (see ui in content.js)
export const ui = {
  pageTitle: "Pavan Sai Kushana · Cloud, DevOps und KI",
  pageDescription:
    "Pavan Sai Kushana, Masterstudent im Studiengang Computer Science for Digital Media an der " +
    "Bauhaus-Universität Weimar. Cloud, Linux, DevOps und KI-Agenten. Offen für Werkstudentenstellen und " +
    "Praktika in Deutschland.",
  numberLocale: "de-DE",
  timeLocale: "de-DE",
  skipLink: "Zum Inhalt springen",
  nav: {
    backToTop: "Zurück nach oben",
    sections: "Bereiche",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    cv: "CV",
    cvTitle: "Mein Lebenslauf, auf Englisch",
    downloadCv: "Lebenslauf herunterladen (Englisch)",
    toLight: "Zum hellen Design wechseln",
    toDark: "Zum dunklen Design wechseln",
    lightTheme: "Helles Design",
    darkTheme: "Dunkles Design",
    language: "Sprache",
  },
  fieldNames: { cloud: "Cloud", devops: "DevOps", ai: "KI", code: "Code", tools: "Tools" },
  hero: {
    label: "Einleitung",
    fieldsLabel: "Cloud, DevOps und KI",
    seeWork: "Meine Projekte ansehen",
    interviewMe: "Interviewen Sie mich",
    shake: "Schütteln",
    shapeWords: { cloud: "cloud", devops: "devops", ai: "ki" },
  },
  cursorDrag: "ziehen",
  marquee: ["Cloud", "DevOps", "KI-Agenten", "Linux", "Python"],
  about: { label: "Über mich", habitsTitle: "So arbeite ich" },
  journey: {
    label: "Werdegang",
    title: "Von Indien nach Deutschland",
    kmLabel: "von Indien nach Deutschland",
    globe: "Ein Globus mit dem Weg von {from} nach {to}",
  },
  work: {
    label: "Projekte",
    title: "Eine Ausstellung meiner Arbeiten",
    intro: "Drei Projekte, von meinem B.Tech bis zu einem Hackathon. Ein Klick auf ein Plakat öffnet die ganze Geschichte.",
    keepScrolling: "Weiter scrollen",
    swipe: "Wischen",
    open: "Fallstudie öffnen",
    now: "Jetzt",
  },
  caseStudy: {
    close: "Fallstudie schließen",
    why: "Warum ich es gebaut habe",
    tookFrom: "Was ich daraus mitgenommen habe",
    flow: "So läuft eine Störung ab",
    builtWith: "Gebaut mit",
  },
  video: { play: "Abspielen: {title}", note: "Wird von YouTube abgespielt" },
  skills: {
    label: "Kenntnisse",
    title: "Womit ich arbeite",
    filterLabel: "Kenntnisse filtern",
    count: "{shown} von {total}",
    certificates: "Zertifikate",
    viewCert: "Zertifikat ansehen: {name}",
    inProgress: "In Vorbereitung",
    languages: "Sprachen",
  },
  interview: {
    label: "Interviewen Sie mich",
    title: "Fragen Sie wie im Vorstellungs­gespräch",
    hello: "Hallo, ich bin {name}. Wählen Sie eine Frage, und ich antworte. Das sind meine echten Antworten.",
    lead: "Wählen Sie eine Frage:",
    sub: "Antworten aus meinem Lebenslauf und meinen Projekten",
    restart: "Neu starten",
    chat: "Chat",
    typing: "schreibt",
  },
  moments: { label: "Momente", title: "Indien, Deutschland und alles dazwischen" },
  contact: {
    label: "06 / Kontakt",
    big: "Hall", // "Hallo": the last "o" is the blue circle, like in "Say hello"
    time: "In Weimar ist es gerade {time} Uhr",
    copy: "Kopieren",
    copied: "Kopiert",
  },
  footer: {
    built: "Gebaut mit React, GSAP, Lenis, matter-js und d3-geo, mit Unterstützung von Claude Code. Effekte von React Bits.",
    top: "Nach oben ↑",
  },
  photoSpace: "Platz für ein Foto: {label}",
};
