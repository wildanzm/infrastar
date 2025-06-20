import React from "react";
import { BarChart3 } from "lucide-react";

const Chart: React.FC = () => {
  const data = [
    { month: "Jan", reports: 120, resolved: 95 },
    { month: "Feb", reports: 145, resolved: 120 },
    { month: "Mar", reports: 165, resolved: 140 },
    { month: "Apr", reports: 180, resolved: 155 },
    { month: "May", reports: 195, resolved: 170 },
    { month: "Jun", reports: 210, resolved: 185 },
  ];

  const maxValue = Math.max(...data.map((d) => Math.max(d.reports, d.resolved)));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Reports Trend</h3>
          <p className="text-gray-600 text-sm">Monthly comparison of reports vs resolved</p>
        </div>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>

      <div className="flex items-end space-x-6 h-64">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex items-end space-x-1 mb-2" style={{ height: "200px" }}>
              <div
                className="bg-blue-500 rounded-t flex-1 min-h-4"
                style={{
                  height: `${(item.reports / maxValue) * 100}%`,
                }}
              ></div>
              <div
                className="bg-green-500 rounded-t flex-1 min-h-4"
                style={{
                  height: `${(item.resolved / maxValue) * 100}%`,
                }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 font-medium">{item.month}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Reports</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Resolved</span>
        </div>
      </div>
    </div>
  );
};

export default Chart;
