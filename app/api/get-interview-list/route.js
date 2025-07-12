import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { userEmail } = await req.json();
    const interviews = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, userEmail))
      .orderBy(desc(MockInterview.id));

    return Response.json({ success: true, interviews });
  } catch (error) {
    console.error('[INTERVIEW_FETCH_ERROR]', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
