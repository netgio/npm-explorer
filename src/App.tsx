import React, { useState } from 'react';
import { Package, Search, X } from 'lucide-react';
import SearchBar from './components/SearchBar';
import PackageInfo from './components/PackageInfo';
import StatsGrid from './components/StatsGrid';
import DownloadChart from './components/DownloadChart';
import { PackageData, ComparisonData } from './types';

function App() {
  const [packages, setPackages] = useState<ComparisonData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPackageData = async (packageName: string) => {
    if (packages[packageName]) {
      setError('Package already added to comparison');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [npmData, downloadsData] = await Promise.all([
        fetch(`https://registry.npmjs.org/${packageName}`).then(res => res.json()),
        fetch(`https://api.npmjs.org/downloads/range/last-month/${packageName}`).then(res => res.json())
      ]);

      setPackages(prev => ({
        ...prev,
        [packageName]: {
          name: npmData.name,
          version: npmData['dist-tags'].latest,
          description: npmData.description,
          author: npmData.author?.name || 'Unknown',
          license: npmData.license,
          downloads: downloadsData.downloads,
          github: npmData.repository?.url?.replace('git+', '').replace('.git', '') || null,
          homepage: npmData.homepage,
          maintainers: npmData.maintainers?.length || 0,
          created: new Date(npmData.time.created),
          modified: new Date(npmData.time.modified)
        }
      }));
    } catch (err) {
      setError('Failed to fetch package data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removePackage = (packageName: string) => {
    setPackages(prev => {
      const newPackages = { ...prev };
      delete newPackages[packageName];
      return newPackages;
    });
  };

  const packageCount = Object.keys(packages).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Package className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">NPM Package Explorer</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar onSearch={fetchPackageData} loading={loading} />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {packageCount > 0 && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
              {Object.values(packages).map((pkg) => (
                <div key={pkg.name} className="relative">
                  <button
                    onClick={() => removePackage(pkg.name)}
                    className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <PackageInfo package={pkg} />
                </div>
              ))}
            </div>
            <StatsGrid packages={packages} />
            <DownloadChart packages={packages} />
          </div>
        )}

        {packageCount === 0 && !error && (
          <div className="mt-16 text-center">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-lg font-medium text-gray-900">Compare NPM Packages</h2>
            <p className="mt-2 text-gray-500">Search and add packages to compare their statistics</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;