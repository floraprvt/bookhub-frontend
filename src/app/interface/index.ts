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
    isbn: string;
    authors: Author[];
    description: string;
    categories: Category[];
    image: string;
    date: Date | string;
    ratings?: Rating[];
    isAvailable: boolean;
    availableCopies: number;
    totalCopies: number;
}

export interface Loan {
    id: number | string;
    loanDate: Date | string;
    returnDate: Date | string;
    isReturned: boolean;
    user: User;
    book: Book;
}

export interface Rating{
    id: number | string;
    date: Date | string;
    score: number;
    comment: string;
    book?: Book;
    user: User;
}