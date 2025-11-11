export type User = {
  id: string
  username: string
  email: string
  fullName: string
  password: string
  photo: string // URL o base64 de la foto del usuario
  contactInfo: {
    phone: string
    address: string
    location: string
  }
  productsForSale: string[] // IDs de los productos que el usuario tiene en venta
  createdAt: string
}

export type UserContactInfo = {
  phone: string
  address: string
  location: string
}

// Función para crear un nuevo usuario
export function createUser(
  username: string,
  email: string,
  fullName: string,
  password: string,
  photo: string,
  contactInfo: UserContactInfo
): User {
  return {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    username,
    email,
    fullName,
    password,
    photo,
    contactInfo,
    productsForSale: [],
    createdAt: new Date().toISOString()
  }
}

// Función para guardar usuario en localStorage
export function saveUserToStorage(user: User): void {
  const users = getUsersFromStorage()
  users.push(user)
  localStorage.setItem('cyberloot_users', JSON.stringify(users))
}

// Función para obtener usuarios de localStorage
export function getUsersFromStorage(): User[] {
  const usersJson = localStorage.getItem('cyberloot_users')
  return usersJson ? JSON.parse(usersJson) : []
}

// Función para obtener un usuario por ID
export function getUserById(id: string): User | undefined {
  const users = getUsersFromStorage()
  return users.find(user => user.id === id)
}

// Función para obtener un usuario por email
export function getUserByEmail(email: string): User | undefined {
  const users = getUsersFromStorage()
  return users.find(user => user.email === email)
}

// Función para obtener un usuario por username
export function getUserByUsername(username: string): User | undefined {
  const users = getUsersFromStorage()
  return users.find(user => user.username === username)
}

// Función para actualizar un usuario
export function updateUser(updatedUser: User): void {
  const users = getUsersFromStorage()
  const index = users.findIndex(user => user.id === updatedUser.id)
  if (index !== -1) {
    users[index] = updatedUser
    localStorage.setItem('cyberloot_users', JSON.stringify(users))
  }
}

// Función para agregar un producto a la lista de productos en venta de un usuario
export function addProductToUser(userId: string, productId: string): void {
  const user = getUserById(userId)
  if (user) {
    if (!user.productsForSale.includes(productId)) {
      user.productsForSale.push(productId)
      updateUser(user)
    }
  }
}

// Función para obtener los productos de un usuario
export function getUserProducts(userId: string): string[] {
  const user = getUserById(userId)
  return user ? user.productsForSale : []
}

// Función para autenticar un usuario (login)
export function authenticateUser(email: string, password: string): User | null {
  const user = getUserByEmail(email)
  if (user && user.password === password) {
    return user
  }
  return null
}

// Función para eliminar un usuario por ID
export function deleteUserById(userId: string): boolean {
  const users = getUsersFromStorage()
  const filteredUsers = users.filter(user => user.id !== userId)
  
  if (filteredUsers.length < users.length) {
    localStorage.setItem('cyberloot_users', JSON.stringify(filteredUsers))
    return true
  }
  return false
}

// Función para eliminar un usuario por email
export function deleteUserByEmail(email: string): boolean {
  const user = getUserByEmail(email)
  if (user) {
    return deleteUserById(user.id)
  }
  return false
}

// Función para eliminar todos los usuarios (útil para desarrollo/testing)
export function deleteAllUsers(): void {
  localStorage.removeItem('cyberloot_users')
  localStorage.removeItem('cyberloot_current_user')
}

