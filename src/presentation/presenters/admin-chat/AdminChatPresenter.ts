import { 
  AdminChatSummary, 
  IChatRepository 
} from "@/src/application/repositories/IChatRepository";

export interface AdminChatCounts {
  active: number;
  new: number;
  follow_up: number;
  resolved: number;
  all: number;
  [key: string]: number;
}


export interface AdminChatViewModel {
  sessions: AdminChatSummary[];
  counts: AdminChatCounts;
  activeTab: string;
}

export class AdminChatPresenter {
  constructor(private readonly repository: IChatRepository) {}

  /**
   * Get the view model for the admin chat list page.
   * Handles data fetching, filtering, and count calculations.
   */
  async getViewModel(activeTab: string = "active"): Promise<AdminChatViewModel> {
    try {
      const allSessions = await this.repository.getAdminChatSummary();

      // 1. Calculate counts for badges
      const counts: AdminChatCounts = {
        active: allSessions.filter(s => s.isActive === true).length,
        new: allSessions.filter(s => s.status === "new").length,
        follow_up: allSessions.filter(s => s.status === "follow_up").length,
        resolved: allSessions.filter(s => s.isActive === false).length,
        all: allSessions.length,
      };

      // 2. Apply filtering
      const sessions = allSessions.filter(s => {
        if (activeTab === "active") return s.isActive === true;
        if (activeTab === "new") return s.status === "new";
        if (activeTab === "follow_up") return s.status === "follow_up";
        if (activeTab === "resolved") return s.isActive === false;
        return true; // "all"
      });

      return {
        sessions,
        counts,
        activeTab,
      };
    } catch (error) {
      console.error("AdminChatPresenter: Failed to get view model", error);
      throw error;
    }
  }

  /**
   * Get all chat sessions (raw)
   */
  async getAllSessions(): Promise<AdminChatSummary[]> {
    return await this.repository.getAdminChatSummary();
  }
}
