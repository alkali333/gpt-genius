import { fetchCoachingContent } from "/app/utils/server-actions";
import MissingDetails from "/app/components/messages/MissingDetails";
import BottomNav from "/app/components/BottomNav";

const welcomeMessages = [
  "an encouraging message, 10 powerful affirmations, and 1 inspiring quote.",
  "a list of suggestions of how they can achieve their goals and overcome obstacles and a genuine quote from a famous person.",
  "an insight into a future where they have achieved their goals and overcome challenges, include 3 affirmations to make this a reality.",
  "a playful story set in a fantasy of magic talking animals world where they are a hero and overcome all obstacles to reach their goals.",
  "a message from a wise guru, encouraging them on their journey. Use some humour.",
];

const randomMessage =
  welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

const WelcomePage = async () => {
  const welcomeMessage = await fetchCoachingContent(
    `Based on the user info, ${randomMessage}`
  );

  if (!welcomeMessage.data && welcomeMessage.message) {
    return (
      <MissingDetails>
        Could not load welcome message, have you completed the journalling
        exercise?
      </MissingDetails>
    );
  }

  return (
    <div className="max-w-2xl text-sm leading-loose">
      <h2 className="text-primary text-xl mb-7">Welcome To Attenshun</h2>
      <div
        className="text-secondary prose prose-slate max-w-none text-sm"
        dangerouslySetInnerHTML={{ __html: welcomeMessage.data }}
      />
      <BottomNav />
    </div>
  );
};

export default WelcomePage;
