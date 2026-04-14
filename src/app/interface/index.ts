export enum RoleEnum {
    USER = 'USER',
    ADMIN = 'ADMIN',
    LIBRARIAN = 'LIBRARIAN'
}

export interface User {
    id: string | number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
    role: RoleEnum;
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

export interface Loan {
    id: number;
    loanDate: string;
    returnDate: string;
    isReturned: boolean;
    userId: number;
    bookId: number;
    firstName: string;
    lastName: string;
    bookTitle: string;
    late: boolean;
}

export interface Rating{
    id: number | string;
    date: Date | string;
    score: number;
    comment: string;
    book?: Book;
    user: User;
}