import { useState, useEffect, useCallback } from "react";
import { SidebarAdmin } from "@/components/admin/layouts/SidebarAdmin";
import { NavbarAdmin } from "@/components/admin/layouts/NavbarAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, ShoppingCart, Users, CalendarIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useGetSalesQuery } from "@/services/api/admin/adminApi";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { cn } from "@/lib/utils";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export function SalesReportPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRange, setDateRange] = useState("all");

  const { data, isLoading, error } = useGetSalesQuery({ 
    page, 
    limit,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    dateRange 
  });

  const { sales = [], totalRevenue = 0, ordersCount = 0, customers = 0, totalPage = 1, currentPage = 1, totalDiscount } = data || {};

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    let start = null;
    let end = null;

    switch (range) {
      case 'weekly':
        start = startOfWeek(new Date());
        end = endOfWeek(new Date());
        break;
      case 'monthly':
        start = startOfMonth(new Date());
        end = endOfMonth(new Date());
        break;
      case 'yearly':
        start = startOfYear(new Date());
        end = endOfYear(new Date());
        break;
      case 'all':
        start = null;
        end = null;
        break;
    }

    setStartDate(start);
    setEndDate(end);
    setPage(1);
  };

  const handleCustomDateFilter = () => {
    setDateRange('custom');
    setPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Paid":
        return "green";
      case "Cancelled":
        return "red";
      case "Shipped":
        return "blue";
      default:
        return "gray";
    }
  };

  const downloadPDF = useCallback(() => {
    const doc = new jsPDF();
    
    const tableColumn = ["Order ID", "Date", "Customer", "Amount", "Payment Status"];
    
    const tableRows = sales.map(sale => [
      sale._id,
      sale.orderAt ? format(new Date(sale.orderAt), "PPP") : "Invalid date",
      sale.userDetails?.username,
      sale.payableAmount,
      sale.paymentStatus
    ]);
  
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 204); 
    doc.text("Dune Audio", 30, 31);
  
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); 
    doc.text("Sales Report", 14, 45);
  
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); 
    doc.text(`Generated on: ${format(new Date(), "PPP")}`, 14, 55);
    doc.text(`Total Revenue: ${totalRevenue}`, 14, 65);
    doc.text(`Total Orders: ${ordersCount}`, 14, 75);
    doc.text(`Total Customers: ${customers}`, 14, 85);
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 95,
    });
  
    doc.save(`sales_report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  }, [sales, totalRevenue, ordersCount, customers]);

  const downloadExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(sales.map(sale => ({
      'Order ID': sale._id,
      'Date': sale.orderAt ? format(new Date(sale.orderAt), "PPP") : "Invalid date",
      'Customer': sale.userDetails?.username,
      'Amount': sale.payableAmount,
      'Payment Status': sale.paymentStatus
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

    XLSX.utils.sheet_add_aoa(worksheet, [
      ["Dune Audio - Sales Report"],
      [`Generated on: ${format(new Date(), "PPP")}`],
      [`Total Revenue: ${totalRevenue}`],
      [`Total Orders: ${ordersCount}`],
      [`Total Customers: ${customers}`],
      []
    ], { origin: "A1" });

    XLSX.writeFile(workbook, `sales_report_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  }, [sales, totalRevenue, ordersCount, customers]);

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen">Error loading sales.</div>;

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <SidebarAdmin />
      <main className="flex-1">
        <NavbarAdmin
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          pageName="SALES REPORT"
        />

        <div className="p-6 space-y-8">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <Button 
                onClick={() => handleDateRangeChange('all')}
                variant={dateRange === 'all' ? 'default' : 'outline'}
                className={dateRange === 'all' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                All Time
              </Button>
              <Button 
                onClick={() => handleDateRangeChange('weekly')}
                variant={dateRange === 'weekly' ? 'default' : 'outline'}
                className={dateRange === 'weekly' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                This Week
              </Button>
              <Button 
                onClick={() => handleDateRangeChange('monthly')}
                variant={dateRange === 'monthly' ? 'default' : 'outline'}
                className={dateRange === 'monthly' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                This Month
              </Button>
              <Button 
                onClick={() => handleDateRangeChange('yearly')}
                variant={dateRange === 'yearly' ? 'default' : 'outline'}
                className={dateRange === 'yearly' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                This Year
              </Button>
              <Button 
                onClick={downloadPDF}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Download PDF Report
              </Button>
              <Button 
                onClick={downloadExcel}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Download Excel Report
              </Button>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span>to</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>End date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={handleCustomDateFilter} className="bg-orange-500 hover:bg-orange-600">
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRevenue}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ordersCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Discount</CardTitle>
                <Users className="h-4 w-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDiscount}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-orange-600 uppercase">Order Id</TableHead>
                    <TableHead className="text-orange-600 uppercase">Date</TableHead>
                    <TableHead className="text-orange-600 uppercase">Customer</TableHead>
                    <TableHead className="text-orange-600 uppercase">Amount</TableHead>
                    <TableHead className="text-orange-600 uppercase">Payment Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales?.map((sale) => (
                    <TableRow key={sale?._id}>
                      <TableCell className="font-medium">{sale?._id}</TableCell>
                      <TableCell className="font-medium">
                        {sale?.orderAt ? format(new Date(sale?.orderAt), "PPP") : "Invalid date"}
                      </TableCell>
                      <TableCell>{sale?.userDetails?.username}</TableCell>
                      <TableCell>{sale?.payableAmount}</TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: getStatusColor(sale?.paymentStatus), color: "white" }}>
                          {sale?.paymentStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Previous
            </Button>
            <span>Page {currentPage} of {totalPage}</span>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPage}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

