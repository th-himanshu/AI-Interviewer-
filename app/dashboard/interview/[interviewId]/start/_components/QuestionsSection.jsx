import React from 'react'
import { Lightbulb } from 'lucide-react'

import { Volume2 } from 'lucide-react';
function QuestionsSection({mockInterviewQuestion, activeQuestionIndex}) {


const textToSpeech = (text) => {
  if ('speechSynthesis' in window) {
    // If already speaking, stop
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }
    const speech = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  } else {
    alert('Your browser does not support this feature.');
  }
}
 

  return mockInterviewQuestion && (
    <div className='p-5 border rounded-lg my-10'>
        <div className=' grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
         {mockInterviewQuestion&&mockInterviewQuestion.map((question,idx)=>(
            <h2
            key={idx}
            className={`p-2 bg-secondary rounded-full 
            text-xs md:tesxt-sm text-center cursor-pointer ${activeQuestionIndex==idx && 'bg-primary text-blue-500 font-bold'}`}>Question #{idx+1}</h2>
         ))}
         
         </div>
         <h2 className='my-5 font-bold text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
          
          {/* to listen the question */}
          <Volume2 className='cursor-pointer' onClick={()=>textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}/>


        <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
            <h2 className='flex gap-2 items-center text-blue-700 '>
                 <strong><Lightbulb/> Note:</strong> 
                 <span className='text-sm'>Click on Record Answer when you are ready. After all the questions being answered, feedback along with correct answer will be provided</span>
                 </h2>
        </div>

    </div>
  )
}

export default QuestionsSection