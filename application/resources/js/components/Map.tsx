import React, { useState } from 'react';
import { MapPin, Filter, Layers, Navigation, Maximize } from 'lucide-react';

const Map: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [mapView, setMapView] = useState('satellite');

  const reportLocations = [
    { id: 1, lat: 40.7128, lng: -74.0060, type: 'pothole', priority: 'high', status: 'pending' },
    { id: 2, lat: 40.7589, lng: -73.9851, type: 'crack', priority: 'medium', status: 'in-progress' },
    { id: 3, lat: 40.7831, lng: -73.9712, type: 'surface', priority: 'high', status: 'resolved' },
    { id: 4, lat: 40.7505, lng: -73.9934, type: 'pothole', priority: 'low', status: 'pending' },
    { id: 5, lat: 40.7282, lng: -73.7949, type: 'crack', priority: 'medium', status: 'resolved' }
  ];

  const getMarkerColor = (priority: string, status: string) => {
    if (status === 'resolved') return 'bg-green-500';
    if (status === 'in-progress') return 'bg-blue-500';
    if (priority === 'high') return 'bg-red-500';
    if (priority === 'medium') return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  const filteredLocations = reportLocations.filter(location => {
    if (selectedFilter === 'all') return true;
    return location.status === selectedFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Map View</h1>
        <p className="text-gray-600 mt-2">Geographic visualization of road damage reports</p>
      </div>

      {/* Map Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Reports</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-gray-400" />
              <select
                value={mapView}
                onChange={(e) => setMapView(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="satellite">Satellite</option>
                <option value="street">Street View</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Navigation className="w-4 h-4" />
              <span>My Location</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Maximize className="w-4 h-4" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative h-96 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
          {/* Placeholder Map */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-gray-300"></div>
                ))}
              </div>
            </div>
            
            {/* Mock Roads */}
            <div className="absolute inset-0">
              <div className="absolute top-1/3 left-0 right-0 h-2 bg-gray-400 opacity-60"></div>
              <div className="absolute top-2/3 left-0 right-0 h-2 bg-gray-400 opacity-60"></div>
              <div className="absolute left-1/4 top-0 bottom-0 w-2 bg-gray-400 opacity-60"></div>
              <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-gray-400 opacity-60"></div>
            </div>
            
            {/* Report Markers */}
            {filteredLocations.map((location, index) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `${20 + (index * 15)}%`,
                  top: `${30 + (index * 10)}%`
                }}
              >
                <div className={`w-4 h-4 rounded-full ${getMarkerColor(location.priority, location.status)} shadow-lg group-hover:scale-125 transition-transform`}>
                  <div className="w-2 h-2 bg-white rounded-full m-1"></div>
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                    Report #{location.id} - {location.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center z-10">
            <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map View</h3>
            <p className="text-gray-500 max-w-md">
              This would be integrated with a mapping service like Google Maps or Mapbox to show real locations of reported road damage.
            </p>
          </div>
        </div>
      </div>

      {/* Legend and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Map Legend</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-700">High Priority (Pending)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Medium Priority (Pending)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Low Priority (Pending)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">In Progress</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Resolved</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Markers</span>
              <span className="text-sm font-medium text-gray-900">{filteredLocations.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">High Priority</span>
              <span className="text-sm font-medium text-red-600">
                {filteredLocations.filter(l => l.priority === 'high').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="text-sm font-medium text-blue-600">
                {filteredLocations.filter(l => l.status === 'in-progress').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Resolved</span>
              <span className="text-sm font-medium text-green-600">
                {filteredLocations.filter(l => l.status === 'resolved').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;