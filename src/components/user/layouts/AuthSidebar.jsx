import { X, LogIn, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

export const AuthSidebar = ({onClose}) => {
  const navigate = useNavigate()

  return (
    <>
      <AnimatePresence>
       
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-40"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
                  <Button onClick={onClose} variant="ghost" size="icon" className="hover:bg-gray-100">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>

                <div className="flex-grow p-6 space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                    <p className="text-lg font-medium mb-4 text-gray-700">You are not logged in</p>
                    <Button onClick={() => navigate("/sign-in")} className="w-full" size="lg">
                      <LogIn className="mr-2 h-5 w-5" /> Sign In
                    </Button>
                  </div>

                </div>

                <div className="p-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">© 2025 Your Company Name. All rights reserved.</p>
                </div>
              </div>
            </motion.div>
        
      </AnimatePresence>
    </>
  )
}

