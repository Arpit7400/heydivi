# For Divya — A Birthday Experience 🎂✨

A single-page, guided birthday website — pure HTML + CSS + vanilla JavaScript.
No build tools, no frameworks, no server. It works by simply opening `index.html`.

Made by **Arpit**, for **Divya**.

---

## 📁 What's in here

```
index.html        the page
css/style.css     all the styling & animation
js/main.js        all the logic — YOU ONLY EDIT THE TOP OF THIS FILE
images/           <- drop your photos here
audio/song.mp3    <- optional background song
README.md         this file
```

---

## ✍️ Step 1 — Add your personal content (the only file you edit)

Open **`js/main.js`**. At the very top is a block called `CONFIG`.
Everything personal lives here. You never need to touch anything below it.

```js
const CONFIG = {
  herName: "Divya",
  myName: "Arpit",
  birthday: "2026-08-15T00:00:00",   // <- her real birthday, keep the T00:00:00
  song: "audio/song.mp3",

  photos: [
    { src: "images/1.jpg", caption: "Where it all began", year: "2023" },
    { src: "images/2.jpg", caption: "That trip", year: "2024" },
    // add as many as you like (3 to 30)
  ],

  reasons: [ "reason 1", "reason 2", "..." ],   // 6–10 short lines
  letter:  [ "paragraph 1", "paragraph 2" ],    // one string per paragraph
  wishes:  [ "wish 1", "wish 2", "wish 3" ],    // future wishes for her
};
```

### The birthday date
Use the format `YYYY-MM-DDT00:00:00` (year-month-day, then `T00:00:00`).
- If the date is **in the future**, a live countdown scene appears and auto-celebrates at zero.
- If it's **today or in the past**, the countdown is skipped automatically.

---

## 🖼️ Step 2 — Add your photos

1. Put your image files into the **`images/`** folder.
2. Name them anything you like (e.g. `1.jpg`, `beach.jpg`, `us.png`).
3. List each one in the `photos` array in `CONFIG`, matching the filename:

```js
{ src: "images/beach.jpg", caption: "Goa, sunburnt and happy", year: "2024" }
```

- Any number from **3 to 30** photos works — the timeline adapts.
- If a photo is missing or fails to load, it shows an elegant gradient card with a heart — never a broken-image icon. So you can add captions first and photos later.
- Portrait photos look best (they're shown as polaroids), but any shape works.

---

## 🎵 Step 3 — Add a song (optional)

1. Put an `.mp3` file in the **`audio/`** folder.
2. Name it `song.mp3` (or change `song:` in `CONFIG` to match your filename).

The music starts when she taps **“Begin”** (browsers require a tap before audio can play).
There's a mute button in the top-right corner. If there's no song file, the button simply hides itself — no errors.

---

## 👀 Step 4 — Preview it on your computer

Just **double-click `index.html`** — it opens in your browser. That's it.

> Tip: if photos or audio don't appear when opening the file directly, run a tiny
> local server from this folder instead (optional):
> ```bash
> python3 -m http.server 8000
> ```
> then visit `http://localhost:8000` in your browser.

---

## 🚀 Step 5 — Put it online with GitHub Pages (free)

You'll get a public link you can send her.

1. **Create a GitHub account** at [github.com](https://github.com) if you don't have one.
2. **Create a new repository** (click the **+** top-right → *New repository*). Give it a name like `for-divya`. Keep it **Public**. Click **Create repository**.
3. **Upload the files:** on the new repo page, click **“uploading an existing file”**. Drag in **everything from this folder** — `index.html`, the `css`, `js`, `images`, and `audio` folders, and `README.md`. Then click **Commit changes**.
   - *(Prefer the command line? See the box below.)*
4. **Enable Pages:** go to the repo's **Settings** → **Pages** (left sidebar).
   - Under **“Build and deployment” → Source**, choose **Deploy from a branch**.
   - Set **Branch** to **`main`** and folder to **`/ (root)`**. Click **Save**.
5. **Wait ~1 minute**, then refresh that Settings → Pages screen. It will show your live link, like:
   ```
   https://YOUR-USERNAME.github.io/for-divya/
   ```
6. **Send her the link.** 💌 Tell her to open it on her phone and tap **Begin**.

### Optional: uploading via the command line
```bash
git init
git add .
git commit -m "For Divya"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/for-divya.git
git push -u origin main
```
Then do **Step 4 & 5** above to enable Pages.

---

## 🧭 The journey (what she'll experience)

1. **The Arrival** — a candle in the dark, her name, a “Begin” button.
2. **Countdown** — only if it's before her birthday; auto-celebrates at zero.
3. **Happy Birthday** — name reveal, balloons, confetti.
4. **The Cake** — she taps each flame to blow out the candles (or the “🎤 blow for real” button uses the mic).
5. **Our Story** — your photos as a scrolling polaroid timeline; tap any to enlarge.
6. **Reasons I Love You** — a deck of cards she taps through.
7. **The Letter** — your words, typed out on parchment.
8. **Wishes** — glowing lanterns floating into the night sky.
9. **Grand Finale** — fireworks, and one last button. 🤗

She advances with the **Begin / continue** buttons or the golden **dots** at the bottom.

---

## 🛠️ Troubleshooting

- **Photos don't show / show a heart card:** the filename in `CONFIG.photos` doesn't match a file in `images/`. Check spelling and extension (`.jpg` vs `.png`), including capital letters.
- **No music:** make sure the file is at `audio/song.mp3` (or update `song:` in CONFIG). Music only starts after tapping **Begin**.
- **Countdown didn't appear:** that's expected if the birthday is today/past. Set a future date to see it.
- **Nothing happens / blank page:** you likely have a typo in `CONFIG` (a missing comma or quote). Reopen `js/main.js` and check the edited lines.

---

Made with love. Happy birthday, Divya. ❤
