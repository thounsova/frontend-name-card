import type { ICardResponse } from "@/types/card-types";
import request from "./request";

export type CardQueryParams = {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  is_deleted?: boolean;
  title?: string;
};

export const requestCard = () => {
  const GET_CARDS = async ({
    page,
    pageSize,
    sortBy,
    sortOrder,
    is_deleted = false,
    title,
  }: CardQueryParams): Promise<ICardResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(pageSize), // verify if backend expects `limit`
      sortBy,
      sortOrder,
      is_deleted: String(is_deleted),
    });

    if (title) {
      params.append("title", title);
    }

    const url = `/card/get-cards-by-admin?${params.toString()}`;

    // Here, assume `request` returns a Promise<any> or Promise<{ cards: ICardResponse }>
    const response: { cards: ICardResponse } = await request({
      url,
      method: "GET",
    });

    // Return the nested cards object which has { data, meta }
    return response.cards;
  };

  return { GET_CARDS };
};
