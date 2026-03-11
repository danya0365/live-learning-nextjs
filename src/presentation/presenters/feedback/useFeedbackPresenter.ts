'use client';

import { useState } from 'react';
import { createClientFeedbackPresenter } from './FeedbackPresenterClientFactory';

export function useFeedbackPresenter() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presenter = createClientFeedbackPresenter();

  const submitFeedback = async (topic: string, email: string | undefined, message: string, category: string) => {
    setLoading(true);
    setError(null);
    try {
      await presenter.submitFeedback(topic, email, message, category);
      setSubmitted(true);
    } catch (err: any) {
      setError('ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitted,
    error,
    submitFeedback,
  };
}
