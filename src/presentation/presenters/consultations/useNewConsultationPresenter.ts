'use client';

import { ConsultationLevel, PreferredTime } from '@/src/application/repositories/IConsultationRepository';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { createClientConsultationsPresenter } from './ConsultationsPresenterClientFactory';

export function useNewConsultationPresenter() {
  const router = useRouter();

  // Navigation State
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [level, setLevel] = useState<ConsultationLevel>('beginner');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [preferredDates, setPreferredDates] = useState<string[]>(['']);
  const [preferredTimes, setPreferredTimes] = useState<PreferredTime[]>([{ start: '09:00', end: '12:00' }]);

  // Handlers
  const addDate = useCallback(() => setPreferredDates((prev) => [...prev, '']), []);
  const removeDate = useCallback((i: number) => setPreferredDates((prev) => prev.filter((_, idx) => idx !== i)), []);
  const updateDate = useCallback((i: number, val: string) => {
    setPreferredDates((prev) => {
      const updated = [...prev];
      updated[i] = val;
      return updated;
    });
  }, []);

  const addTimeSlot = useCallback(() => setPreferredTimes((prev) => [...prev, { start: '13:00', end: '16:00' }]), []);
  const removeTimeSlot = useCallback((i: number) => setPreferredTimes((prev) => prev.filter((_, idx) => idx !== i)), []);
  const updateTime = useCallback((i: number, field: 'start' | 'end', val: string) => {
    setPreferredTimes((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], [field]: val };
      return updated;
    });
  }, []);

  const canGoStep2 = title.trim() && categoryId && description.trim();
  const canGoStep3 = preferredDates.some((d) => d) && preferredTimes.length > 0 && budgetMin && budgetMax;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const presenter = createClientConsultationsPresenter();
      await presenter.createRequest({
        studentId: 'student-001', // TODO: Get from Auth
        categoryId,
        title: title.trim(),
        description: description.trim(),
        level,
        budgetMin: parseInt(budgetMin) || 0,
        budgetMax: parseInt(budgetMax) || 0,
        preferredDates: preferredDates.filter((d) => d),
        preferredTimes,
      });
      router.push('/consultations');
    } catch (err) {
      console.error(err);
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };

  return {
    state: {
      step,
      submitting,
      title,
      description,
      categoryId,
      level,
      budgetMin,
      budgetMax,
      preferredDates,
      preferredTimes,
      canGoStep2,
      canGoStep3,
    },
    actions: {
      setStep,
      setTitle,
      setDescription,
      setCategoryId,
      setLevel,
      setBudgetMin,
      setBudgetMax,
      addDate,
      removeDate,
      updateDate,
      addTimeSlot,
      removeTimeSlot,
      updateTime,
      handleSubmit,
    },
  };
}
