// app/api/save-answer/route.js

import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import moment from 'moment';

// Only allow POST requests
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      mockIdRef,
      question,
      correctAns,
      userAns,
      feedback,
      rating,
      userEmail
    } = body;

    const resp = await db.insert(UserAnswer).values({
      mockIdRef,
      question,
      correctAns,
      userAns,
      feedback,
      rating,
      userEmail,
      createdAt: moment().format('DD-MM-yyyy')
    });

    return Response.json({ success: true, data: resp });
  } catch (error) {
    console.error('[SAVE_ANSWER_ERROR]', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
