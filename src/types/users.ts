export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Inactive' | 'Pending';
  }
  
  export interface UserFilters {
    search: string;
    role: string;
    status: string;
    sortBy: 'name' | 'email' ;
    sortOrder: 'asc' | 'desc';
  }