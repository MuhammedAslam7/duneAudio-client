// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { DollarSign, Users, ShoppingBag, Download, CalendarIcon } from 'lucide-react';
// import { format } from "date-fns";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
// } from 'recharts';

// import { useGetPariSalesMutation } from '@/services/api/admin/adminApi';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// export function CustomSalesReport() {
//   const [getSalesReportData, { data: reportData, isLoading }] = useGetPariSalesMutation();
//   const [reportType, setReportType] = useState('pdf');
//   const [dateOption, setDateOption] = useState('currentMonth');
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());

//   const fetchReportData = () => {
//     const params = { 
//       option: dateOption,
//       ...(dateOption === 'custom' && {
//         startDate: startDate.toISOString(),
//         endDate: endDate.toISOString(),
//       })
//     };
//     console.log(params);
//     getSalesReportData(params);
//   };

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <h1 className="text-3xl font-bold mb-6">Sales Report</h1>
//       <div className="grid gap-6">
//         {/* Report Options */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Report Options</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-4">
//               <Select value={dateOption} onValueChange={setDateOption}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Select date range" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="currentMonth">Current Month</SelectItem>
//                   <SelectItem value="currentYear">Current Year</SelectItem>
//                   <SelectItem value="currentDate">Current Date</SelectItem>
//                   <SelectItem value="custom">Custom Range</SelectItem>
//                 </SelectContent>
//               </Select>
//               {dateOption === 'custom' && (
//                 <>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button variant="outline">
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {format(startDate, "PPP")}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0">
//                       <Calendar
//                         mode="single"
//                         selected={startDate}
//                         onSelect={setStartDate}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button variant="outline">
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {format(endDate, "PPP")}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0">
//                       <Calendar
//                         mode="single"
//                         selected={endDate}
//                         onSelect={setEndDate}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                 </>
//               )}
//               <Button onClick={fetchReportData}>Generate Report</Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Display Report Data */}
//         {reportData && (
//           <>
//             {/* Summary Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
//                   <DollarSign className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">${reportData.totalSales?.toFixed(2) || 0}</div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
//                   <Users className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{reportData.totalCustomers || 0}</div>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between pb-2">
//                   <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
//                   <ShoppingBag className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{reportData.totalOrders || 0}</div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Charts */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Sales Overview</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={reportData.salesOverview || []}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="_id" />
//                       <YAxis />
//                       <Tooltip />
//                       <Line type="monotone" dataKey="total" stroke="#8884d8" />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Pie Chart */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Category Sales</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={reportData.categorySales || []}
//                         dataKey="total"
//                         nameKey="_id"
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={80}
//                         fill="#8884d8"
//                         label
//                       >
//                         {(reportData.categorySales || []).map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
