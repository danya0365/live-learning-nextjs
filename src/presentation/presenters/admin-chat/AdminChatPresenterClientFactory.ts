'use client';

import { ApiChatRepository } from "@/src/infrastructure/repositories/api/ApiChatRepository";
import { AdminChatPresenter } from "./AdminChatPresenter";
import { MockChatRepository } from "@/src/infrastructure/repositories/mock/MockChatRepository";

export class AdminChatPresenterClientFactory {
  static create(): AdminChatPresenter {
    // In production/deployment, use ApiChatRepository
    const repository = new ApiChatRepository();

    // Use Mock for local dev if needed
    // const repository = new MockChatRepository();

    return new AdminChatPresenter(repository);
  }
}

export function createClientAdminChatPresenter(): AdminChatPresenter {
  return AdminChatPresenterClientFactory.create();
}
