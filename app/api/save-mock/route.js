import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export async function POST(req) {
  const body = await req.json();
  const resp = await db.insert(MockInterview).values({
    mockId: uuidv4(),
    jsonMockResp: body.jsonMockResp,
    jobPosition: body.jobPosition,
    jobDesc: body.jobDesc,
    jobExperience: body.jobExperience,
    createdBy: body.createdBy,
    createdAt: moment().format('DD-MM-yyyy')
  }).returning({ mockId: MockInterview.mockId });
  return NextResponse.json({ inserted: resp });
}