import { marked } from "marked";

import { fetchCoachingContent } from "/app/utils/server-actions";
import MissingDetails from "/app/components/messages/MissingDetails";

const WelcomePage = async () => {
  const welcomeMessage =
    await fetchCoachingContent(`Write an empowering statement for the user 
    and give them some tips based on their user info. 350 words and include a famous quote. `);

  const htmlMessage = marked(welcomeMessage.data);

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
        dangerouslySetInnerHTML={{ __html: htmlMessage }}
      />
    </div>
  );
};

export default WelcomePage;
