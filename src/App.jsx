import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthUserRoutes } from "./routes/AuthUserRoutes"
import {AdminRoutes} from "./routes/AdminRoutes"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth and User Routes */}
        <Route path="/*" element={<AuthUserRoutes />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Error Page */}
      </Routes>
    </BrowserRouter>
  )
}

export default App

