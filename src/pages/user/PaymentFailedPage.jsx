import { useState } from "react"
import { motion } from "framer-motion"
import { XCircle, ArrowRight, RefreshCw, ChevronLeft, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Link, useNavigate } from "react-router-dom"

export function PaymentFailedPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="pt-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              We encountered an issue while processing your payment. Don't worry, no charges were made.
            </p>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">What can you do?</h2>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Double-check your payment details</h3>
                <p className="mt-1 text-sm text-gray-500">Ensure all the information is correct and up-to-date.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Try a different payment method</h3>
                <p className="mt-1 text-sm text-gray-500">If available, use an alternative card or payment option.</p>
              </div>
            </div>
          </div>
        </CardContent>
        <Separator className="my-6" />
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-4 w-full items-center flex-col">
            <Button className="w-full sm:w-auto" onClick={() => navigate("/my-orders")}>
                <>
                  Try Again
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
            
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

