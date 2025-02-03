import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useGetCategoryBrandQuery } from "@/services/api/user/userApi";

export const FilterSidebar = ({ onFilterChange, initialFilters }) => {
  const [priceRange, setPriceRange] = useState(initialFilters?.priceRange);
  const [selectedCategories, setSelectedCategories] = useState(initialFilters.categories);
  const [selectedBrands, setSelectedBrands] = useState(initialFilters.brands);
  const { data, isLoading } = useGetCategoryBrandQuery();
  const { categories, brands } = data || {};

  useEffect(() => {
    onFilterChange({
      priceRange,
      categories: selectedCategories,
      brands: selectedBrands,
    });
  }, [priceRange, selectedCategories, selectedBrands]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  if (isLoading) return <div>Loading filters...</div>;

  return (
    <div className="w-64 p-4 bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Price Range</h4>
        <Slider
          min={0}
          max={8000}
          step={10}
          value={priceRange}
          onValueChange={handlePriceChange}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Categories</h4>
        {categories?.map((category) => (
          <div key={category} className="flex items-center mb-3">
            <Checkbox
              id={`category-${category}`}
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => handleCategoryChange(category)}
            />
            <Label htmlFor={`category-${category}`} className="ml-2">
              {category}
            </Label>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Brands</h4>
        {brands?.map((brand) => (
          <div key={brand} className="flex items-center mb-3">
            <Checkbox
              id={`brand-${brand}`}
              checked={selectedBrands.includes(brand)}
              onCheckedChange={() => handleBrandChange(brand)}
            />
            <Label htmlFor={`brand-${brand}`} className="ml-2">
              {brand}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};