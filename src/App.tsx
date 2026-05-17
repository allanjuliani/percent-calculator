import { useState, useEffect } from 'react';
import { Calculator, Trash2, Clock, X } from 'lucide-react';

interface HistoryEntry {
  id: string;
  calculation: string;
  timestamp: Date;
}

export default function App() {
  const [x, setX] = useState<string>('');
  const [y, setY] = useState<string>('');
  const [z, setZ] = useState<string>('');
  const [resultado, setResultado] = useState<string>('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastCalculation, setLastCalculation] = useState<string>('');

  const calculate = (xVal: string, yVal: string, zVal: string, changedField: 'x' | 'y' | 'z' | null) => {
    if (!xVal && !yVal && !zVal) {
      setResultado('');
      return;
    }

    const xNum = parseFloat(xVal);
    const yNum = parseFloat(yVal);
    const zNum = parseFloat(zVal);

    const hasX = !isNaN(xNum) && xVal !== '';
    const hasY = !isNaN(yNum) && yVal !== '';
    const hasZ = !isNaN(zNum) && zVal !== '';

    let calculationResult = '';
    let newX = xVal;
    let newY = yVal;
    let newZ = zVal;

    // Determine what to calculate based on what's missing
    if (hasX && hasY && !hasZ) {
      // Calculate Z: X is Y% of Z => Z = X / (Y/100)
      const calculatedZ = (xNum * 100) / yNum;
      newZ = calculatedZ.toFixed(2);
      setZ(newZ);
      calculationResult = `${xNum} is ${yNum}% of ${calculatedZ.toFixed(2)}`;
    } else if (hasX && !hasY && hasZ) {
      // Calculate Y: X is Y% of Z => Y = (X/Z) * 100
      const calculatedY = (xNum / zNum) * 100;
      newY = calculatedY.toFixed(2);
      setY(newY);
      calculationResult = `${xNum} is ${calculatedY.toFixed(2)}% of ${zNum}`;
    } else if (!hasX && hasY && hasZ) {
      // Calculate X: X is Y% of Z => X = (Y/100) * Z
      const calculatedX = (yNum / 100) * zNum;
      newX = calculatedX.toFixed(2);
      setX(newX);
      calculationResult = `${calculatedX.toFixed(2)} is ${yNum}% of ${zNum}`;
    } else if (hasX && hasY && hasZ) {
      // All filled, just show the equation
      calculationResult = `${xNum} is ${yNum}% of ${zNum}`;
    }

    // Update result display
    if (calculationResult) {
      setResultado(calculationResult);

      // Add to history only if it's different from last calculation
      if (calculationResult !== lastCalculation) {
        setLastCalculation(calculationResult);
        setHistory((prev) => [
          {
            id: Date.now().toString() + Math.random(),
            calculation: calculationResult,
            timestamp: new Date(),
          },
          ...prev,
        ]);
      }
    }
  };

  const handleXChange = (value: string) => {
    setX(value);
  };

  const handleYChange = (value: string) => {
    setY(value);
  };

  const handleZChange = (value: string) => {
    setZ(value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      calculate(x, y, z, null);
    }, 100);
    return () => clearTimeout(timer);
  }, [x, y, z]);

  const limpar = () => {
    setX('');
    setY('');
    setZ('');
    setResultado('');
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Section */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Calculator className="w-8 h-8 text-indigo-400" />
            <h1 className="text-indigo-100">Percentage Calculator</h1>
          </div>

          <div className="space-y-6">
            {/* Visual equation */}
            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
              <p className="text-indigo-300">
                <span className="inline-block px-2 py-1 bg-gray-900 rounded mx-1">X</span>
                is
                <span className="inline-block px-2 py-1 bg-gray-900 rounded mx-1">Y%</span>
                of
                <span className="inline-block px-2 py-1 bg-gray-900 rounded mx-1">Z</span>
              </p>
            </div>

            {/* Field X */}
            <div>
              <label htmlFor="x" className="block text-gray-300 mb-2">
                Value (X)
              </label>
              <div className="relative">
                <input
                  id="x"
                  type="number"
                  value={x}
                  onChange={(e) => handleXChange(e.target.value)}
                  placeholder="Enter value"
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-white placeholder-gray-500 pr-10"
                />
                {x && (
                  <button
                    onClick={() => setX('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Field Y */}
            <div>
              <label htmlFor="y" className="block text-gray-300 mb-2">
                Percentage (Y%)
              </label>
              <div className="relative">
                <input
                  id="y"
                  type="number"
                  value={y}
                  onChange={(e) => handleYChange(e.target.value)}
                  placeholder="Enter percentage"
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-white placeholder-gray-500 pr-16"
                />
                {y && (
                  <button
                    onClick={() => setY('')}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  %
                </span>
              </div>
            </div>

            {/* Field Z */}
            <div>
              <label htmlFor="z" className="block text-gray-300 mb-2">
                Total (Z)
              </label>
              <div className="relative">
                <input
                  id="z"
                  type="number"
                  value={z}
                  onChange={(e) => handleZChange(e.target.value)}
                  placeholder="Enter total"
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-white placeholder-gray-500 pr-10"
                />
                {z && (
                  <button
                    onClick={() => setZ('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Clear Button */}
            <button
              onClick={limpar}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
            >
              Clear All
            </button>

            {/* Result */}
            {resultado && (
              <div className="bg-green-900/30 border-2 border-green-700 rounded-lg p-4">
                <p className="text-green-300 text-center">{resultado}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-400 border border-gray-700">
              <p className="mb-2 text-gray-300">💡 How to use:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-500">
                <li>Fill in any 2 fields</li>
                <li>The third will be calculated automatically</li>
                <li>Change any value to recalculate</li>
              </ul>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-indigo-400" />
              <h2 className="text-indigo-100">History</h2>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors border border-red-800"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[600px] space-y-3">
            {history.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <Calculator className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No calculations yet</p>
                <p className="text-sm mt-1">Start calculating to see your history</p>
              </div>
            ) : (
              history.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <p className="text-gray-200 mb-2">{entry.calculation}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(entry.timestamp)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
