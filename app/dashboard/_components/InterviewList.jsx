"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";

function Interviewlist() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      try {
        const res = await fetch("/api/get-interview-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user.primaryEmailAddress.emailAddress }),
        });

        const data = await res.json();
        if (data.success) {
          setInterviewList(data.interviews);
        } else {
          console.error("Fetch failed:", data.error);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchInterviews();
  }, [user]);

  return (
    <div>
      <h2 className="font-md text-xl">Previous Interview Lists:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {interviewList.map((interview, index) => (
          <InterviewItemCard key={index} interview={interview} />
        ))}
      </div>
    </div>
  );
}

export default Interviewlist;
