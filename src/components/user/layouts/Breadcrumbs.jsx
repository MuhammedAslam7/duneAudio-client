import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const Breadcrumbs = ({ currentPage }) => {
  const pages = ['Cart', 'Checkout-page', 'Payment']
  const currentIndex = pages.indexOf(currentPage)

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {pages.map((page, index) => (
          <li key={page} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />}
            {index <= currentIndex ? (
              <Link
                to={`/${page.toLowerCase()}`}
                className={`inline-flex items-center text-sm font-medium ${
                  index === currentIndex
                    ? 'text-primary font-bold'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {page}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-500">{page}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs