import React from "react";
import { MapPin, Calendar, Activity } from "lucide-react";
import Chart from "./ui/Chart";
import RecentReports from "./ui/RecentReports";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Monitor road damage reports and system performance</p>
      </div>
      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Chart />
        </div>
        <div>
          <RecentReports />
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average</span>
              <span className="font-semibold">2.4 hours</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
            </div>
            <p className="text-sm text-green-600">12% faster than last month</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Locations</h3>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Downtown</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                42 reports
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Highway 1</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                38 reports
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Industrial Area</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                29 reports
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">New Reports</span>
              <span className="font-semibold text-blue-600">147</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Resolved</span>
              <span className="font-semibold text-green-600">112</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">In Progress</span>
              <span className="font-semibold text-orange-600">35</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
