import React from 'react';
import { Download, Users, Clock } from 'lucide-react';
import { ComparisonData } from '../types';

interface StatsGridProps {
  packages: ComparisonData;
}

function StatsGrid({ packages }: StatsGridProps) {
  const packageNames = Object.keys(packages);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Package Statistics</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left text-sm font-medium text-gray-500 pb-4">Metric</th>
              {packageNames.map(name => (
                <th key={name} className="text-left text-sm font-medium text-gray-500 pb-4 px-4">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-4 flex items-center">
                <Download className="h-5 w-5 text-green-600 mr-2" />
                Monthly Downloads
              </td>
              {packageNames.map(name => (
                <td key={name} className="px-4 py-4 text-gray-900">
                  {packages[name].downloads
                    .reduce((sum, day) => sum + day.downloads, 0)
                    .toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-4 flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                Maintainers
              </td>
              {packageNames.map(name => (
                <td key={name} className="px-4 py-4 text-gray-900">
                  {packages[name].maintainers}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-4 flex items-center">
                <Clock className="h-5 w-5 text-purple-600 mr-2" />
                Last Updated
              </td>
              {packageNames.map(name => (
                <td key={name} className="px-4 py-4 text-gray-900">
                  {packages[name].modified.toLocaleDateString()}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StatsGrid;