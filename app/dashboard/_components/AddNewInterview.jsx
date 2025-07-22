"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import GeminiAiModel from '@/utils/GeminiAiModel';
import { LoaderCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


function AddNewInterview() {

    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDesc, setJobDesc] = useState();
    const [jobExperience, setJobExperience] = useState();
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const { user } = useUser();
    const router = useRouter();

    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();


        const InputPrompt = "Job Position: " + jobPosition + " Job Description/Tech Stack: " + jobDesc + ", Years of Experince:" + jobExperience + " ,Depend on the above information give me " + process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT + " questions with answers in json format Field of json question and answer";

        try {
            const result = await GeminiAiModel(InputPrompt);
            const MockJsonResp = result.match(/\[.*\]/s);

            if (MockJsonResp) {
                // Save to DB via API route
                const saveResp = await fetch('/api/save-mock', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonMockResp: MockJsonResp[0],
                        jobPosition,
                        jobDesc,
                        jobExperience,
                        createdBy: user?.primaryEmailAddress?.emailAddress,
                    }),
                });
                const saveData = await saveResp.json();
                const mockId = saveData.inserted[0].mockId; //get mockId from API response

                console.log(saveData);

                try {
                    const questionsArr = JSON.parse(MockJsonResp[0]);
                    setQuestions(questionsArr);
                    setLoading(false);
                    router.push('/dashboard/interview/' + mockId);

                } catch (err) {
                    console.error("JSON parse error:", err);
                }
            } else {
                console.error("No JSON array found in Gemini response.");
            }
        } catch (error) {
            console.error("Gemini API Error:", error);
        }
        setLoading(false);

    }

    return (
        <div>
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => { setOpenDialog(true) }}>
                <h2 className='text-lg text-center text-green-500'>+Add New</h2>
            </div>
            <Dialog open={openDialog}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell us about job profile</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <form onSubmit={onSubmit}>
                            <div>
                                <span className='font-bold'>Add details about your job interview</span>
                                <div className='mt-7 my-3'>
                                    <label>Job Role</label>
                                    <Input placeholder="Backend Developer" required
                                        onChange={(event) => { setJobPosition(event.target.value) }} />
                                </div>
                                <div className='my-3'>
                                    <label>Job Description/Tech Stack</label>
                                    <Textarea placeholder="Ex. NextJs PostGre JavaScript etc." required
                                        onChange={(event) => { setJobDesc(event.target.value) }} />
                                </div>
                                <div className='my-3'>
                                    <label>Year of Experience</label>
                                    <Input placeholder="Ex. 3" type="number" max="40" required
                                        onChange={(event) => { setJobExperience(event.target.value) }} />
                                </div>
                            </div>
                            <div className='flex gap-5 justify-end'>
                                <Button type="button" variant="ghost" onClick={() => { setOpenDialog(false); setLoading(false) }}>Cancel</Button>
                                <Button type="submit" disabled={loading}>
                                    {
                                        loading ?
                                            <>
                                                <LoaderCircle className='animate-spin' />'Generating Questions'
                                            </> : 'Start Interview'
                                    }
                                </Button>
                            </div>
                        </form>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
            {/* Display questions if available */}
            {questions.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-bold mb-2">Generated Questions:</h3>
                    <ul className="list-disc pl-5">
                        {questions.map((q, idx) => (
                            <li key={idx} className="mb-2">
                                <strong>Q:</strong> {q.question}<br />
                                <strong>A:</strong> {q.answer}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default AddNewInterview