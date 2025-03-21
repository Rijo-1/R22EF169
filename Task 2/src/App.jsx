import React from 'react';
import { useQuery } from 'react-query';
import clsx from 'clsx';

const numberTypes = [
  { id: 'p', label: 'Prime' },
  { id: 'f', label: 'Fibonacci' },
  { id: 'e', label: 'Even' },
  { id: 'r', label: 'Random' }
];

function App() {
  const [selectedType, setSelectedType] = React.useState('e');

  const { data, isLoading, error, refetch } = useQuery(
    ['numbers', selectedType],
    () => fetch(`/numbers/${selectedType}`).then(res => res.json()),
    { refetchOnWindowFocus: false }
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Average Calculator
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {numberTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={clsx(
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    selectedType === type.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center text-gray-600">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-600">
                  Error fetching data. Please try again.
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h2 className="font-semibold text-gray-700 mb-2">Previous Window State</h2>
                      <div className="flex flex-wrap gap-2">
                        {data?.windowPrevState.length ? (
                          data.windowPrevState.map((num, i) => (
                            <span
                              key={i}
                              className="bg-gray-200 px-3 py-1 rounded-full text-gray-700"
                            >
                              {num}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">Empty</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h2 className="font-semibold text-gray-700 mb-2">Current Window State</h2>
                      <div className="flex flex-wrap gap-2">
                        {data?.windowCurrState.length ? (
                          data.windowCurrState.map((num, i) => (
                            <span
                              key={i}
                              className="bg-blue-100 px-3 py-1 rounded-full text-blue-700"
                            >
                              {num}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">Empty</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h2 className="font-semibold text-blue-700 mb-2">Average</h2>
                      <span className="text-2xl font-bold text-blue-600">
                        {data?.avg.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => refetch()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;