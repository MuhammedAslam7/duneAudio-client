import { Button } from "@/components/ui/button";
import { CustomDateFilter } from "./CustomDateFilter";

export function DateFilter({ 
  dateRange, 
  startDate, 
  endDate, 
  onDateRangeChange, 
  onStartDateChange, 
  onEndDateChange, 
  onCustomFilter 
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <Button 
          onClick={() => onDateRangeChange('all')}
          variant={dateRange === 'all' ? 'default' : 'outline'}
          className={dateRange === 'all' ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          All Time
        </Button>
        <Button 
          onClick={() => onDateRangeChange('weekly')}
          variant={dateRange === 'weekly' ? 'default' : 'outline'}
          className={dateRange === 'weekly' ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          This Week
        </Button>
        <Button 
          onClick={() => onDateRangeChange('monthly')}
          variant={dateRange === 'monthly' ? 'default' : 'outline'}
          className={dateRange === 'monthly' ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          This Month
        </Button>
        <Button 
          onClick={() => onDateRangeChange('yearly')}
          variant={dateRange === 'yearly' ? 'default' : 'outline'}
          className={dateRange === 'yearly' ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          This Year
        </Button>
      </div>

      <CustomDateFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        onFilter={onCustomFilter}
      />
    </div>
  );
}