import "globals.css"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { HashRouter, Route, Routes, useLocation } from "react-router-dom"

import { Main } from "~components/pages/main"
import { SettingsPage } from "~components/pages/settings"

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const [direction, setDirection] = useState(1)
  const location = useLocation()

  useEffect(() => {
    setDirection(location.pathname === "/" ? 1 : -1)
  }, [location.pathname])

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 * direction }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 * direction }}
      transition={{ duration: 0.2 }}
      style={{ height: "100%" }}>
      {children}
    </motion.div>
  )
}

const AnimatedRoutes = () => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Main />
            </PageWrapper>
          }
        />
        <Route
          path="/settings"
          element={
            <PageWrapper>
              <SettingsPage />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

const IndexPopup = () => (
  <div className="flex h-full w-[25rem] flex-col rounded-lg">
    <HashRouter>
      <AnimatedRoutes />
    </HashRouter>
  </div>
)

export default IndexPopup
