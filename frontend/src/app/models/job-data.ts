import { Job } from "./job"

export class JobData {
    items: Job[] = null!;
    meta: {
      totalItems: number,
      itemCount: number,
      itemsPerPage: number,
      totalPages: number,
      currentPage: number
    } = null!;
    links?: {
      first: string,
      previous: string,
      next: string,
      last: string
    } = null!
  }