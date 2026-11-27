export type DayContent = { title: string; message: string; emoji: string };

// Placeholder surprises: edit each day's title, message and emoji here.
const defaults: DayContent[] = [
  { emoji: "☕", title: "Warm Beginnings", message: "Day one. Make yourself something hot, wrap up in a blanket and pretend, just for a minute, that you like this season." },
  { emoji: "🎶", title: "A Song for You", message: "Put on one Christmas song. Just one. I won't tell anyone if you hum along." },
  { emoji: "🍪", title: "Cookie Break", message: "Today calls for a cookie. Gingerbread preferred, but I'm not strict." },
  { emoji: "🕯️", title: "Candlelight", message: "Light a candle tonight and leave the big lights off. Cosy is allowed." },
  { emoji: "🧦", title: "Fuzzy Socks", message: "Cold feet are a choice. Choose warm ones." },
  { emoji: "🎄", title: "Saint Nicholas Eve", message: "Leave your boots out tonight. Something might find its way in." },
  { emoji: "📮", title: "A Little Note", message: "Just a reminder: you are thought about, a lot." },
  { emoji: "❄️", title: "First Frost", message: "Look out the window for a moment. The world is quietly glittering." },
  { emoji: "🎬", title: "Movie Night", message: "Tonight's prescription: one festive film. Grumbling permitted." },
  { emoji: "🍊", title: "Oranges & Cloves", message: "The smell of oranges and cloves is basically a hug. Try it." },
  { emoji: "🧣", title: "Wrapped Up", message: "Scarf on, chin up. You've got this week." },
  { emoji: "✨", title: "Almost Birthday", message: "Tomorrow is a very important day. Rest up." },
  { emoji: "🎂", title: "Happy Birthday", message: "Today is entirely about you. Happy birthday, my favourite little Grinch." },
  { emoji: "🌟", title: "Starlight", message: "Find the brightest star tonight. That one's yours." },
  { emoji: "🍫", title: "Hot Chocolate", message: "Extra marshmallows. That's an order." },
  { emoji: "📖", title: "Story Time", message: "Read a few pages of something lovely before bed." },
  { emoji: "🎁", title: "Wrapping Paper", message: "Even the grumpiest heart can appreciate a perfect bow." },
  { emoji: "🛷", title: "Sledge Day", message: "Pretend you're seven for five minutes. It's good for you." },
  { emoji: "🔔", title: "Jingle", message: "Listen out for bells today. They're everywhere once you notice." },
  { emoji: "🌲", title: "Pine Needles", message: "The tree smell. You secretly love it. Admit it." },
  { emoji: "🌙", title: "Longest Night", message: "The darkest night of the year. From here, the light comes back." },
  { emoji: "🥨", title: "Christmas Market", message: "Punsch, a pretzel and fairy lights. Classic." },
  { emoji: "💌", title: "Two Days", message: "Two sleeps left. Nearly there." },
  { emoji: "🕊️", title: "Christmas Eve", message: "Heiligabend. Slow down, eat well, be loved." },
  { emoji: "🎅", title: "Merry Christmas", message: "You made it. Merry Christmas, you adored little Grinch." },
];

export function getDayContent(day: number): DayContent {
  return defaults[day - 1] ?? { emoji: "🎁", title: `December ${day}`, message: "A surprise is coming." };
}
