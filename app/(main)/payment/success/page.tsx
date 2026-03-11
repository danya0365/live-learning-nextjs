import { PaymentSuccessView } from "@/src/presentation/components/payment/PaymentSuccessView";
import { createServerPaymentPresenter } from "@/src/presentation/presenters/payment/PaymentPresenterServerFactory";
import type { Metadata } from "next";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PaymentSuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await createServerPaymentPresenter();
  return presenter.generateMetadata();
}

/**
 * Payment Success Page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const sessionId = (resolvedSearchParams.session_id as string) || '';
  
  const presenter = await createServerPaymentPresenter();
  const viewModel = await presenter.getSuccessViewModel(sessionId);

  return (
    <PaymentSuccessView viewModel={viewModel} />
  );
}
