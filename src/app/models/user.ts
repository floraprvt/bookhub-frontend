export type User = {
  email: string
  password: string
  lastName?: string
  firstName?: string
  phone?: string
  token?: string
  role?: string
}

export type Registered = {
  lastName: string
  firstName: string
  phone: string
  email: string
  password: string
}
