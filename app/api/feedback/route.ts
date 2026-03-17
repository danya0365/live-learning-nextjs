/**
 * POST /api/feedback
 * Creates a new feedback entry
 */

import { createServerFeedbackPresenter } from '@/src/presentation/presenters/feedback/FeedbackPresenterServerFactory';
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

    const presenter = await createServerFeedbackPresenter();

    const feedback = await presenter.submitFeedback(
      topic,
      email,
      message,
      category
    );

    return NextResponse.json(feedback, { status: 201 });
  } catch (error: any) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create feedback' },
      { status: 500 }
    );
  }
}
