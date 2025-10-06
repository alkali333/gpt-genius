'use client'
import { useState, useEffect } from 'react'
import { FaMoon } from 'react-icons/fa'
import { FormContainer } from '/app/components/forms/FormContainer'
import DiaryInputV2 from '/app/components/forms/DiaryInputV2'

import {
  insertDiaryEntry,
  generateMorningPracticeMessage,
} from '/app/utils/server-actions'

import Meditation from '/app/components/Meditation'

const EveningPracticePage = () => {
  const [journalComplete, setJournalComplete] = useState(false)
  // const [userJson, setUserJson] = useState(null);
  const [encouragementMessage, setEncouragementMessage] = useState(null)

  const formsComplete = journalComplete

  useEffect(() => {
    // const getUserJson = async () => {
    //   const userJson = await fetchUserJson();
    //   const firstName = Object.keys(userJson)[0];
    //   const typeJson = userJson[firstName];
    //   setUserJson(typeJson);
    // };

    const getEncouragementMessage = async () => {
      const message = await generateMorningPracticeMessage()
      // const message = { data: "Message will go here... " };
      if (message.data) {
        setEncouragementMessage(message.data)
      } else {
        console.log('Error fetching encouragement message')
        setEncouragementMessage('')
      }
    }
    getEncouragementMessage()
    //  getUserJson();
  }, [])

  if (formsComplete) {
    return (
      <div>
        <h1 className="text-primary text-2xl mb-7">
          Morning meditation unlocked!
        </h1>
        <Meditation
          type="This is a meditation done in the morning to prepare the user for the day."
          useDiary
        />
      </div>
    )
  }

  return (
    <div className="grid grid-rows-[auto] max-w-2xl">
      <div>
        <div className="flex items-center mb-3">
          <FaMoon className="text-white-500 text-2xl" />
          <h1 className="text-primary text-2xl ml-1">Morning Practice</h1>
        </div>
        {encouragementMessage === null ? (
          <span className="loading loading-spinner loading-lg my-8"></span>
        ) : (
          <div
            className="my-8 text-secondary prose prose-slate max-w-none text-xl"
            dangerouslySetInnerHTML={{ __html: encouragementMessage }}
          />
        )}
        <FormContainer
          action={insertDiaryEntry}
          className="flex w-full items-center"
          onComplete={setJournalComplete}
        >
          <DiaryInputV2 words={100} type="morning" />
        </FormContainer>
      </div>
    </div>
  )
}

export default EveningPracticePage
