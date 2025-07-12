// app/api/interview/[interviewId]/feedback/route.js
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { UserAnswer } from '@/utils/schema';

export async function GET(req, { params }) {
  try {
    const feedbackList = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    return Response.json({ success: true, feedbackList });
  } catch (err) {
    console.error('Error fetching feedback:', err);
    return Response.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
