'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { FaArrowLeft, FaTree, FaSolarPanel, FaBicycle, FaRecycle, FaWater, FaWind, FaCoins, FaCheckCircle } from 'react-icons/fa';

const BUILDINGS = [
  {
    id: 'park',
    name: 'Công viên xanh',
    icon: <FaTree className="text-green-500" size={32} />,
    emoji: '🌳',
    cost: 10,
    greenPoints: 5,
    description: 'Tăng không gian xanh cho thành phố',
    pollution: -10
  },
  {
    id: 'solar',
    name: 'Tấm pin mặt trời',
    icon: <FaSolarPanel className="text-yellow-500" size={32} />,
    emoji: '☀️',
    cost: 20,
    greenPoints: 8,
    description: 'Năng lượng sạch, giảm khí thải',
    pollution: -15
  },
  {
    id: 'bike',
    name: 'Làn đường xe đạp',
    icon: <FaBicycle className="text-blue-500" size={32} />,
    emoji: '🚴',
    cost: 15,
    greenPoints: 6,
    description: 'Khuyến khích giao thông xanh',
    pollution: -12
  },
  {
    id: 'recycle',
    name: 'Trung tâm tái chế',
    icon: <FaRecycle className="text-emerald-500" size={32} />,
    emoji: '♻️',
    cost: 25,
    greenPoints: 10,
    description: 'Xử lý rác thải hiệu quả',
    pollution: -20
  },
  {
    id: 'water',
    name: 'Hệ thống lọc nước',
    icon: <FaWater className="text-cyan-500" size={32} />,
    emoji: '💧',
    cost: 30,
    greenPoints: 12,
    description: 'Nước sạch cho cộng đồng',
    pollution: -18
  },
  {
    id: 'wind',
    name: 'Tuabin gió',
    icon: <FaWind className="text-ink-faint" size={32} />,
    emoji: '🌬️',
    cost: 35,
    greenPoints: 15,
    description: 'Năng lượng tái tạo mạnh mẽ',
    pollution: -25
  }
];

