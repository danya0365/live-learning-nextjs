/**
 * POST /api/feedback
 * Creates a new feedback entry
 */

import { SupabaseFeedbackRepository } from '@/src/infrastructure/repositories/supabase/SupabaseFeedbackRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, email, message, category } = body;

    if (!topic || !message || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, message, category' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseFeedbackRepository(supabase);

    const feedback = await repository.create({
      topic,
      email,
      message,
      category,
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error: any) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create feedback' },
      { status: 500 }
    );
  }
}
