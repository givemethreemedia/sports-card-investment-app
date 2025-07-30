'use client';

import { useState, useEffect } from 'react';

interface SoldListing {
  title: string;
  price: number;
  imageUrl: string;
  link: string;
  date: string;
}

export default function InvestmentsPage() {
  const [listings, setListings] = useState<SoldListing[]>([]);
  const [query, setQuery] = useState('baseball card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/scrape?q=${encodeURIComponent(query)}&limit=50`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: SoldListing[] = await res.json();
        setListings(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, [query]);

  const totalPages = Math.ceil(listings.length / perPage);
  const paged = listings.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sold Listings</h1>

      <div className="flex mb-4">
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search term"
          className="border rounded p-2 flex-grow"
        />
        <button
          onClick={() => setPage(1)}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go
        </button>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Image</th>
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Price</th>
              <th className="border p-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="border p-2">
                  <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover" />
                </td>
                <td className="border p-2">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {item.title}
                  </a>
                </td>
                <td className="border p-2">${item.price.toFixed(2)}</td>
                <td className="border p-2">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
