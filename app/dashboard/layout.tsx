"use client"
import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar: visible on desktop, toggled on mobile */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-black transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:block`}>
        <Sidebar />
      </div>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
      {/* Main content area */}
      <main className="flex-1 lg:ml-0">
        <div className="container mx-auto px-4 py-6">
          <DashboardHeader onHamburgerClick={() => setSidebarOpen((open) => !open)} />
          {children}
        </div>
      </main>
    </div>
  )
}
