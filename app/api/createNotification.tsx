import "server-only";
import { NextResponse } from 'next/server';
import { getTwilioMessage } from "@/utils/getTwilioMessage";

export async function POST(request: Request) {
    const parameters = await request.json() as {
        date: string,
        time: string,
        message: string
    };
  
    try {
      const twilioMessage = await getTwilioMessage(parameters.date, parameters.time, parameters.message);
      return NextResponse.json({ success: true, data: twilioMessage });
    } catch (error) {
      console.error('Error in getTwilio API route:', error);
      return NextResponse.json({ success: false, error: 'Twilio message error' }, { status: 500 });
    }
  }