const GreenCityGame = ({ onComplete, onBack }) => {
  const { points, setPoints, user } = useAppContext();
  const userId = user?.id || 'guest';

  const [cityCoins, setCityCoins] = useState(50); // In-game currency
  const [pollution, setPollution] = useState(100);
  const [cityBuildings, setCityBuildings] = useState([]);
  const [cityLevel, setCityLevel] = useState(1);
  const [totalGreenScore, setTotalGreenScore] = useState(0);

  // Load saved game
  useEffect(() => {
    const savedGame = localStorage.getItem(`city_game_${userId}`);
    if (savedGame) {
      const data = JSON.parse(savedGame);
      setCityCoins(data.cityCoins || 50);
      setPollution(data.pollution || 100);
      setCityBuildings(data.cityBuildings || []);
      setCityLevel(data.cityLevel || 1);
      setTotalGreenScore(data.totalGreenScore || 0);
    }
  }, [userId]);

  // Save game
  const saveGame = () => {
    const gameData = {
      cityCoins,
      pollution,
      cityBuildings,
      cityLevel,
      totalGreenScore,
      lastPlayed: new Date().toISOString()
    };
    localStorage.setItem(`city_game_${userId}`, JSON.stringify(gameData));
  };

  // Auto-save every 5 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => saveGame(), 5000);
    return () => clearInterval(saveInterval);
  }, [cityCoins, pollution, cityBuildings, cityLevel, totalGreenScore]);

  // Passive income from buildings
  useEffect(() => {
    const incomeInterval = setInterval(() => {
      if (cityBuildings.length > 0) {
        const income = cityBuildings.length * 2; // 2 coins per building every 10 seconds
        setCityCoins(prev => prev + income);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(incomeInterval);
  }, [cityBuildings.length]);

  // Check level up
  useEffect(() => {
    const requiredScore = cityLevel * 50;
    if (totalGreenScore >= requiredScore) {
      setCityLevel(prev => prev + 1);
      // Reward for leveling up
      setPoints(prev => ({
        ...prev,
        total: prev.total + 10,
        today: prev.today + 10
      }));
    }
  }, [totalGreenScore, cityLevel]);

  const handleBuildBuilding = (building) => {
    if (cityCoins < building.cost) {
      return;
    }

    // Deduct coins
    setCityCoins(prev => prev - building.cost);

    // Add building
    const newBuilding = {
      ...building,
      builtAt: new Date().toISOString(),
      id: `${building.id}_${Date.now()}`
    };
    setCityBuildings(prev => [...prev, newBuilding]);

    // Reduce pollution
    setPollution(prev => Math.max(0, prev + building.pollution));

    // Increase green score
    setTotalGreenScore(prev => prev + building.greenPoints);

    // Award real green points
    setPoints(prev => ({
      ...prev,
      total: prev.total + building.greenPoints,
      today: prev.today + building.greenPoints
    }));

    saveGame();
  };

  const getBuildingCount = (buildingId) => {
    return cityBuildings.filter(b => b.id.startsWith(buildingId)).length;
  };

  const getCityStatus = () => {
    if (pollution <= 20) return { text: 'Rất sạch', color: 'text-brand', bg: 'bg-brand-wash' };
    if (pollution <= 40) return { text: 'Sạch', color: 'text-sky', bg: 'bg-sky-wash' };
    if (pollution <= 60) return { text: 'Trung bình', color: 'text-yellow-600', bg: 'bg-sun-wash' };
    if (pollution <= 80) return { text: 'Ô nhiễm', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'Rất ô nhiễm', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const status = getCityStatus();
  const nextLevelProgress = (totalGreenScore % (cityLevel * 50)) / (cityLevel * 50) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-ink-soft hover:text-ink transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Quay lại
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium text-sm">
            Cấp {cityLevel}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-paper p-4 rounded-card border border-line">
          <div className="flex items-center text-xs text-ink-faint mb-1">
            <FaCoins className="text-yellow-500 mr-1" size={12} />
            Tiền thành phố
          </div>
          <div className="text-2xl font-bold text-yellow-600">{cityCoins}</div>
        </div>

        <div className={`${status.bg}  p-4 rounded-card border border-line`}>
          <div className="text-xs text-ink-faint mb-1">Mức ô nhiễm</div>
          <div className={`text-2xl font-bold ${status.color}`}>{pollution}%</div>
          <div className={`text-xs ${status.color} mt-1`}>{status.text}</div>
        </div>

        <div className="bg-paper p-4 rounded-card border border-line">
          <div className="text-xs text-ink-faint mb-1">Điểm xanh tích lũy</div>
          <div className="text-2xl font-bold text-brand">{totalGreenScore}</div>
        </div>

        <div className="bg-paper p-4 rounded-card border border-line">
          <div className="text-xs text-ink-faint mb-1">Công trình</div>
          <div className="text-2xl font-bold text-purple-600">{cityBuildings.length}</div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-paper p-4 rounded-card border border-line">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-ink-soft">Tiến độ lên cấp {cityLevel + 1}</span>
          <span className="text-ink font-medium">{Math.round(nextLevelProgress)}%</span>
        </div>
        <div className="sx-track h-3">
          <div
            className="bg-grape h-full transition-all duration-500 rounded-full"
            style={{ width: `${nextLevelProgress}%` }}
          ></div>
        </div>
        <p className="text-xs text-ink-faint mt-2">
          {cityLevel * 50 - (totalGreenScore % (cityLevel * 50))} điểm xanh nữa để lên cấp
        </p>
      </div>

      {/* City Grid */}
      <div className="bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6 rounded-card border border-line">
        <h3 className="font-semibold text-ink mb-4">Thành phố của bạn</h3>
        {cityBuildings.length === 0 ? (
          <div className="text-center py-12 text-ink-faint">
            <p className="mb-2">Thành phố của bạn đang trống</p>
            <p className="text-sm">Hãy xây dựng công trình đầu tiên!</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {cityBuildings.map((building, index) => (
              <div
                key={index}
                className="aspect-square bg-paper/60 rounded-lg border border-line flex items-center justify-center text-4xl hover:scale-110 transition-transform shadow-sm"
                title={building.name}
              >
                {building.emoji}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buildings Shop */}
      <div className="bg-paper p-6 rounded-card border border-line">
        <h3 className="font-semibold text-ink mb-4">Cửa hàng công trình xanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BUILDINGS.map(building => {
            const count = getBuildingCount(building.id);
            const canAfford = cityCoins >= building.cost;

            return (
              <div
                key={building.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  canAfford
                    ? 'border-green-200 bg-brand-wash/50 hover:border-brand '
                   : 'border-line bg-canvas opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{building.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-ink text-sm">{building.name}</h4>
                        {count > 0 && (
                          <div className="flex items-center gap-1 text-xs text-brand mt-1">
                            <FaCheckCircle size={10} />
                            Đã có {count}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleBuildBuilding(building)}
                        disabled={!canAfford}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          canAfford
                            ? 'bg-brand text-white hover:bg-brand active:scale-95'
                           : 'bg-gray-300 text-ink-faint cursor-not-allowed'
                        }`}
                      >
                        {building.cost} 💰
                      </button>
                    </div>
                    <p className="text-xs text-ink-soft mt-2">{building.description}</p>
                    <div className="flex gap-3 mt-2 text-xs">
                      <span className="text-brand">+{building.greenPoints} điểm</span>
                      <span className="text-sky">{building.pollution} ô nhiễm</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-sky-wash border border-line rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2 text-sm">Hướng dẫn:</h4>
        <ul className="text-xs text-sky space-y-1">
          <li>• Sử dụng tiền thành phố để xây dựng các công trình xanh</li>
          <li>• Mỗi công trình sẽ giảm ô nhiễm và tặng điểm xanh thật</li>
          <li>• Các công trình tự động tạo thu nhập mỗi 10 giây (2 💰/công trình)</li>
          <li>• Giảm ô nhiễm xuống 0% để có thành phố hoàn hảo!</li>
          <li>• Lên cấp để nhận thưởng 10 điểm xanh</li>
        </ul>
      </div>
    </div>
  );
};

export default GreenCityGame;
