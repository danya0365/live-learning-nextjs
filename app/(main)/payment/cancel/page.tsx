import { PaymentCancelView } from "@/src/presentation/components/payment/PaymentCancelView";
import { createServerPaymentPresenter } from "@/src/presentation/presenters/payment/PaymentPresenterServerFactory";
import type { Metadata } from "next";

// Tell Next.js this is a dynamic page (though cancel might be static, keeping consistency)
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await createServerPaymentPresenter();
  return presenter.generateCancelMetadata();
}

/**
 * Payment Cancel Page - Server Component
 * Uses presenter pattern following Clean Architecture
 */
export default async function PaymentCancelPage() {
  // No view model needed for this simple page, but structure allows it if needed
  
  return (
    <PaymentCancelView />
  );
}
