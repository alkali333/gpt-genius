import { fetchCoachingContent } from '/app/utils/server-actions'
import MissingDetails from '/app/components/messages/MissingDetails'
import BottomNav from '/app/components/BottomNav'

const welcomeMessages = [
  'an encouraging message about how their focused thoughts shape their reality, 10 powerful affirmations that direct their mental energy toward their goals, and 1 inspiring quote about the power of attention and intention.',
  'a list of suggestions of how they can achieve their goals and overcome obstacles by maintaining focused attention on what they want to create, and a genuine quote from a famous person about the power of directed thought.',
  'an insight into a future where they have achieved their goals and overcome challenges through the power of sustained mental focus, include 3 affirmations that help them direct their thoughts and attention to make this reality manifest.',
  'a playful story set in a fantasy of magic talking animals world where they are a hero who discovers that their focused thoughts and unwavering attention create the magic needed to overcome all obstacles and reach their goals.',
  "a message from a wise guru about how mastering one's attention and directing thoughts purposefully is the key to their journey, encouraging them with wisdom about the power of mental focus. Use some humour.",
  'a transmission from their future self who explains how the consistent practice of directing thoughts and maintaining focused attention on their goals led to all their dreams becoming reality, with 5 specific mental focus techniques they used.',
  "a quirky weather forecast for their mind, describing how their thought patterns and attention focus create different 'mental climates' and how to direct their mental energy toward sunny goal-achieving conditions. Include some playful meteorological metaphors.",
  "an archaeological discovery report where they've uncovered ancient scrolls revealing that focused intention and directed thoughts are the lost secrets to manifesting goals, written as if they're Indiana Jones of the mind. Include 4 'ancient' focus practices.",
  "a cooking recipe where the ingredients are different types of focused thoughts and attention, with step-by-step instructions on how to 'cook up' their goals through mental direction and intentional thinking. Make it fun and slightly absurd.",
  "a letter from an alien civilization that has mastered the art of thought-directed reality creation, explaining how they can use focused attention as humans' superpower to achieve their goals, with 3 'universal laws' of mental focus. Add some cosmic humor.",
]

const randomMessage =
  welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]

const WelcomePage = async () => {
  const today = new Date()
  const day = today.getDate()
  const month = today.toLocaleString('default', { month: 'long' })

  const getOrdinalSuffix = (day) => {
    const suffixes = { 1: 'st', 2: 'nd', 3: 'rd' }
    return (day > 3 && day < 21) || !suffixes[day % 10]
      ? 'th'
      : suffixes[day % 10]
  }

  const currentDate = `Today is the ${day}${getOrdinalSuffix(day)} of ${month}`

  const welcomeMessage = await fetchCoachingContent(
    `Based on the user info, ${randomMessage} (around 300 words)`
  )

  if (!welcomeMessage.data && welcomeMessage.message) {
    return (
      <MissingDetails>
        Could not load welcome message, have you completed the journalling
        exercise?
      </MissingDetails>
    )
  }

  return (
    <div className="max-w-2xl leading-loose">
      <h2 className="text-primary text-2xl mb-7">Welcome To Attenshun</h2>
      <p className="text-xl my-7 text-accent">{currentDate}</p>
      <div
        className="text-secondary text-xl  prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: welcomeMessage.data }}
      />
      <BottomNav />
    </div>
  )
}

export default WelcomePage
