"use client"
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { Mic, WebcamIcon } from 'lucide-react'
import Webcam from 'react-webcam'
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import GeminiAiModel from '@/utils/GeminiAiModel';


function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {

    //text to speech hooks docs
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });


    const [userAnswer, setUserAnswer] = useState('');
    const { user } = useUser() //to get user mail
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (results.length > 0) {
            const lastTranscript = results[results.length - 1]?.transcript || '';
            setUserAnswer((prevAns) => prevAns + ' ' + lastTranscript);
        }
    }, [results]);


    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            UpdateUserAnswer();``
        }

    }, [userAnswer]);



    const StartStopRecording = async () => {
        if (isRecording) {

            stopSpeechToText();

        } else {
            startSpeechToText();
        }
    };


    const UpdateUserAnswer = async () => {

        console.log(userAnswer)
        setLoading(true);

        const feedBackPrompt =
            "Question:" +
            mockInterviewQuestion[activeQuestionIndex]?.question +
            ", User Answer:" +
            userAnswer +
            ", Based on question and user answer for given interview question " +
            "give us rating (out of 10) on the correctness of answer and feedback as area of improvement if any " +
            "give in just 3-5 lines in JSON format with rating field out of 10 and feedback field ";

        try {
            const result = await GeminiAiModel(feedBackPrompt);

            const jsonMatch = result.match(/\{[\s\S]*?\}/);
            if (jsonMatch) {
                try {
                    const feedbackObj = JSON.parse(jsonMatch[0]);
                    const { rating, feedback } = feedbackObj;

                    const saveResp = await fetch('/api/save-user-answer', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            mockIdRef: interviewData?.mockId,
                            question: mockInterviewQuestion[activeQuestionIndex]?.question,
                            correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
                            userAns: userAnswer,
                            feedback,
                            rating,
                            userEmail: user?.primaryEmailAddress?.emailAddress
                        })
                    });

                    const data = await saveResp.json();

                    if (data.success) {
                        toast('User answer recorded successfully');
                        setResults([]);
                    } else {
                        toast('Failed to save answer');
                    }
                    setResults([]);
                    setUserAnswer('');
                    setLoading(false);
                } catch (e) {
                    console.error("Failed to parse feedback JSON:", e);
                }
            } else {
                console.error("No JSON object found in Gemini response.");
            }
        } catch (error) {
            console.error("Gemini API Error:", error);
        }
    }



    return (
        <div>
            <div className='flex flex-col justify-center items-cneter bg-secondary rounde-lg p-5 my-10'>
                <WebcamIcon width={50} height={50} />
                <Webcam
                    mirrored={true}
                    style={{
                        height: '100%',
                        width: '100%',

                    }}
                />

            </div>
            <Button disabled={loading} variant="outline" onClick={StartStopRecording}>
                {
                    isRecording ?
                        <h2 className='text-red-500 flex gap-1.5'>
                            <Mic /> Stop Recording
                        </h2>
                        : 'Record Answer'
                }
            </Button>

        </div>
    )
}


export default RecordAnswerSection