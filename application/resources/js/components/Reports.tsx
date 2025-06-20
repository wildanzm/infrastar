import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2,
  MapPin,
  Clock,
  User,
  Camera,
} from "lucide-react";

const Reports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const reports = [
    {
      id: "RPT-001",
      title: "Large Pothole on Main Street",
      location: "Main Street & 5th Avenue",
      reporter: "John Doe",
      reportedAt: "2024-01-15 10:30 AM",
      status: "pending",
      priority: "high",
      type: "Pothole",
      description: "Large pothole causing traffic disruption",
      hasImage: true,
    },
    {
      id: "RPT-002",
      title: "Crack in Highway Surface",
      location: "Highway 101, Mile 45",
      reporter: "Jane Smith",
      reportedAt: "2024-01-14 02:15 PM",
      status: "in-progress",
      priority: "medium",
      type: "Crack",
      description: "Surface crack extending across lane",
      hasImage: true,
    },
    {
      id: "RPT-003",
      title: "Bridge Surface Damage",
      location: "Oak Avenue Bridge",
      reporter: "Mike Johnson",
      reportedAt: "2024-01-13 09:45 AM",
      status: "resolved",
      priority: "high",
      type: "Surface Damage",
      description: "Significant surface deterioration on bridge deck",
      hasImage: false,
    },
    {
      id: "RPT-004",
      title: "Minor Road Crack",
      location: "Elm Street",
      reporter: "Sarah Wilson",
      reportedAt: "2024-01-12 04:20 PM",
      status: "pending",
      priority: "low",
      type: "Crack",
      description: "Small crack near sidewalk",
      hasImage: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-green-700 bg-green-100";
      case "in-progress":
        return "text-blue-700 bg-blue-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-700 bg-red-100";
      case "medium":
        return "text-orange-700 bg-orange-100";
      case "low":
        return "text-green-700 bg-green-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
        <p className="text-gray-600 mt-2">Review and manage road damage reports</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Report</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  Location
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  Reporter
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                  Priority
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {report.hasImage ? (
                            <Camera className="w-5 h-5 text-blue-600" />
                          ) : (
                            <MapPin className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{report.id}</p>
                        <p className="text-sm text-gray-600">{report.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{report.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{report.reporter}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        report.priority
                      )}`}
                    >
                      {report.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{report.reportedAt}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No reports found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">{filteredReports.length}</span> of{" "}
          <span className="font-medium">{reports.length}</span> results
        </p>
        <div className="flex space-x-2">
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            1
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
