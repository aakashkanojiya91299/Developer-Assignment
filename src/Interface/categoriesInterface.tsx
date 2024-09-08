export interface Category {
    id: number;
    name: string;
    description: string;
    createdAt: string;
  }
  
  export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  }
  
  interface CategoriesResponse {
    success: boolean;
    message: string;
    categories: Category[];
    pagination: Pagination;
  }
  
  interface Data{
      data:CategoriesResponse
  }
  
  export interface Result{
      result:Data
  }