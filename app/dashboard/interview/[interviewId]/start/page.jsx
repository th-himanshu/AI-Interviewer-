"use client"
import React, { useState, useEffect } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
function StartInterview({ params }) {
    const { interviewId } = typeof params.then === "function" ? React.use(params) : params;
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
    const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);

    useEffect(() => {
        fetch(`/api/interview/${interviewId}`)
            .then(res => res.json())
            .then(data => {
                setInterviewData(data);
                // Parse and set questions if data exists and has jsonMockResp
                if (data && data.jsonMockResp) {
                    try {
                        setMockInterviewQuestion(JSON.parse(data.jsonMockResp));
                    } catch (e) {
                        setMockInterviewQuestion([]);
                        console.error("Failed to parse questions:", e);
                    }
                }
            });
    }, [interviewId]);

    if (!interviewData) return <div>Loading...</div>;

    return (
        <div>
           <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* left side Question */}
             <QuestionsSection
             mockInterviewQuestion={mockInterviewQuestion}
             activeQuestionIndex={activeQuestionIndex}
             />
            {/* right side video/audio recording */}
            <RecordAnswerSection
            mockInterviewQuestion={mockInterviewQuestion}
             activeQuestionIndex={activeQuestionIndex}
             interviewData={interviewData}
            />
           </div>
           <div className='flex justify-end gap-6'>
           {activeQuestionIndex>0 && 
           <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
           {activeQuestionIndex!=mockInterviewQuestion?.length-1 &&
            <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button> } 
           {activeQuestionIndex==mockInterviewQuestion?.length-1 &&
             <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
            <Button>End Interview</Button> 
            </Link>
            } 
           </div>
        </div>
    )
}

export default StartInterview