# (temp) Remix of A Little Christmas Joy

Create an interactive Christmas Advent Calendar web app layered across pages with rich animations, based on the attached spec and reference photos:

1. Architecture & Design System:
- Multi-page / routed web application (not 1 flat HTML file), fully responsive for both mobile and desktop.
- Default text color: #F5F1EB.
- Typography: Inter and DM Sans for body/UI, Barlow Condensed for titles/dates.

2. Opening Gate Page:
- Background: #39425F with a subtle vignette, subtle moving grain overlay, and realistic falling snow with organic drift and snowflake shapes.
- Center lock element: an elegant lock graphic/component that plays an unlock animation when 'unlock' is triggered.
- Underneath the lock: a rounded curved pill input bar in #E8DDD0 with text in #39425F. Password characters must be censored with little stars (★) instead of plain bullet dots.
- "Unlock" button at the end of the pill bar.
- Delay: The lock and input field smoothly fade in and slide upward into view after 2-3 seconds of page load.
- Initial password is 'hello'. Successful unlock smoothly transitions to the Calendar page.

3. Calendar Navigation Page (Advent House):
- Background: Rich dark Christmas red (#8B1E1E / wine red) with glowing, twinkling golden stars (4-point star shapes and shimmering star dust).
- Architectural House Form: An advent calendar styled as a charming holiday townhouse / advent house (following the attached reference photos: gabled roofline and clean, structured cream compartments).
- Header above the house:
  "A DAY CLOSER TO CHRISTMAS 2026"
  Subtitle in italics: "Even a little Grinch like you, who insists on hating Christmas, deserves a little joy and attention this time of year, if only because you are so terribly adored by me that I simply cannot allow you to miss out on being reminded of it."
- 25 Doors (December 1 to December 25):
  - Cream colored doors (#F5F1EB / #E8DDD0).
  - Special highlight styling for December 13 (birthday) and December 25 (Christmas Day) with red festive accents.
  - Doors feature an interactive 3D perspective opening flap animation.
  - Unlock schedule: automatically unlocks at 8:00 AM on each respective date (with a hidden testing toggle/override switch in the UI so the owner can preview any day).
  - Clicking a locked door: triggers a tactile shake and opens a sneak-peek modal with a live countdown timer (days, hours, minutes, seconds) until that day unlocks at 8:00 AM.
  - Clicking an unlocked door opens the door and navigates to that day's surprise sub-page (with initial delightful holiday content and easy placeholders to expand).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7bc5650b-306a-492b-944b-fa0b0bc5d7c3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
