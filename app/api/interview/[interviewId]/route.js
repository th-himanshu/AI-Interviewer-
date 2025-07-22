//start page ke liye route hai....


import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function GET(req, { params }) {
    
  const result = await db.select().from(MockInterview)
    .where(eq(MockInterview.mockId,params.interviewId));
  if (!result.length) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(result[0]);
}