"use server";

export const getRandomQuote = () => {
  const quotes = [
    "Alexander Graham Bell: 'Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.'",
    "Aristotle: 'We are what we repeatedly do. Excellence, then, is not an habit, but an act.'",
    "Bruce Lee: 'The successful warrior is the ordinary person with laser-like focus.'",
    'Sir Isaac Newton was asked how he discovered the law of gravity. He replied, "By thinking about it all the time."',
    "Tony Robbins: 'Where focus goes, energy flows.'",
    "Confucius: 'The nature of man is always the same; it is their habits that separate them.'",
    "Winston Churchill: 'You will never reach your destination if you stop and throw stones at every dog that barks.'",
    "Roy T. Bennett: 'Focus on your strengths, not your weaknesses. Focus on your character, not your reputation. Focus on your blessings, not your misfortunes.'",
    "Lao Tzu: 'To the mind that is still, the whole universe surrenders.'",
    "Seneca: 'It's not that we have a short time to live, but that we waste much of it.'",
    "Marcus Aurelius: 'Concentrate every minute like a Roman— like a man— on doing what's in front of you with precise and genuine seriousness, tenderly, willingly, with justice.'",
    "Ralph Waldo Emerson: 'Concentration is the secret of strength in politics, in war, in trade, in short in all management of human affairs.'",
    "Thomas Edison: 'The successful person has the habit of doing the things failures don't like to do. They don't like doing them either necessarily. But their disliking is subordinated to the strength of their purpose.'",
    "Henry Ford: 'Whether you think you can, or you think you can't – you're right.'",
    "Steve Jobs: 'That's been one of my mantras - focus and simplicity. Simple can be harder than complex: You have to work hard to get your thinking clean to make it simple.'",
    "Oprah Winfrey: 'Energy is the essence of life. Every day you decide how you're going to use it by knowing what you want and what it takes to reach that goal, and by maintaining focus.'",
    "Michael Jordan: 'I've failed over and over and over again in my life. And that is why I succeed.'",
    "Napoleon Hill: 'The starting point of all achievement is desire. Keep this constantly in mind. Weak desire brings weak results, just as a small fire makes a small amount of heat.'",
    "Maya Angelou: 'Nothing will work unless you do.'",
    "Albert Einstein: 'Any man who can drive safely while kissing a pretty girl is simply not giving the kiss the attention it deserves.'",
    "Stephen Covey: 'The main thing is to keep the main thing the main thing.'",
  ];
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
};
