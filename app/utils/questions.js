import { useUser } from "@clerk/nextjs";
import useUserData from "/app/contexts/useDataContext";

export const questions = [
  {
    step: 1,
    title: "hopes and dreams",
    content:
      "Tell me your hopes and dreams. I want at least 250 words talking about what you want to achieve. For each goal you write about, tell me how you will feel when it is achieved. This isn't a test, there are no right answers, write anything that comes to mind. ",
    column: "hopes_and_dreams",
  },
  {
    step: 2,
    title: "skills and achievements",
    content:
      "Tell me about your skills and achievements. These can be from education, work, hobbies, overcoming life difficulties and so on. What gifts do you have, what nice things to other people say about you?",
    column: "skills_and_achievements",
  },
  {
    step: 3,
    title: "obstacles and challenges",
    content:
      "Tell me about the obstacles and challenges you are facing. What is holding you back? What are the things you should be doing that you don't do, and the things you shouldn't be doing that you should do? For each obstacle / challenge, tell me how you will feel when it is resolved. ",
    column: "obstacles_and_challenges",
  },
  {
    step: 4,
    title: "All done!",
    content:
      "That's great, I have all the info I need. You can now start the daily meditation and journallying exercises. It is recommended to restart this journalling process at least once a month as your goals to develop and change.",
    column: "",
  },
];
