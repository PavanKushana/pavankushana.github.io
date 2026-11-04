Put web-ready photos in this folder, then name each one in src/content.js (the "photos" list near the top).
Everything in this folder gets published, so only small copies go here. Originals stay outside the repo
(C:\Users\pavan\projects\portfolio-photo-originals). Phone photos carry hidden GPS data: make web copies first.

The frames and the photo each one wants:
  portrait   - you, upright (4:5), for the arch next to "A bit about me" and the chat
  weimar     - landscape (4:3), for the journey chapter 2025 and the collage
  campus     - square, Bauhaus-Universität (journey chapter 2026, the collage's circle)
  hackathon  - landscape (3:2), building Lifeguard-Agent (journey Oct 2026, the collage)
  desk       - upright (3:4), anything you like (the collage's arch)

Example: put weimar.jpg here, then in content.js change
  weimar: { src: null, ...
to
  weimar: { src: "photos/weimar.jpg", ...

Tips: JPG or WebP, about 1600 px on the long side, under 400 KB each (the page stays fast).
Project screenshots work the same way: the "shots" of each project in content.js.
When every frame you keep has a photo, set showPhotoLabels to false in content.js.
