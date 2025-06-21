// src/components/ui/RecentReports.tsx

import React from "react";
import { Clock, MapPin, AlertTriangle } from "lucide-react";

// 1. Definisikan tipe untuk props yang diterima
type RecentReportItem = {
    id: number;
    title: string;
    location: string;
    status: 'pending' | 'in-progress' | 'resolved';
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    priority?: 'high' | 'medium' | 'low';
};

interface RecentReportsProps {
  reports: RecentReportItem[];
}

// Helper untuk mengubah string tanggal menjadi format "time ago" sederhana
// Anda bisa menggunakan library seperti `date-fns` untuk yang lebih canggih
const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

// 2. Terima 'reports' sebagai prop dan hapus data statis
const RecentReports: React.FC<RecentReportsProps> = ({ reports }) => {
    
  // Fungsi helper warna bisa tetap di sini
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-green-600 bg-green-50";
      case "in-progress":
        return "text-blue-600 bg-blue-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
        <AlertTriangle className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {/* 3. Gunakan 'reports' dari props untuk me-render list */}
        {reports.map((report) => (
          <div
            key={report.id}
            className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">#{report.id}</span>
                {/* Tampilkan priority jika ada */}
                {report.priority && (
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                    </span>
                )}
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                {report.status.replace('-', ' ')}
              </span>
            </div>

            <p className="text-sm font-medium text-gray-900 mb-1">{report.title}</p>
            <div className="flex items-center text-xs text-gray-500 space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{report.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                {/* Gunakan data 'created_at' yang sudah diformat */}
                <span>{formatTimeAgo(report.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
        View All Reports
      </button>
    </div>
  );
};

export default RecentReports;