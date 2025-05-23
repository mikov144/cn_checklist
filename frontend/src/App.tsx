// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Checklist from "./pages/Checklist"
import Profile from "./pages/Profile"
import { UserProvider } from "./context/UserContext"
import { NotesProvider } from "./context/NotesContext"
import { CategoriesProvider } from "./context/CategoriesContext"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <UserProvider>
      <CategoriesProvider>
        <NotesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<RegisterAndLogout />} />
              <Route path="/checklist" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
          </BrowserRouter>
        </NotesProvider>
      </CategoriesProvider>
    </UserProvider>
  )
}

export default App
