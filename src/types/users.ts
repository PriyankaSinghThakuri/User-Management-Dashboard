export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'User' | 'Manager' | 'Viewer';
    status: 'Active' | 'Inactive' | 'Pending';
    avatar?: string;
    phone?: string;
    department?: string;
    joinDate: string;
    lastActive: string;
  }
  
  export interface UserFilters {
    search: string;
    role: string;
    status: string;
    sortBy: 'name' | 'email' ;
    sortOrder: 'asc' | 'desc';
  }