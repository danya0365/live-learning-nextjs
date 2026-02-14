import { HomeView } from "@/src/presentation/components/home/HomeView";
import { createServerHomePresenter } from "@/src/presentation/presenters/home/HomePresenterServerFactory";
import type { Metadata } from "next";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerHomePresenter();
  return presenter.generateMetadata();
}

/**
 * Home Page - Server Component
 * Handled by HomePresenter + HomeView following Clean Architecture
 */
export default async function HomePage() {
  const presenter = createServerHomePresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <HomeView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching home data:", error);
    // Fallback UI
    return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <div className="text-center">
           <h1 className="text-2xl font-bold text-foreground mb-2">
             เกิดข้อผิดพลาด
           </h1>
           <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลหน้าแรกได้</p>
         </div>
       </div>
    );
  }
}
