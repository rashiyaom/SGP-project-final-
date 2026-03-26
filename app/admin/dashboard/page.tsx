// /app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface OrderData {
  _id: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: { name: string; quantity: number }[];
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        // In a real app, you'd protect this and fetch ALL orders, not just by one email
        const response = await fetch(`/api/orders`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const result = await response.json();
        setOrders(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  // --- Data Processing for Charts ---

  // 1. Sales over time
  const salesData = {
    labels: orders.map(o => new Date(o.createdAt).toLocaleDateString()),
    datasets: [{
      label: 'Daily Sales ($)',
      data: orders.map(o => o.totalAmount),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    }],
  };

  // 2. Order status distribution
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      label: 'Order Statuses',
      data: Object.values(statusCounts),
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
      ],
    }],
  };

  // 3. Top selling products
  const productCounts = orders.flatMap(o => o.items).reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);
  
  const topProducts = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const topProductsData = {
    labels: topProducts.map(p => p[0]),
    datasets: [{
      label: 'Top 5 Selling Products',
      data: topProducts.map(p => p[1]),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }],
  };
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Revenue</h3>
          <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Orders</h3>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Avg. Order Value</h3>
          <p className="text-3xl font-bold">${(totalRevenue / totalOrders || 0).toFixed(2)}</p>
        </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Cancelled Orders</h3>
          <p className="text-3xl font-bold">{statusCounts['cancelled'] || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sales Over Time</h2>
          <Line data={salesData} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Status Distribution</h2>
          <Pie data={statusData} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          <Bar data={topProductsData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
