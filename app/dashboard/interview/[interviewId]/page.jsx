"use client"
import React, { useEffect, useState } from 'react';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Webcam from 'react-webcam';
import Link from 'next/link'
function Interview({ params }) {
  const { interviewId } = typeof params.then === "function" ? React.use(params) : params;
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    fetch(`/api/interview/${interviewId}`)
      .then(res => res.json())
      .then(data => setInterviewData(data));
  }, [interviewId]);

  if (!interviewData) return <div>Loading...</div>;

  return (
    <div className='my-10 '>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 '>
      <div className='flex flex-col my-5 gap-5 '>
        <div className='flex flex-col gap-5 p-5 rounded-lg border'>
        <h2 className='text-lg'><strong>Job Role/Position:</strong> {interviewData.jobPosition}</h2>
        <h2 className='text-lg'><strong>Tech Stack/ Job Description:</strong> {interviewData.jobDesc}</h2>
        <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData.jobExperience}</h2>
        </div>
        <div>
          <h2 className='text-blue-700'><strong><Lightbulb/>INFO</strong></h2>
          <h2 className='text-blue-500'>Enable mic and camera then click on start to start interview,it has some questions you have to answer, then we will give you your results. 
            <br />NOTE-Video is not being recorded.</h2>
        </div>
      </div>
      <div>
        {webCamEnabled ? (
          <Webcam
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            mirrored={true}
            style={{ height: 300, width: 300 }}
          />
        ) : (
          <>
            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
            <Button variant="blue"  onClick={() => setWebCamEnabled(true)}>
              Enable Webcam And Microphone
            </Button>
          </>
        )}
      </div>
      <div className='flex justify justify-end'>
      <Link href={'/dashboard/interview/'+interviewId+'/start'}> <Button variant="green"> Start</Button></Link> 
      </div>
     </div>
    </div>
    
  );
}

export default Interview;