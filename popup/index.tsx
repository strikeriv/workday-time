import "globals.css"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { HashRouter, Route, Routes, useLocation } from "react-router-dom"

import { Main } from "~components/pages/main"
import { SettingsPage } from "~components/pages/settings"

const routesOrder = ["/", "/popup.html", "/settings"]

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const prevPathRef = useRef(location.pathname)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const prevIndex = routesOrder.indexOf(prevPathRef.current)
    const currIndex = routesOrder.indexOf(location.pathname)
    const safePrevIndex = prevIndex === -1 ? 0 : prevIndex
    const safeCurrIndex = currIndex === -1 ? 0 : currIndex
    setDirection(safeCurrIndex > safePrevIndex ? -1 : 1)
    prevPathRef.current = location.pathname
  }, [location.pathname])

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 * (direction ?? 1) }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 * (direction ?? 1) }}
      transition={{ duration: 0.2 }}
      style={{ height: "100%" }}>
      {children}
    </motion.div>

    // <motion.div style={{ height: "100%" }}>{children}</motion.div>
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
