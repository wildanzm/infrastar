// src/components/ui/Chart.tsx

import React from "react";
import { BarChart3 } from "lucide-react";

// 1. Definisikan tipe untuk props yang diterima
interface ChartProps {
  data: {
    name: string;
    total: number;
  }[];
}

// 2. Terima 'data' sebagai prop dan hapus data statis
const Chart: React.FC<ChartProps> = ({ data }) => {
  // Hitung nilai maksimum dari data prop
  const maxValue = Math.max(...data.map((d) => d.total), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Statistik</h3>
          <p className="text-gray-600 text-sm">Total laporan per bulan</p>
        </div>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>

      <div className="flex items-end space-x-4 h-64">
        {/* 3. Gunakan 'data' dari props untuk me-render chart */}
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex items-end justify-center mb-2" style={{ height: "200px" }}>
              {/* Tampilkan satu bar untuk total laporan */}
              <div
                className="bg-blue-500 rounded-t w-1/2 min-h-4"
                style={{
                  height: maxValue > 0 ? `${(item.total / maxValue) * 100}%` : '1rem',
                }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 font-medium">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Total Laporan</span>
        </div>
      </div>
    </div>
  );
};

export default Chart;