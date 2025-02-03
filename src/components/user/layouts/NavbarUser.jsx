import React, { useState, useEffect, useRef } from "react"
import { Search, ChevronDown, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FaUser, FaShoppingCart, FaHeart } from "react-icons/fa"
import { useUserlogoutMutation } from "@/services/api/user/authApi"
import { useDispatch } from "react-redux"
import { userLogout } from "@/redux/slices/userSlice"
import { useAllProductsForSearchQuery } from "@/services/api/user/userApi"

export const NavbarUser = ({ itemsInCart }) => {
  const { data, isLoading } = useAllProductsForSearchQuery()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [userlogout] = useUserlogoutMutation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const searchQuery = searchParams.get("search")
    if (searchQuery) {
      setSearchTerm(searchQuery)
    }
  }, [location])

  useEffect(() => {
    if (data && searchTerm) {
      const filtered = data?.allProducts?.filter(
        (product) =>
          product?.productName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          product?.category?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          product?.brand?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
      )
      setFilteredProducts(filtered)
      setShowDropdown(true)
    } else {
      setFilteredProducts([])
      setShowDropdown(false)
    }
  }, [searchTerm, data])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm) {
      console.log(encodeURIComponent(searchTerm))
      navigate(`/product-list?search=${encodeURIComponent(searchTerm)}`)
      setShowDropdown(false)
    }
  }

  const handleLogout = async () => {
    try {
      await userlogout().unwrap()
      console.log("logout user")
      dispatch(userLogout())
      window.location.href = "sign-in"
    } catch (error) {
      console.log(error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div>
              <img
                src="/logo/IMG_20250127_121203.jpg"
                alt="Dune Logo"
                className="h-[65px] w-auto object-fill ml-3 rounded-sm"
              />
            </div>
            <span className="text-4xl font-jacquard">Dune Audio</span>
          </Link>

          <div className="flex-1 gap-3 max-w-2xl mx-auto flex mt-3 mb-3" ref={searchRef}>
            <div className="flex-1 flex flex-col relative">
              <form onSubmit={handleSearch} className="flex border border-gray-300 rounded-md overflow-hidden">
                <input
                  type="search"
                  placeholder="Search for your item"
                  className="w-full focus:outline-none px-4 py-2"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Button type="submit" variant="ghost" className="rounded-l-none hover:bg-gray-100">
                  <Search className="h-5 w-5" />
                </Button>
              </form>
              {showDropdown && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => navigate(`/product-details/${product._id}`)}
                    >
                      <img
                        src={product.thumbnailImage || "/placeholder.svg"}
                        alt={product.productName}
                        className="w-10 h-10 object-contain mr-2"
                      />
                      <div>
                        <div className="font-semibold">{product.productName}</div>
                        <div className="text-sm text-gray-500">${product.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-12">
            <button
              className="flex flex-col items-center gap-1 hover:text-gray-600 transition-colors"
              aria-label="Wishlist"
            >
              <FaHeart className="h-6 w-6" onClick={() => navigate("/wishlist")} />
            </button>
            <button
              className="flex flex-col items-center gap-1 hover:text-gray-600 transition-colors"
              aria-label="Shopping cart"
              onClick={() => navigate("/cart")}
            >
              <div className="relative">
                <FaShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {itemsInCart}
                </span>
              </div>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <FaUser className="size-5" />
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 size-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

