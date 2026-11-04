// content.js: every word, link and photo slot on the site, in one place. To change the site, change it here.
//
// Rules for this file (Pavan's):
// - Only true things. Sources: job-applications/profile/facts.md, the GitHub profile README and the
//   Lifeguard-Agent README. Never add a skill, number or date that isn't there.
// - CV numbers and the Sears details stay in the CV. Here Sears is one plain line.
// - Plain, human wording: single hyphens only, no stock phrases, "I" and "my" (solo projects).

export const person = {
  name: "Pavan Sai Kushana",
  firstName: "Pavan",
  location: "Weimar, Germany",
  timeZone: "Europe/Berlin",
  email: "pavansai.kushana@gmail.com",
  github: "https://github.com/PavanKushana",
  githubHandle: "PavanKushana",
  linkedin: "https://www.linkedin.com/in/pavankushana",
  linkedinHandle: "pavankushana",
  // the public CV on Google Drive (no phone, no photo); update it there with "Manage versions" so the link stays
  cv: "https://drive.google.com/file/d/1MyC1To6bwyH9NU4O5HQjZyUAb7wyPk99/view?usp=sharing",
};

export const nav = [
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "interview", label: "Interview" },
  { id: "contact", label: "Contact" },
];

// Photo slots. src: null shows an empty frame (a small Bauhaus composition). To add a picture, put the file in
// public/photos/ and write its name here, like src: "photos/weimar.jpg". alt describes it for screen readers.
// showPhotoLabels: true writes on each empty frame which picture goes there (for now); set it to false before
// publishing without photos, and the empty frames are just shapes.
export const showPhotoLabels = false;
export const photos = {
  portrait: { src: "photos/portrait.jpg", alt: "Pavan Sai Kushana", label: "Your portrait", hint: "upright, 4:5" },
  debate: { src: "photos/debate-team.jpg", alt: "The Debate Arena project team", label: "Debate Arena", hint: "landscape" },
  // the collage's big rectangle (the slot is still called weimar; the photo is from a trip to Budapest)
  weimar: { src: "photos/budapest-heroes-square.jpg", alt: "Me at Heroes' Square in Budapest", label: "Weimar", hint: "landscape, 4:3" },
  moving: { src: "photos/bauhaus-main-building.jpg", alt: "The main building of Bauhaus-Universität Weimar", label: "Moving to Germany", hint: "landscape" },
  campus: { src: "photos/campus.jpg", alt: "The main building of Bauhaus-Universität Weimar", label: "Campus", hint: "square" },
  hackathon: { src: "photos/lifeguard-home.jpg", alt: "The Lifeguard-Agent home page", label: "Hackathon", hint: "landscape, 3:2" },
  desk: { src: "photos/budapest.jpg", alt: "Me on a trip to Budapest", label: "Anything you like", hint: "upright, 3:4" },
};

export const hero = {
  eyebrow: "Portfolio · Weimar · 2026",
  status: "Open to working student roles and internships",
  intro:
    "Master's student in Computer Science for Digital Media at Bauhaus-Universität Weimar. I work on cloud " +
    "infrastructure, DevOps and AI systems, with hands-on AWS experience from an IT operations internship and " +
    "projects I build, deploy and test end to end.",
  playHint: "Drag the shapes",
  playHintTouch: "Tap to shake the shapes",
};

// Kandinsky's three shapes (Bauhaus, 1923), one for each thing I work on. The colours drive the whole site.
export const shapes = {
  note:
    "At the Bauhaus, Wassily Kandinsky paired a yellow triangle, a red square and a blue circle. I borrowed " +
    "them for the three things I work on.",
  fields: [
    { id: "cloud", shape: "circle", title: "Cloud & Linux",
      text: "AWS and Linux, from my internship to the Nebius VM I used for a real Docker test." },
    { id: "devops", shape: "square", title: "DevOps",
      text: "Containers, CI/CD and monitoring. Learning by building: Lifeguard-Agent runs in Docker, with tests on every push." },
    { id: "ai", shape: "triangle", title: "AI agents",
      text: "Agents that call tools step by step, and tests that show whether they really work." },
  ],
};

