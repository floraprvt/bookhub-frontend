export enum RoleEnum {
    USER = 'USER',
    ADMIN = 'ADMIN',
    LIBRARIAN = 'LIBRARIAN'
}

export interface User {
    id?: string | number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
    role: RoleEnum | string;
}

export interface Author {
    id: number | string;
    firstName: string;
    lastName: string;
}

export interface Category {
    id: number | string;
    name: string;
}

export interface Book {
    id: number | string;
    title: string;
    isbn?: string;
    author: Author[];
    description?: string;
    category: Category[];
    image: string;
    date?: Date | string;
    ratings?: Rating[];
    isAvailable: boolean;
    availableCopies?: number;
    totalCopies?: number;
    alt?: string;
}

export interface BookCatalog {
    id: string | number
    title: string
    authors: string[]
    authorIds: Array<string | number>
    categories: string[]
    categoryIds: Array<string | number>
    isbn: string
    description: string
    image: string
    date: string
    isAvailable: boolean
}

export interface BookFormData {
    title: string
    selectedAuthorIds: Array<string | number>
    selectedCategoryIds: Array<string | number>
    isbn: string
    description: string
    image: string
    date: string
    isAvailable: boolean
}

export interface BookSearchParams {
    title?: string;
    categoryList?: number[];
    authors?: number[];
    date?: string;
    isAvailable?: boolean;
    isbn?: string;
    page?: number;
    size?: number;
    sort?: string;
}

export interface BooksPageResponse {
    content: Book[];
    totalPages: number;
    totalElements?: number;
    number?: number;
    size?: number;
}

export interface Loan {
    id: number | string;
    loanDate: Date | string;
    returnDate: Date | string;
    isReturned: boolean;
    user: User;
    book: Book;
    late?: boolean; 
    daysRemaining?: number; 
}

export interface Rating {
    id: number | string;
    date: Date | string;
    score: number;
    comment: string;
    book?: Book;
    user: User;
}