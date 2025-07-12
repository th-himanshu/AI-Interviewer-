import React from 'react'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
function InterviewItemCard({ interview }) {



     const router=useRouter(); 

     const onStart=()=>{
        router.push('/dashboard/interview/'+interview?.mockId);
     }
    
    const onFeedbackPress=()=>{
        router.push('dashboard/interview/'+interview.mockId+'/feedback')
    }





  return (
    <div className="p-4 border shadow-sm rounded-lg my-3 bg-blue-100">
      <h2 className="font-bold text-lg text-blue-700">{interview.jobPosition}</h2>
      <p className="text-sm text-gray-600">Experience: {interview.jobExperience} years</p>
      <p className="text-sm text-gray-800">Stack: {interview.jobDesc}</p>
      <p className="text-sm text-gray-800">Created on: {interview.createdAt}</p>
      <div className='flex justify-between mt-3 gap-5'>
       
        <Button size="sm" variant="outline"  onClick={onFeedbackPress} >Feedback</Button>
        
        <Button size="sm"  onClick={onStart}>Start</Button>
      </div>
    </div>
  )
}

export default InterviewItemCard;