export const about = {
  title: "A bit about me",
  paragraphs: [
    "I studied Information Technology in India and did an IT operations internship at Sears, working on AWS " +
      "infrastructure. That's where I got into cloud. Now I'm doing my Master's at Bauhaus-Universität Weimar.",
    "I'm learning Docker, Kubernetes and CI/CD, and I test AI systems before I trust them. My latest project, " +
      "Lifeguard-Agent, is an AI on-call engineer that finds why a server broke and suggests fixes, but changes " +
      "nothing without a human's approval.",
  ],
  // how I work: four habits, each from something that really happened in a project
  habits: [
    { title: "Measure before trusting", text: "I test my work on real examples before I call it done. Lifeguard-Agent ran 100 times on 20 faults, and my Master's project judge was checked against debates we annotated by hand." },
    { title: "Humans stay in control", text: "I design AI to suggest, not act on its own. In Lifeguard-Agent, every fix is checked in code and needs a person's approval." },
    { title: "Review every AI change", text: "I build with AI coding tools like Claude Code, and I review each change before accepting it. I learned this after an AI fix quietly changed other code." },
    { title: "Document as I go", text: "Clear READMEs, test reports and notes, so others can understand, run and build on my work." },
  ],
};

// The journey, for the globe: where each chapter happened. Shown as countries only (a city name like
// Hyderabad isn't known everywhere and exists in two countries); the line on the globe still starts and ends
// at the real cities. Coordinates are [longitude, latitude].
export const places = {
  india: { name: "India", coords: [78.4867, 17.385] },
  germany: { name: "Germany", coords: [11.3235, 50.9795] },
};
export const distanceKm = 6900; // great-circle distance between the two cities, about 6,924 km

// photo is optional: the India chapters have none
export const chapters = [
  { year: "2020", place: "india", title: "B.Tech in Information Technology",
    text: "The CS basics: data structures, operating systems, databases and Java. My final project simulated a network of data centers in Python." },
  { year: "2022", place: "india", title: "IT operations intern at Sears",
    text: "I worked on AWS infrastructure operations. That's where I got into cloud." },
  { year: "2025", place: "germany", title: "Moving to Germany",
    text: "I started my Master's in Computer Science for Digital Media at Bauhaus-Universität Weimar, about 6,900 km from home.",
    photo: "moving", travel: true },
  { year: "2026", place: "germany", title: "The Debate Arena",
    text: "My Master's project at the Webis group. A teammate and I built the logic track of a judge for debates between LLMs.",
    photo: "debate" },
  { year: "Oct 2026", place: "germany", title: "Lifeguard-Agent",
    text: "An AI on-call engineer I built solo for the Nebius x NVIDIA Global AI Hackathon.", photo: "hackathon" },
];

