"use client"

import React, {use, useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function Feedback({ params }) {
   const { interviewId } = use(params);
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(`/api/interview/${interviewId}/feedback`);
        const data = await res.json();
        if (data.success) {
          console.log(data.feedbackList);
          setFeedbackList(data.feedbackList);
        }
      } catch (error) {
        console.error('Failed to fetch feedback:', error);
      }
    };

    fetchFeedback();
  }, [interviewId]);

  return (
    <div className='p-10'>
      <h2 className='text-3xl font-bold text-green-500'>Congratulation!</h2>
      <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>

      {
        feedbackList?.length === 0 ? (
          <h2 className='text-gray-500 mt-5'>No feedback record found.</h2>
        ) : (
          <>
            <h2 className='text-sm text-gray-500 mt-4'>Find below feedback, correct answer and other details:</h2>

            {feedbackList.map((item, index) => (
              <Collapsible key={index} className="mt-10">
                <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between w-full gap-5'>
                  {item.question}
                  <ChevronsUpDown />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className='flex flex-col gap-2'>
                    <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating: </strong>{item.rating}</h2>
                    <h2 className='p-2 border rounded-lg bg-red-50 text-sm '><strong>Your Answer: </strong>{item.userAns}</h2>
                    <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900 '><strong>Correct Ans: </strong>{item.correctAns}</h2>
                    <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900 '><strong>Feedback: </strong>{item.feedback}</h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </>
        )
      }

      <Button onClick={() => router.replace('/dashboard')} className='mt-10'>
        Go Home
      </Button>
    </div>
  );
}

export default Feedback;
