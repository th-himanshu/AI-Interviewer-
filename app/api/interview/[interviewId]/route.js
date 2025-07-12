//start page ke liye route hai....


import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    
  const result = await db.select().from(MockInterview)
    .where(eq(MockInterview.mockId,params.interviewId));
  if (!result.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(result[0]);
}