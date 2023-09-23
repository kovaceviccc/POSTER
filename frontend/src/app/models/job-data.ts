import { Job } from "./job"

export interface JobData {
    items: Job[],
    meta: {
      totalItems: number,
      itemCount: number,
      itemsPerPage: number,
      totalPages: number,
      currentPage: number
    },
    links: {
      first: string,
      previous: string,
      next: string,
      last: string
    }
  }