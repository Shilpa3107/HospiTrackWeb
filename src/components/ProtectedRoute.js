"use client"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"

const ProtectedRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth()
  const router = useRouter()

  if (!currentUser || !isAdmin) {
    router.push("/")
    return null
  }

  return children
}

export default ProtectedRoute