import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import Writing from "./pages/Writing";
import PostForm from "./pages/PostForm";
import ReadingList from "./pages/ReadingList";
import SinglePost from "./pages/SinglePost";

    axios.defaults.baseURL = import.meta.env.VITE_API_URL

axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("Sending token:", token.slice(0, 20) + "...") 
    } else {
      console.log("No token found in sessionStorage")
    }
    return config
  },
  (error) => Promise.reject(error)
)

function Protected({ children }) {
  const token = sessionStorage.getItem('token')
  return token ? children : <Navigate to="/auth" replace />
}

function DashboardLayout() {
  return (
    <Protected>
      <Layout>
        <Dashboard />
      </Layout>
    </Protected>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/auth" element={<Layout><Auth /></Layout>} />
        <Route path="/post/:id" element={<Layout><SinglePost /></Layout>} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="writing" element={<Writing />} />
          <Route path="new" element={<PostForm />} />
          <Route path="edit/:id" element={<PostForm />} />
          <Route path="readinglist" element={<ReadingList />} />
        </Route>

        <Route path="*" element={<Layout><h1 className="text-center pt-20">404 Not Found</h1></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}