'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  FaSeedling,
  FaTree,
  FaTint,
  FaSun,
  FaLeaf,
  FaTrophy,
  FaArrowLeft,
  FaHeart,
  FaBolt,
  FaShoppingCart
} from 'react-icons/fa';

// Các giai đoạn phát triển của cây
const GROWTH_STAGES = [
  {
    id: 0,
    name: 'Hạt giống',
    icon: '🌰',
    minHealth: 0,
    description: 'Một hạt giống đang chờ được trồng'
  },
  {
    id: 1,
    name: 'Mầm non',
    icon: '🌱',
    minHealth: 20,
    description: 'Cây đã nảy mầm!'
  },
  {
    id: 2,
    name: 'Cây con',
    icon: '🌿',
    minHealth: 40,
    description: 'Cây đang phát triển tốt'
  },
  {
    id: 3,
    name: 'Cây tươi tốt',
    icon: '🌳',
    minHealth: 70,
    description: 'Cây đã lớn và khỏe mạnh'
  },
  {
    id: 4,
    name: 'Cây trưởng thành',
    icon: '🌲',
    minHealth: 100,
    description: 'Cây đã hoàn toàn trưởng thành!'
  }
];

const FERTILIZER_COST = 5; // 5 điểm xanh = 1 phân bón

export default function TreeGrowthGame({ onComplete, onBack }) {
  const { userId, points, setPoints } = useAppContext();

  // Game state
  const [treeHealth, setTreeHealth] = useState(0);
  const [waterLevel, setWaterLevel] = useState(50);
  const [sunLevel, setSunLevel] = useState(50);
  const [fertilizer, setFertilizer] = useState(3);
  const [dayCount, setDayCount] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [message, setMessage] = useState('');
  const [lastAction, setLastAction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load tiến trình game từ localStorage khi mount
  useEffect(() => {
    if (!userId) return;

    try {
      const savedGame = localStorage.getItem(`tree_game_${userId}`);
      if (savedGame) {
        const data = JSON.parse(savedGame);
        setTreeHealth(data.treeHealth || 0);
        setWaterLevel(data.waterLevel || 50);
        setSunLevel(data.sunLevel || 50);
        setFertilizer(data.fertilizer || 3);
        setDayCount(data.dayCount || 0);
        setGameCompleted(data.completed || false);
      }
    } catch (error) {
      console.error('Error loading game:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Tự động lưu game mỗi 5 giây
  useEffect(() => {
    if (isLoading) return;

    const saveInterval = setInterval(() => {
      saveGame();
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [treeHealth, waterLevel, sunLevel, fertilizer, dayCount, gameCompleted, isLoading]);

  // Tự động giảm water và sun theo thời gian
  useEffect(() => {
    if (isLoading || gameCompleted) return;

    const interval = setInterval(() => {
      setWaterLevel(prev => Math.max(0, prev - 2));
      setSunLevel(prev => Math.max(0, prev - 2));

      // Tính toán sức khỏe cây
      setTreeHealth(prev => {
        const waterBonus = waterLevel > 30 ? 1 : -1;
        const sunBonus = sunLevel > 30 ? 1 : -1;
        const newHealth = prev + waterBonus + sunBonus;

        // Kiểm tra hoàn thành game
        if (newHealth >= 100 && !gameCompleted) {
          setGameCompleted(true);
          setMessage('🎉 Chúc mừng! Cây của bạn đã trưởng thành!');
          saveGame(true); // Lưu với completed = true
        }

        return Math.min(100, Math.max(0, newHealth));
      });
    }, 3000); // Mỗi 3 giây

    return () => clearInterval(interval);
  }, [waterLevel, sunLevel, gameCompleted, isLoading]);

  // Lưu game vào localStorage
  const saveGame = (completed = gameCompleted) => {
    if (!userId || isSaving) return;

    setIsSaving(true);
    try {
      const gameData = {
        treeHealth,
        waterLevel,
        sunLevel,
        fertilizer,
        dayCount,
        completed,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(`tree_game_${userId}`, JSON.stringify(gameData));
    } catch (error) {
      console.error('Error saving game:', error);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  // Mua phân bón bằng điểm
  const handleBuyFertilizer = () => {
    if (points.total < FERTILIZER_COST) {
      setMessage(`⚠️ Bạn cần ${FERTILIZER_COST} điểm xanh để mua phân bón!`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Trừ điểm và cộng phân bón
    setPoints(prev => ({ ...prev, total: prev.total - FERTILIZER_COST }));
    setFertilizer(prev => prev + 1);
    setMessage(`✅ Đã mua 1 phân bón! (-${FERTILIZER_COST} điểm)`);
    setTimeout(() => setMessage(''), 2000);

    // Lưu lại
    saveGame();
  };

  // Lấy giai đoạn hiện tại của cây
  const getCurrentStage = () => {
    for (let i = GROWTH_STAGES.length - 1; i >= 0; i--) {
      if (treeHealth >= GROWTH_STAGES[i].minHealth) {
        return GROWTH_STAGES[i];
      }
    }
    return GROWTH_STAGES[0];
  };

  // Xử lý tưới nước
  const handleWater = () => {
    if (waterLevel < 100) {
      setWaterLevel(Math.min(100, waterLevel + 30));
      setLastAction('water');
      setMessage('💧 Bạn đã tưới nước cho cây!');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('⚠️ Cây đã đủ nước rồi!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  // Xử lý phơi nắng
  const handleSun = () => {
    if (sunLevel < 100) {
      setSunLevel(Math.min(100, sunLevel + 30));
      setLastAction('sun');
      setMessage('☀️ Cây đã được phơi nắng!');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('⚠️ Cây đã đủ ánh sáng rồi!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  // Xử lý bón phân
  const handleFertilize = () => {
    if (fertilizer > 0) {
      setFertilizer(fertilizer - 1);
      setTreeHealth(Math.min(100, treeHealth + 15));
      setLastAction('fertilizer');
      setMessage('🌿 Bạn đã bón phân cho cây! +15 sức khỏe');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('⚠️ Hết phân bón rồi!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  // Reset game
  const handleReset = () => {
    setTreeHealth(0);
    setWaterLevel(50);
    setSunLevel(50);
    setFertilizer(3);
    setDayCount(0);
    setGameCompleted(false);
    setMessage('');
    setLastAction(null);
  };

  const currentStage = getCurrentStage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 opacity-10 rounded-full blur-2xl"></div>

        <div className="relative flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại
          </button>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Trồng cây xanh</h2>
            <p className="text-sm text-gray-600 mt-1">
              Chăm sóc cây để nó lớn lên! {isSaving && '💾'}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">Điểm của bạn</div>
            <div className="text-lg font-semibold text-green-600">{points.total}</div>
          </div>
        </div>
      </div>

      {/* Tree Display */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-8 relative overflow-hidden">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-blue-50 to-green-50 opacity-50"></div>

        <div className="relative text-center">
          {/* Stage info */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{currentStage.name}</h3>
            <p className="text-sm text-gray-600">{currentStage.description}</p>
          </div>

          {/* Tree visualization */}
          <div className="my-8 relative">
            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg"></div>

            {/* Tree */}
            <div className="relative z-10 text-9xl animate-bounce" style={{ animationDuration: '3s' }}>
              {currentStage.icon}
            </div>

            {/* Action effects */}
            {lastAction === 'water' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-ping">
                💧
              </div>
            )}
            {lastAction === 'sun' && (
              <div className="absolute top-0 right-1/4 animate-pulse">
                ☀️
              </div>
            )}
            {lastAction === 'fertilizer' && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
                ✨
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm animate-pulse">
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {/* Health */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 flex items-center">
              <FaHeart className="text-red-500 mr-1" />
              Sức khỏe
            </span>
            <span className="text-sm font-semibold text-gray-900">{Math.round(treeHealth)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${treeHealth}%` }}
            ></div>
          </div>
        </div>

        {/* Water */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 flex items-center">
              <FaTint className="text-blue-500 mr-1" />
              Nước
            </span>
            <span className="text-sm font-semibold text-gray-900">{Math.round(waterLevel)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${waterLevel}%` }}
            ></div>
          </div>
        </div>

        {/* Sun */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 flex items-center">
              <FaSun className="text-yellow-500 mr-1" />
              Ánh sáng
            </span>
            <span className="text-sm font-semibold text-gray-900">{Math.round(sunLevel)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${sunLevel}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={handleWater}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-200 p-4 hover:shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-center">
            <FaTint className="text-blue-500 text-3xl mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Tưới nước</div>
            <div className="text-xs text-gray-600 mt-1">+30% nước</div>
          </div>
        </button>

        <button
          onClick={handleSun}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-yellow-200 p-4 hover:shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <div className="text-center">
            <FaSun className="text-yellow-500 text-3xl mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Phơi nắng</div>
            <div className="text-xs text-gray-600 mt-1">+30% ánh sáng</div>
          </div>
        </button>

        <button
          onClick={handleFertilize}
          disabled={fertilizer === 0}
          className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-green-200 p-4 transition-all ${
            fertilizer > 0
              ? 'hover:shadow-md hover:scale-105 active:scale-95'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="text-center">
            <FaLeaf className="text-green-500 text-3xl mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Bón phân</div>
            <div className="text-xs text-gray-600 mt-1">
              {fertilizer > 0 ? `Còn ${fertilizer} lần` : 'Hết phân'}
            </div>
          </div>
        </button>
      </div>

      {/* Shop phân bón */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-amber-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaShoppingCart className="text-amber-600 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-900">Cửa hàng phân bón</div>
              <div className="text-xs text-gray-600">1 phân bón = {FERTILIZER_COST} điểm xanh</div>
            </div>
          </div>
          <button
            onClick={handleBuyFertilizer}
            disabled={points.total < FERTILIZER_COST}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              points.total >= FERTILIZER_COST
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Mua phân
          </button>
        </div>
      </div>

      {/* Complete/Reset */}
      {gameCompleted ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-green-200 p-6">
          <div className="text-center">
            <FaTrophy className="text-yellow-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Chúc mừng! Bạn đã trồng cây thành công!
            </h3>
            <p className="text-gray-600 mb-4">
              Cây của bạn đã trưởng thành và sẽ giúp làm sạch không khí!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (onComplete) onComplete(10); // Thưởng 10 điểm
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Nhận thưởng (+10 điểm)
              </button>
              <button
                onClick={handleReset}
                className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Trồng cây mới
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <FaBolt className="mr-2" />
            Hướng dẫn chơi
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 pl-5 list-disc">
            <li>Luôn giữ mức nước và ánh sáng trên 30%</li>
            <li>Làm nhiệm vụ xanh để kiếm điểm mua phân bón</li>
            <li>Phân bón giúp cây phát triển nhanh hơn (+15% sức khỏe)</li>
            <li>Game tự động lưu mỗi 5 giây</li>
            <li>Đạt 100% sức khỏe để nhận thưởng 10 điểm!</li>
          </ul>
        </div>
      )}
    </div>
  );
}