// The work, as an exhibition of posters. Each opens a case study.
export const projects = [
  {
    id: "lifeguard",
    title: "Lifeguard-Agent",
    year: "2026",
    kind: "Nebius x NVIDIA Global AI Hackathon · built solo",
    fields: ["cloud", "devops", "ai"],
    tagline: "An AI on-call engineer for small teams.",
    summary:
      "When a server breaks, it investigates the way an SRE would. It reads the alert, checks the containers, " +
      "logs and recent changes, finds the cause and suggests fixes. Nothing changes until a human approves, on the " +
      "web page or with two taps in Telegram.",
    why:
      "The idea came from my internship, where I was often the one checking logs when something broke. Small teams " +
      "have the same problem, but they can't pay someone to watch their servers all night.",
    stats: [
      { value: "100", label: "test runs on 20 faults" },
      { value: "0", label: "causes completely wrong" },
      { value: "80/80", label: "recommended fixes that worked" },
      { value: "3/3", label: "real faults fixed on a Nebius VM" },
    ],
    steps: [
      ["Alert", "Something on the server breaks."],
      ["First look", "Nemotron Nano reads the alert and makes a quick guess."],
      ["Seen this before?", "Past incidents on this server, as a hint."],
      ["Investigation", "Nemotron Super runs read-only tools like docker ps, logs and df."],
      ["Web search", "Tavily looks up the key error once."],
      ["Final call", "Nemotron Ultra writes fix options with risks."],
      ["Safety check", "Code checks every option before a human sees it."],
      ["Human approves", "On the web page or with two taps in Telegram."],
      ["Fix and verify", "Runs the fix, then proves the shop works again."],
    ],
    stack: ["Python", "FastAPI", "NVIDIA Nemotron", "Nebius Token Factory", "Tavily", "Docker", "Telegram bot",
      "three.js", "GitHub Actions", "Render"],
    video: { id: "2FNC4A2Uhls", title: "Demo video, 2:33" },
    links: [
      { label: "Live demo", href: "https://lifeguard-agent.com" },
      { label: "Code", href: "https://github.com/PavanKushana/lifeguard-agent" },
      { label: "Real server run", href: "https://youtu.be/nOUMY-32X44" },
    ],
    // empty frames for screenshots; fill like the photos above (src: "photos/lifeguard-home.jpg")
    shots: [
      { src: "photos/lifeguard-home.jpg", alt: "The Lifeguard-Agent home page with the 3D view of the demo shop", label: "Screenshot: the home page", hint: "16:10" },
      { src: "photos/lifeguard-fix-options.jpg", alt: "Fix options with steps, pros, cons and how to undo each", label: "Screenshot: the fix options", hint: "16:10" },
      { src: "photos/lifeguard-telegram.jpg", alt: "Telegram on a phone: the alert, approval and the fixed result", label: "Screenshot: Telegram on a phone", hint: "upright" },
    ],
  },
  {
    id: "debate",
    title: "The Debate Arena for LLMs",
    year: "2026",
    kind: "Master's project · Webis group, Bauhaus-Universität Weimar",
    fields: ["ai"],
    tagline: "A judge for debates between two LLMs.",
    summary:
      "LLMs debate a topic and an automatic judge decides who argued better. A teammate and I built the logic " +
      "track: how well each argument holds up, whether a speaker contradicts themselves, and which points got " +
      "rebutted, using an NLI model and an LLM as a judge.",
    why:
      "Testing taught me the most. We checked the judge against debates we had annotated by hand and found that a " +
      "small model gave every input the same score. Tests like that are also why the argument-quality check moved " +
      "from NLI to the LLM.",
    stack: ["Python", "FastAPI", "DeBERTa-v3 NLI", "Ollama", "LLM-as-a-judge", "GPU cluster (SLURM)"],
    links: [{ label: "Code", href: "https://github.com/PavanKushana/debate-arena-llm-judge" }],
    shots: [{ src: "photos/debate-team.jpg", alt: "The Debate Arena project team", label: "Picture: the project or a slide", hint: "16:10" }],
  },
  {
    id: "datacenters",
    title: "Cost Minimization for Geo-Distributed Data Centers",
    year: "2023",
    kind: "B.Tech project · Institute of Aeronautical Engineering",
    fields: ["cloud"],
    tagline: "Cheaper routes for data between data centers.",
    summary:
      "A Python simulation of a network of data centers in different places. LEACH clustering groups the nodes and " +
      "Particle Swarm Optimization searches for the routes that use the least energy.",
    why:
      "Before trusting the optimizer, I checked its routes against brute-force answers on random layouts.",
    stack: ["Python", "Simulation", "Particle Swarm Optimization", "LEACH clustering"],
    links: [{ label: "Code", href: "https://github.com/PavanKushana/cost-minimization-datacenters" }],
    shots: [{ src: null, label: "Picture: the simulation", hint: "16:10" }],
  },
];

// the last poster: what's coming next (not a project, so it has no case study)
export const nextUp = {
  title: "Next",
  items: ["AWS Solutions Architect Associate, exam in December 2026", "Docker, Kubernetes and CI/CD", "The second year of my Master's"],
};

