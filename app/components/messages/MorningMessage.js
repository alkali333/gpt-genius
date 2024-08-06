import MissingDetails from "/app/components/messages/MissingDetails";

const MorningMessage = async () => {
  const morningMessage =
    await fetchCoachingContent(`Based on the USER INFO. Write a short message 
        (100 words) reminding them of their goals, things they are grateful for,
        and tasks. Invite them to record their daily gratitude and task list.`);

  const htmlMessage = marked(morningMessage.data);

  if (!morningMessage.data && morningMessage.message) {
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

export default MorningMessage;
