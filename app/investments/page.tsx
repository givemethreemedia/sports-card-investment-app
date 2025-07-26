// app/investments/page.tsx

'use client';

import { useEffect, useState } from 'react';

interface InvestmentCard {
  name: string;
  image: string;
  sport: string;
  player: string;
  url: string;
  psa10Avg: number;
  psa9Avg: number;
  rawAvg: number;
  gemRate: number;
  liquidity: number;
  expectedRevenuePerCard: string;
  costPerCard: string;
  dollarROI: string;
  percentROI: string;
}

export default function Page() {
  const [data, setData] = useState<InvestmentCard[]>([]);
  const [sportFilter, setSportFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('ROI');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 20;

  useEffect(() => {
    fetch('/api/investments')
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const filteredData = data.filter((card) => {
    const matchesSport = sportFilter.length === 0 || sportFilter.includes(card.sport);
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.player.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'ROI':
        return parseFloat(b.percentROI) - parseFloat(a.percentROI);
      case 'Liquidity':
        return b.liquidity - a.liquidity;
      case 'GemRate':
        return b.gemRate - a.gemRate;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedData.length / cardsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const toggleSportFilter = (sport: string) => {
    setSportFilter((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const clearFilters = () => {
    setSportFilter([]);
    setSearchQuery('');
    setSortBy('ROI');
    setCurrentPage(1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Top Investment Opportunities</h1>

        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['Football', 'Baseball', 'Basketball'].map((sport) => (
              <button
                key={sport}
                className={`border px-3 py-1 rounded-full text-sm ${
                  sportFilter.includes(sport)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 border-gray-300'
                }`}
                onClick={() => toggleSportFilter(sport)}
              >
                {sport}
              </button>
            ))}
            <button
              onClick={clearFilters}
              className="ml-2 text-sm underline text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search player or card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md p-2 flex-grow"
            />
            <select
              className="border border-gray-300 rounded-md p-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="ROI">ROI %</option>
              <option value="Liquidity">Liquidity</option>
              <option value="GemRate">Gem Rate</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-sm">
                <th className="px-4 py-2 text-left">Card</th>
                <th className="px-4 py-2 text-left">Player</th>
                <th className="px-4 py-2 text-left">Sport</th>
                <th className="px-4 py-2 text-right">Raw Avg</th>
                <th className="px-4 py-2 text-right">PSA 10</th>
                <th className="px-4 py-2 text-right">PSA 9</th>
                <th className="px-4 py-2 text-right">Gem Rate</th>
                <th className="px-4 py-2 text-right">Liquidity</th>
                <th className="px-4 py-2 text-right">ROI %</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((card) => (
                <tr key={card.name} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <a
                      href={card.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-blue-600 hover:underline"
                    >
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <span>{card.name}</span>
                    </a>
                  </td>
                  <td className="px-4 py-2">{card.player}</td>
                  <td className="px-4 py-2">{card.sport}</td>
                  <td className="px-4 py-2 text-right">${card.rawAvg.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">${card.psa10Avg.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">${card.psa9Avg.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{(card.gemRate * 100).toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right">{card.liquidity.toFixed(1)}/wk</td>
                  <td className="px-4 py-2 text-right font-semibold text-green-600">
                    {card.percentROI}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-2 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