// skills as tiles; field = which shape and colour they belong to ("code" and "tools" are the black ones)
export const filters = [
  { id: "all", label: "All" },
  { id: "cloud", label: "Cloud", shape: "circle" },
  { id: "devops", label: "DevOps", shape: "square" },
  { id: "ai", label: "AI", shape: "triangle" },
  { id: "code", label: "Code", shape: "half" },
  { id: "tools", label: "Tools", shape: "bar" },
];
export const skills = [
  { name: "AWS", note: "EC2, EKS, IAM, S3, VPC, Route 53, RDS", field: "cloud" },
  { name: "Linux", note: "Ubuntu, CentOS", field: "cloud" },
  { name: "Networking", note: "the basics", field: "cloud" },
  { name: "Nebius AI Cloud", note: "a VM for a real Docker test", field: "cloud" },
  { name: "Docker", note: "basic, used in Lifeguard-Agent", field: "devops" },
  { name: "Kubernetes", note: "through EKS", field: "devops" },
  { name: "GitHub Actions", note: "tests on every push", field: "devops" },
  { name: "New Relic", note: "monitoring and alerts", field: "devops" },
  { name: "Troubleshooting", note: "incidents and runbooks", field: "devops" },
  { name: "LLM agents", note: "tool calls, step by step", field: "ai" },
  { name: "NVIDIA Nemotron", note: "Nano, Super and Ultra", field: "ai" },
  { name: "Hugging Face", note: "Transformers, DeBERTa-v3 NLI", field: "ai" },
  { name: "Ollama", note: "local LLMs", field: "ai" },
  { name: "LLM-as-a-judge", note: "and evaluation", field: "ai" },
  { name: "Prompt design", note: "structured JSON outputs", field: "ai" },
  { name: "Python", note: "most of my projects", field: "code" },
  { name: "Bash", note: "the small jobs", field: "code" },
  { name: "FastAPI", note: "two of my projects", field: "code" },
  { name: "SQL", note: "basic", field: "code" },
  { name: "REST APIs", note: "building and calling them", field: "code" },
  { name: "Java", note: "object-oriented programming", field: "code" },
  { name: "Git & GitHub", note: "all my projects", field: "tools" },
  { name: "GitLab", note: "university projects", field: "tools" },
  { name: "Claude Code", note: "I review every change", field: "tools" },
  { name: "GitHub Copilot", note: "", field: "tools" },
];

// "Interview me": the questions a recruiter might ask, and my answers
export const interview = [
  { q: "What are you looking for?",
    a: "A working student role or an internship in cloud, DevOps, Linux or Python automation. Anywhere in Germany, on-site or hybrid, and I can start right away." },
  { q: "How many hours can you work?",
    a: "20 hours a week during the semester and full time in the semester breaks. I hold a German student residence permit." },
  { q: "Why cloud and DevOps?",
    a: "During my IT operations internship at Sears I worked on AWS. That's where I got into cloud. Now I'm learning Docker, Kubernetes and CI/CD properly, and I'm preparing for the AWS Solutions Architect Associate exam in December." },
  { q: "What is Lifeguard-Agent?",
    a: "An AI on-call engineer I built solo for the Nebius x NVIDIA Global AI Hackathon. Three NVIDIA Nemotron models find out why a server broke and suggest fixes, and nothing changes until a human approves. I tested it on 100 runs, and it also fixed three real faults on a Nebius VM." },
  { q: "What did you do in the Debate Arena?",
    a: "It's my Master's project at the Webis group, a judge that decides who won a debate between two LLMs. A teammate and I built the logic track: how well each argument holds up, whether a speaker contradicts themselves, and which points got rebutted." },
  { q: "How do you use AI tools?",
    a: "I use Claude Code, GitHub Copilot and ChatGPT. In my Master's project I saw an AI fix quietly change other code, so now I review every change before I accept it." },
  { q: "Something you learned the hard way?",
    a: "That a model can look busy and still be useless. In my Master's project a small model gave every input the same score. Since then I test models on real examples before I trust them." },
  { q: "Do you speak German?",
    a: "A2, and I'm still learning. My Master's is taught in English, my English is C1, and Telugu is my first language." },
];

export const certs = [
  { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", when: "2023, renewed Oct 2026, valid until 2029",
    href: "https://drive.google.com/file/d/105Y2UhpDtHZ4K-49r94T_nVAWXDQtuZR/view?usp=sharing" },
  { name: "Claude Code in Action", issuer: "Anthropic", when: "May 2026",
    href: "https://drive.google.com/file/d/1nhwBZrxIzAATYvbfRV8eXRl8Sj4UW4DG/view?usp=sharing" },
  { name: "AWS Solutions Architect Associate", issuer: "Amazon Web Services", when: "exam in December 2026", inProgress: true },
];

export const languages = [
  { name: "English", level: "C1" },
  { name: "German", level: "A2, learning" },
  { name: "Telugu", level: "native" },
];

export const contact = {
  title: "Say hello",
  text:
    "I'm looking for a working student role or an internship in cloud, DevOps, Linux or Python automation, " +
    "anywhere in Germany. I can start right away, and email is the quickest way to reach me.",
  availability: "20 hours a week during the semester, full time in the breaks",
};
