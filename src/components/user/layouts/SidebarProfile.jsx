import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, MapPin, Lock, Wallet, Tag, Users, ChevronRight } from 'lucide-react';

const menuItems = [
  { icon: Home, label: "My Profile", href: "/profile" },
  { icon: ShoppingBag, label: "My Orders", href: "/my-orders" },
  { icon: MapPin, label: "Delivery Address", href: "/address" },
  { icon: Lock, label: "Change Password", href: "/change-password" },
  { icon: Wallet, label: "Wallet", href: "/wallet" },
  // { icon: Tag, label: "Coupons", href: "/coupons" },
  // { icon: Users, label: "Referral", href: "/referral" },
];

export function SidebarProfile({heading}) {
  const location = useLocation();

  return (
    <nav className="w-64 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{heading}</h2>
      </div>
      <ul className="py-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <li key={index}>
              <Link
                to={item.href}
                className={`flex items-center justify-between px-4 py-3 text-sm transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-5 h-5 text-blue-600" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
