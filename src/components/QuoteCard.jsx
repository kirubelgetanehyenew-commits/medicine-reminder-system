const quotes = [
  "Health is wealth 💜",
  "Never skip your medicine 💊",
  "Stay strong and healthy 🚀",
  "Your health matters ✨",
];

function QuoteCard() {
  const randomQuote =
    quotes[
      Math.floor(
        Math.random() * quotes.length
      )
    ];

  return (
    <div className="bg-gradient-to-r from-pink-500 to-violet-500 rounded-[30px] p-8">
      <h2 className="text-2xl font-black">
        Daily Motivation
      </h2>

      <p className="mt-4 text-lg">
        {randomQuote}
      </p>
    </div>
  );
}

export default QuoteCard;