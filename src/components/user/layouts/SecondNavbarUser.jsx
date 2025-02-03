import { Link } from "react-router-dom";

const navItems = [
  { name: "Home", href: "/home" },
  { name: "Products", href: "/product-list" },
  { name: "About", href: "/about-page" },
  { name: "Contact Us", href: "/contact" },
];

export const SecondNavbarUser = () => {
  return (
    <nav className="bg-black py-3 h-[45px] mt-20 flex items-center w-full">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-8 font-rubik uppercase">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className="text-white hover:text-red-600 transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
