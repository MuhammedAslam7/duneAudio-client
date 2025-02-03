import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ShoppingBag, FileText, Truck, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

export function OrderSuccessPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    setOrderNumber(Math.floor(100000 + Math.random() * 900000).toString())
  }, [])

  const orderDetails = {
    items: [
      { name: 'Premium Widget', quantity: 2, price: 49.99 },
      { name: 'Deluxe Gadget', quantity: 1, price: 129.99 },
    ],
    subtotal: 229.97,
    shipping: 9.99,
    tax: 18.40,
    total: 258.36,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </motion.div>
          <h1 className="mt-4 text-3xl font-bold text-gray-800">Order Successful!</h1>
          <p className="mt-2 text-gray-600">Thank you for your purchase. Your order has been received and is being processed.</p>
        </div>

       
        <div className="mt-8 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-lg font-semibold text-gray-800">{orderNumber}</p>
          </div>
          <div>
              {/* <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="text-lg font-semibold text-gray-800">June 15, 2023</p> */}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {/* <motion.button
            onClick={() => setShowDetails(!showDetails)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md transition duration-300 ease-in-out flex items-center justify-center"
          >
            <FileText className="w-5 h-5 mr-2" />
            {showDetails ? 'Hide Order Details' : 'View Order Details'}
          </motion.button> */}

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-lg p-4 overflow-hidden"
              >
                <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${orderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${orderDetails.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${orderDetails.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Link to="/home" className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium shadow-md transition duration-300 ease-in-out flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </motion.button>
          </Link>
        </div>

        <div className="mt-8 flex justify-center space-x-8">
          <Link href="/track-order" className="text-green-600 hover:text-green-700 flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            Track Order
          </Link>
          <Link to="/my-orders" className="text-green-600 hover:text-green-700 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Order History
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? <Link href="/contact" className="text-green-600 hover:underline">Contact our support team</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

