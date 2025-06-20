import React from "react";
import { Clock, MapPin, AlertTriangle } from "lucide-react";

const RecentReports: React.FC = () => {
  const reports = [
    {
      id: "001",
      location: "Main Street & 5th Ave",
      type: "Pothole",
      priority: "high",
      time: "2 hours ago",
      status: "pending",
    },
    {
      id: "002",
      location: "Highway 101, Mile 45",
      type: "Crack",
      priority: "medium",
      time: "4 hours ago",
      status: "in-progress",
    },
    {
      id: "003",
      location: "Oak Avenue Bridge",
      type: "Surface Damage",
      priority: "high",
      time: "6 hours ago",
      status: "resolved",
    },
    {
      id: "004",
      location: "Industrial Blvd",
      type: "Pothole",
      priority: "low",
      time: "8 hours ago",
      status: "pending",
    },
  ];

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
        {reports.map((report) => (
          <div
            key={report.id}
            className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">#{report.id}</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(report.priority)}`}
                >
                  {report.priority}
                </span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
            </div>

            <p className="text-sm font-medium text-gray-900 mb-1">{report.type}</p>
            <div className="flex items-center text-xs text-gray-500 space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{report.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{report.time}</span>
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
