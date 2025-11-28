// 'use client';

// import { useState, useEffect } from 'react';
// import { useAppContext } from '@/context/AppContext';
// import {
//   FaSeedling,
//   FaTree,
//   FaTint,
//   FaSun,
//   FaLeaf,
//   FaTrophy,
//   FaArrowLeft,
//   FaHeart,
//   FaBolt,
//   FaShoppingCart
// } from 'react-icons/fa';

// // Các giai đoạn phát triển của cây
// const GROWTH_STAGES = [
//   {
//     id: 0,
//     name: 'Hạt giống',
//     icon: '🌰',
//     minHealth: 0,
//     description: 'Một hạt giống đang chờ được trồng'
//   },
//   {
//     id: 1,
//     name: 'Mầm non',
//     icon: '🌱',
//     minHealth: 20,
//     description: 'Cây đã nảy mầm!'
//   },
//   {
//     id: 2,
//     name: 'Cây con',
//     icon: '🌿',
//     minHealth: 40,
//     description: 'Cây đang phát triển tốt'
//   },
//   {
//     id: 3,
//     name: 'Cây tươi tốt',
//     icon: '🌳',
//     minHealth: 70,
//     description: 'Cây đã lớn và khỏe mạnh'
//   },
//   {
//     id: 4,
//     name: 'Cây trưởng thành',
//     icon: '🌲',
//     minHealth: 100,
//     description: 'Cây đã hoàn toàn trưởng thành!'
//   }
// ];

// const FERTILIZER_COST = 5; // 5 điểm xanh = 1 phân bón

// export default function TreeGrowthGame({ onBack }) {
//   const { userId, points, setPoints } = useAppContext();

//   // Game state
//   const [treeHealth, setTreeHealth] = useState(0);
//   const [waterLevel, setWaterLevel] = useState(50);
//   const [sunLevel, setSunLevel] = useState(50);
//   const [fertilizer, setFertilizer] = useState(3);
//   const [dayCount, setDayCount] = useState(0);
//   const [gameCompleted, setGameCompleted] = useState(false);
//   const [rewardClaimed, setRewardClaimed] = useState(false);
//   const [lastClaimDate, setLastClaimDate] = useState(null);
//   const [canPlayToday, setCanPlayToday] = useState(true);
//   const [message, setMessage] = useState('');
//   const [lastAction, setLastAction] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);

//   // Kiểm tra xem có phải ngày mới không
//   const isNewDay = (lastDate) => {
//     if (!lastDate) return true;

//     const today = new Date();
//     const last = new Date(lastDate);

//     today.setHours(0, 0, 0, 0);
//     last.setHours(0, 0, 0, 0);

//     return today.getTime() > last.getTime();
//   };

//   // Load tiến trình game từ database khi mount
//   useEffect(() => {
//     if (!userId) return;

//     const loadGameProgress = async () => {
//       try {
//         const response = await fetch(`/api/game-progress?userId=${userId}&gameType=tree-growth`);

//         if (!response.ok) {
//           throw new Error('Failed to load game progress');
//         }

//         const progress = await response.json();

//         if (progress && progress.data) {
//           const data = progress.data;
//           const lastClaim = data.lastClaimDate;

//           // Kiểm tra xem đã qua ngày mới chưa
//           if (lastClaim && isNewDay(lastClaim)) {
//             // Ngày mới - reset game
//             setTreeHealth(0);
//             setWaterLevel(50);
//             setSunLevel(50);
//             setFertilizer(3);
//             setDayCount(0);
//             setGameCompleted(false);
//             setRewardClaimed(false);
//             setCanPlayToday(true);
//             setLastClaimDate(null);
//           } else {
//             // Cùng ngày - load dữ liệu đã lưu
//             setTreeHealth(data.treeHealth || 0);
//             setWaterLevel(data.waterLevel || 50);
//             setSunLevel(data.sunLevel || 50);
//             setFertilizer(data.fertilizer || 3);
//             setDayCount(data.dayCount || 0);
//             setGameCompleted(data.completed || false);
//             setRewardClaimed(data.rewardClaimed || false);
//             setLastClaimDate(lastClaim);

//             // Nếu đã claim reward hôm nay thì không cho chơi nữa
//             if (data.rewardClaimed && lastClaim) {
//               setCanPlayToday(false);
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error loading game:', error);
//         // Nếu lỗi, sử dụng giá trị mặc định
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadGameProgress();
//   }, [userId]);

//   // Tự động lưu game mỗi 5 giây
//   useEffect(() => {
//     if (isLoading) return;

//     const saveInterval = setInterval(() => {
//       saveGame();
//     }, 5000);

//     return () => clearInterval(saveInterval);
//   }, [treeHealth, waterLevel, sunLevel, fertilizer, dayCount, gameCompleted, isLoading]);

//   // Tự động giảm water và sun theo thời gian
//   useEffect(() => {
//     if (isLoading || gameCompleted) return;

//     const interval = setInterval(() => {
//       setWaterLevel(prev => Math.max(0, prev - 2));
//       setSunLevel(prev => Math.max(0, prev - 2));

//       // Tính toán sức khỏe cây
//       setTreeHealth(prev => {
//         const waterBonus = waterLevel > 30 ? 1 : -1;
//         const sunBonus = sunLevel > 30 ? 1 : -1;
//         const newHealth = prev + waterBonus + sunBonus;

//         // Kiểm tra hoàn thành game
//         if (newHealth >= 100 && !gameCompleted) {
//           setGameCompleted(true);
//           setMessage('🎉 Chúc mừng! Cây của bạn đã trưởng thành!');
//           saveGame(true); // Lưu với completed = true
//         }

//         return Math.min(100, Math.max(0, newHealth));
//       });
//     }, 3000); // Mỗi 3 giây

//     return () => clearInterval(interval);
//   }, [waterLevel, sunLevel, gameCompleted, isLoading]);

//   // Lưu game vào database
//   const saveGame = async (completed = gameCompleted) => {
//     if (!userId || isSaving) return;

//     setIsSaving(true);
//     try {
//       const gameData = {
//         treeHealth,
//         waterLevel,
//         sunLevel,
//         fertilizer,
//         dayCount,
//         completed,
//         rewardClaimed,
//         lastClaimDate,
//         lastSaved: new Date().toISOString()
//       };

//       const response = await fetch('/api/game-progress', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId,
//           gameType: 'tree-growth',
//           data: gameData,
//           pointsEarned: 0, // Không cộng điểm khi lưu, chỉ cộng khi claim reward
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save game progress');
//       }
//     } catch (error) {
//       console.error('Error saving game:', error);
//     } finally {
//       setTimeout(() => setIsSaving(false), 500);
//     }
//   };

//   // Mua phân bón bằng điểm
//   const handleBuyFertilizer = async () => {
//     if (points.total < FERTILIZER_COST) {
//       setMessage(`⚠️ Bạn cần ${FERTILIZER_COST} điểm xanh để mua phân bón!`);
//       setTimeout(() => setMessage(''), 3000);
//       return;
//     }

//     setIsSaving(true);

//     try {
//       // Trừ điểm trong database
//       const response = await fetch('/api/game-progress', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId,
//           gameType: 'tree-growth-fertilizer',
//           pointsEarned: -FERTILIZER_COST, // Số âm để trừ điểm
//           data: {
//             action: 'buy-fertilizer',
//             timestamp: new Date().toISOString()
//           },
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to buy fertilizer');
//       }

//       // Cập nhật điểm trong context
//       setPoints(prev => ({ ...prev, total: data.points }));

//       // Cộng phân bón
//       setFertilizer(prev => prev + 1);

//       setMessage(`✅ Đã mua 1 phân bón! (-${FERTILIZER_COST} điểm)`);
//       setTimeout(() => setMessage(''), 2000);

//       // Lưu lại state game
//       await saveGame();
//     } catch (error) {
//       console.error('Error buying fertilizer:', error);
//       setMessage('❌ Có lỗi xảy ra khi mua phân bón!');
//       setTimeout(() => setMessage(''), 3000);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Lấy giai đoạn hiện tại của cây
//   const getCurrentStage = () => {
//     for (let i = GROWTH_STAGES.length - 1; i >= 0; i--) {
//       if (treeHealth >= GROWTH_STAGES[i].minHealth) {
//         return GROWTH_STAGES[i];
//       }
//     }
//     return GROWTH_STAGES[0];
//   };

//   // Xử lý tưới nước
//   const handleWater = () => {
//     if (waterLevel < 100) {
//       setWaterLevel(Math.min(100, waterLevel + 30));
//       setLastAction('water');
//       setMessage('💧 Bạn đã tưới nước cho cây!');
//       setTimeout(() => setMessage(''), 2000);
//     } else {
//       setMessage('⚠️ Cây đã đủ nước rồi!');
//       setTimeout(() => setMessage(''), 2000);
//     }
//   };

//   // Xử lý phơi nắng
//   const handleSun = () => {
//     if (sunLevel < 100) {
//       setSunLevel(Math.min(100, sunLevel + 30));
//       setLastAction('sun');
//       setMessage('☀️ Cây đã được phơi nắng!');
//       setTimeout(() => setMessage(''), 2000);
//     } else {
//       setMessage('⚠️ Cây đã đủ ánh sáng rồi!');
//       setTimeout(() => setMessage(''), 2000);
//     }
//   };

//   // Xử lý bón phân
//   const handleFertilize = () => {
//     if (fertilizer > 0) {
//       setFertilizer(fertilizer - 1);
//       setTreeHealth(Math.min(100, treeHealth + 15));
//       setLastAction('fertilizer');
//       setMessage('🌿 Bạn đã bón phân cho cây! +15 sức khỏe');
//       setTimeout(() => setMessage(''), 2000);
//     } else {
//       setMessage('⚠️ Hết phân bón rồi!');
//       setTimeout(() => setMessage(''), 2000);
//     }
//   };

//   // Claim reward và lưu điểm vào database
//   const handleClaimReward = async () => {
//     if (!userId) {
//       alert('Vui lòng đăng nhập để nhận thưởng');
//       return;
//     }

//     if (rewardClaimed) {
//       alert('Bạn đã nhận thưởng rồi!');
//       return;
//     }

//     if (!canPlayToday) {
//       alert('Bạn đã nhận thưởng hôm nay rồi! Quay lại vào ngày mai nhé.');
//       return;
//     }

//     setIsSaving(true);

//     try {
//       const claimDate = new Date().toISOString();

//       const response = await fetch('/api/game-progress', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId,
//           gameType: 'tree-growth',
//           pointsEarned: 10,
//           data: {
//             treeHealth,
//             waterLevel,
//             sunLevel,
//             fertilizer,
//             dayCount,
//             completed: true,
//             rewardClaimed: true,
//             lastClaimDate: claimDate,
//           },
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to claim reward');
//       }

//       // Cập nhật state local
//       setRewardClaimed(true);
//       setCanPlayToday(false);
//       setLastClaimDate(claimDate);

//       // Cập nhật điểm trong context
//       setPoints(prev => ({
//         ...prev,
//         total: data.points
//       }));

//       alert('Chúc mừng! Bạn đã nhận 10 điểm xanh. Bạn có thể chơi lại vào ngày mai!');
//     } catch (error) {
//       console.error('Error claiming reward:', error);
//       alert('Có lỗi xảy ra khi nhận thưởng: ' + error.message);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Reset game
//   const handleReset = async () => {
//     setTreeHealth(0);
//     setWaterLevel(50);
//     setSunLevel(50);
//     setFertilizer(3);
//     setDayCount(0);
//     setGameCompleted(false);
//     setRewardClaimed(false);
//     setMessage('');
//     setLastAction(null);

//     // Lưu trạng thái reset vào database
//     await saveGame(false);
//   };

//   const currentStage = getCurrentStage();

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-96">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
//           <p className="text-gray-600">Đang tải game...</p>
//         </div>
//       </div>
//     );
//   }

//   // Nếu đã chơi hôm nay
//   if (!canPlayToday && rewardClaimed) {
//     return (
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={onBack}
//               className="flex items-center text-gray-600 hover:text-gray-900"
//             >
//               <FaArrowLeft className="mr-2" />
//               Quay lại
//             </button>

//             <div className="text-center flex-1">
//               <h2 className="text-xl font-semibold text-gray-900">Trồng cây xanh</h2>
//             </div>

//             <div className="text-right">
//               <div className="text-xs text-gray-500">Điểm của bạn</div>
//               <div className="text-lg font-semibold text-green-600">{points.total}</div>
//             </div>
//           </div>
//         </div>

//         {/* Already played today message */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-amber-200 p-8 text-center">
//           <div className="text-6xl mb-4">🌳</div>
//           <h3 className="text-xl font-bold text-gray-800 mb-2">
//             Bạn đã hoàn thành trò chơi hôm nay!
//           </h3>
//           <p className="text-gray-600 mb-4">
//             Bạn đã nhận 10 điểm xanh từ việc trồng cây. Hãy quay lại vào ngày mai để tiếp tục trồng cây mới nhé!
//           </p>
//           <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mt-6">
//             <p className="text-sm text-blue-800">
//               💡 <strong>Mẹo:</strong> Trong lúc chờ, bạn có thể thực hiện các hành động xanh khác để kiếm thêm điểm!
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 opacity-10 rounded-full blur-2xl"></div>

//         <div className="relative flex items-center justify-between">
//           <button
//             onClick={onBack}
//             className="flex items-center text-gray-600 hover:text-gray-900"
//           >
//             <FaArrowLeft className="mr-2" />
//             Quay lại
//           </button>

//           <div className="text-center">
//             <h2 className="text-xl font-semibold text-gray-900">Trồng cây xanh</h2>
//             <p className="text-sm text-gray-600 mt-1">
//               Chăm sóc cây để nó lớn lên! {isSaving && '💾'}
//             </p>
//           </div>

//           <div className="text-right">
//             <div className="text-xs text-gray-500">Điểm của bạn</div>
//             <div className="text-lg font-semibold text-green-600">{points.total}</div>
//           </div>
//         </div>
//       </div>

//       {/* Tree Display */}
//       <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-8 relative overflow-hidden">
//         {/* Sky gradient */}
//         <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-blue-50 to-green-50 opacity-50"></div>

//         <div className="relative text-center">
//           {/* Stage info */}
//           <div className="mb-4">
//             <h3 className="text-lg font-semibold text-gray-800">{currentStage.name}</h3>
//             <p className="text-sm text-gray-600">{currentStage.description}</p>
//           </div>

//           {/* Tree visualization */}
//           <div className="my-8 relative">
//             {/* Ground */}
//             <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg"></div>

//             {/* Tree */}
//             <div className="relative z-10 text-9xl animate-bounce" style={{ animationDuration: '3s' }}>
//               {currentStage.icon}
//             </div>

//             {/* Action effects */}
//             {lastAction === 'water' && (
//               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-ping">
//                 💧
//               </div>
//             )}
//             {lastAction === 'sun' && (
//               <div className="absolute top-0 right-1/4 animate-pulse">
//                 ☀️
//               </div>
//             )}
//             {lastAction === 'fertilizer' && (
//               <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
//                 ✨
//               </div>
//             )}
//           </div>

//           {/* Message */}
//           {message && (
//             <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm animate-pulse">
//               {message}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-4">
//         {/* Health */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-600 flex items-center">
//               <FaHeart className="text-red-500 mr-1" />
//               Sức khỏe
//             </span>
//             <span className="text-sm font-semibold text-gray-900">{Math.round(treeHealth)}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full transition-all duration-500"
//               style={{ width: `${treeHealth}%` }}
//             ></div>
//           </div>
//         </div>

//         {/* Water */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-600 flex items-center">
//               <FaTint className="text-blue-500 mr-1" />
//               Nước
//             </span>
//             <span className="text-sm font-semibold text-gray-900">{Math.round(waterLevel)}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//               style={{ width: `${waterLevel}%` }}
//             ></div>
//           </div>
//         </div>

//         {/* Sun */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-600 flex items-center">
//               <FaSun className="text-yellow-500 mr-1" />
//               Ánh sáng
//             </span>
//             <span className="text-sm font-semibold text-gray-900">{Math.round(sunLevel)}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
//               style={{ width: `${sunLevel}%` }}
//             ></div>
//           </div>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="grid grid-cols-3 gap-4">
//         <button
//           onClick={handleWater}
//           className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-200 p-4 hover:shadow-md transition-all hover:scale-105 active:scale-95"
//         >
//           <div className="text-center">
//             <FaTint className="text-blue-500 text-3xl mx-auto mb-2" />
//             <div className="text-sm font-medium text-gray-900">Tưới nước</div>
//             <div className="text-xs text-gray-600 mt-1">+30% nước</div>
//           </div>
//         </button>

//         <button
//           onClick={handleSun}
//           className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-yellow-200 p-4 hover:shadow-md transition-all hover:scale-105 active:scale-95"
//         >
//           <div className="text-center">
//             <FaSun className="text-yellow-500 text-3xl mx-auto mb-2" />
//             <div className="text-sm font-medium text-gray-900">Phơi nắng</div>
//             <div className="text-xs text-gray-600 mt-1">+30% ánh sáng</div>
//           </div>
//         </button>

//         <button
//           onClick={handleFertilize}
//           disabled={fertilizer === 0}
//           className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-green-200 p-4 transition-all ${
//             fertilizer > 0
//               ? 'hover:shadow-md hover:scale-105 active:scale-95'
//               : 'opacity-50 cursor-not-allowed'
//           }`}
//         >
//           <div className="text-center">
//             <FaLeaf className="text-green-500 text-3xl mx-auto mb-2" />
//             <div className="text-sm font-medium text-gray-900">Bón phân</div>
//             <div className="text-xs text-gray-600 mt-1">
//               {fertilizer > 0 ? `Còn ${fertilizer} lần` : 'Hết phân'}
//             </div>
//           </div>
//         </button>
//       </div>

//       {/* Shop phân bón */}
//       <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-amber-200 p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <FaShoppingCart className="text-amber-600 mr-2" />
//             <div>
//               <div className="text-sm font-medium text-gray-900">Cửa hàng phân bón</div>
//               <div className="text-xs text-gray-600">1 phân bón = {FERTILIZER_COST} điểm xanh</div>
//             </div>
//           </div>
//           <button
//             onClick={handleBuyFertilizer}
//             disabled={points.total < FERTILIZER_COST || isSaving}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//               points.total >= FERTILIZER_COST && !isSaving
//                 ? 'bg-green-600 text-white hover:bg-green-700'
//                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//             }`}
//           >
//             {isSaving ? 'Đang xử lý...' : 'Mua phân'}
//           </button>
//         </div>
//       </div>

//       {/* Complete/Reset */}
//       {gameCompleted ? (
//         <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-green-200 p-6">
//           <div className="text-center">
//             <FaTrophy className="text-yellow-500 text-5xl mx-auto mb-4" />
//             <h3 className="text-xl font-bold text-green-800 mb-2">
//               Chúc mừng! Bạn đã trồng cây thành công!
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Cây của bạn đã trưởng thành và sẽ giúp làm sạch không khí!
//             </p>
//             <div className="space-y-3">
//               {!rewardClaimed ? (
//                 <button
//                   onClick={handleClaimReward}
//                   disabled={isSaving}
//                   className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
//                 >
//                   {isSaving ? 'Đang xử lý...' : 'Nhận thưởng (+10 điểm)'}
//                 </button>
//               ) : (
//                 <div className="w-full py-3 px-4 bg-green-100 text-green-800 rounded-lg font-medium text-center">
//                   ✓ Đã nhận thưởng
//                 </div>
//               )}
//               <button
//                 onClick={handleReset}
//                 disabled={isSaving}
//                 className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
//               >
//                 Trồng cây mới
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
//           <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
//             <FaBolt className="mr-2" />
//             Hướng dẫn chơi
//           </h4>
//           <ul className="text-sm text-blue-800 space-y-1 pl-5 list-disc">
//             <li>Luôn giữ mức nước và ánh sáng trên 30%</li>
//             <li>Làm nhiệm vụ xanh để kiếm điểm mua phân bón</li>
//             <li>Phân bón giúp cây phát triển nhanh hơn (+15% sức khỏe)</li>
//             <li>Game tự động lưu mỗi 5 giây</li>
//             <li>Đạt 100% sức khỏe để nhận thưởng 10 điểm!</li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

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
  { id: 0, name: 'Hạt giống', icon: '🌰', minHealth: 0, description: 'Một hạt giống đang chờ được trồng' },
  { id: 1, name: 'Mầm non', icon: '🌱', minHealth: 20, description: 'Cây đã nảy mầm!' },
  { id: 2, name: 'Cây con', icon: '🌿', minHealth: 40, description: 'Cây đang phát triển tốt' },
  { id: 3, name: 'Cây tươi tốt', icon: '🌳', minHealth: 70, description: 'Cây đã lớn và khỏe mạnh' },
  { id: 4, name: 'Cây trưởng thành', icon: '🌲', minHealth: 100, description: 'Cây đã hoàn toàn trưởng thành!' }
];

const FERTILIZER_COST = 5; // 5 điểm xanh = 1 phân bón

export default function TreeGrowthGame({ onBack }) {
  const { userId, points, setPoints } = useAppContext();

  // Game state
  const [treeHealth, setTreeHealth] = useState(0);
  const [waterLevel, setWaterLevel] = useState(50);
  const [sunLevel, setSunLevel] = useState(50);
  const [fertilizer, setFertilizer] = useState(3);
  const [dayCount, setDayCount] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false); // khóa theo cây hiện tại
  const [message, setMessage] = useState('');
  const [lastAction, setLastAction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [claimLock, setClaimLock] = useState(false); // chặn double-claim

  // Load tiến trình game từ database khi mount (nếu bạn có lưu)
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadGameProgress = async () => {
      try {
        const response = await fetch(`/api/game-progress?userId=${userId}&gameType=tree-growth`);
        if (!response.ok) {
          setIsLoading(false);
          return;
        }
        const progress = await response.json();
        if (progress && progress.data) {
          const data = progress.data;
          // LƯU Ý: không khoá theo ngày nữa — rewardClaimed là thuộc vòng đời cây hiện tại
          setTreeHealth(data.treeHealth ?? 0);
          setWaterLevel(data.waterLevel ?? 50);
          setSunLevel(data.sunLevel ?? 50);
          setFertilizer(data.fertilizer ?? 3);
          setDayCount(data.dayCount ?? 0);
          setGameCompleted(!!data.completed);
          setRewardClaimed(!!data.rewardClaimed);
        }
      } catch (error) {
        console.error('Error loading game:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGameProgress();
  }, [userId]);

  // Tự động lưu game mỗi 5 giây (nếu có thay đổi)
  useEffect(() => {
    if (isLoading) return;
    const saveInterval = setInterval(() => {
      saveGame(false);
    }, 5000);
    return () => clearInterval(saveInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeHealth, waterLevel, sunLevel, fertilizer, dayCount, gameCompleted, isLoading]);

  // Tự động giảm water và sun theo thời gian
  useEffect(() => {
    if (isLoading || gameCompleted) return;
    const interval = setInterval(() => {
      setWaterLevel(prev => Math.max(0, prev - 2));
      setSunLevel(prev => Math.max(0, prev - 2));

      setTreeHealth(prev => {
        // Lấy giá trị waterLevel/sunLevel hiện thời bằng hàm cập nhật với giá trị mới nhất
        // Tuy closure nên dùng biến tạm để tính roughly — vẫn hoạt động tốt cho game nhỏ
        const waterBonus = (waterLevel > 30) ? 1 : -1;
        const sunBonus = (sunLevel > 30) ? 1 : -1;
        const newHealth = prev + waterBonus + sunBonus;
        const capped = Math.min(100, Math.max(0, newHealth));

        // Nếu đạt ngưỡng -> chỉ set flag completed (không gọi save ở đây nữa)
        if (capped >= 100 && !gameCompleted) {
          setGameCompleted(true);
          setMessage('🎉 Chúc mừng! Cây của bạn đã trưởng thành!');
        }

        return capped;
      });

      setDayCount(prev => prev + 0); // giữ track nếu muốn; bạn có thể tăng ngày dựa trên thời gian thật
    }, 3000);

    return () => clearInterval(interval);
  }, [waterLevel, sunLevel, gameCompleted, isLoading]);

  // Khi gameCompleted chuyển true thì lưu 1 lần
  useEffect(() => {
    if (gameCompleted) {
      saveGame(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCompleted]);

  // Lưu game vào database
  const saveGame = async (completed = false) => {
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
        rewardClaimed,
        lastSaved: new Date().toISOString()
      };

      // POST để lưu trạng thái (không đổi điểm)
      await fetch('/api/game-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          gameType: 'tree-growth',
          data: gameData,
          pointsEarned: 0,
        }),
      });
    } catch (error) {
      console.error('Error saving game:', error);
    } finally {
      setTimeout(() => setIsSaving(false), 400);
    }
  };

  // Mua phân bón
  const handleBuyFertilizer = async () => {
    if (points.total < FERTILIZER_COST) {
      setMessage(`⚠️ Bạn cần ${FERTILIZER_COST} điểm xanh để mua phân bón!`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/game-progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          gameType: 'tree-growth-fertilizer',
          pointsEarned: -FERTILIZER_COST,
          data: { action: 'buy-fertilizer', timestamp: new Date().toISOString() },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to buy fertilizer');

      setPoints(prev => ({ ...prev, total: data.points }));
      setFertilizer(prev => prev + 1);
      setMessage(`✅ Đã mua 1 phân bón! (-${FERTILIZER_COST} điểm)`);
      setTimeout(() => setMessage(''), 2000);

      await saveGame();
    } catch (error) {
      console.error('Error buying fertilizer:', error);
      setMessage('❌ Có lỗi xảy ra khi mua phân bón!');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Lấy giai đoạn hiện tại của cây
  const getCurrentStage = () => {
    for (let i = GROWTH_STAGES.length - 1; i >= 0; i--) {
      if (treeHealth >= GROWTH_STAGES[i].minHealth) return GROWTH_STAGES[i];
    }
    return GROWTH_STAGES[0];
  };

  // Actions: water / sun / fertilize
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

  // Claim reward: chỉ khi cây hoàn thành và reward chưa được claim cho cây hiện tại
  const handleClaimReward = async () => {
    if (!userId) {
      alert('Vui lòng đăng nhập để nhận thưởng');
      return;
    }
    if (!gameCompleted) {
      alert('Cây chưa trưởng thành. Hoàn thiện cây trước khi nhận thưởng.');
      return;
    }
    if (rewardClaimed) {
      alert('Bạn đã nhận thưởng cho cây này rồi. Hãy trồng cây mới để nhận thêm.');
      return;
    }
    if (claimLock) return;

    setClaimLock(true);
    setIsSaving(true);

    // optimistic: set local state ngay (khóa vòng đời này)
    setRewardClaimed(true);

    try {
      const response = await fetch('/api/game-progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          gameType: 'tree-growth',
          pointsEarned: 10,
          data: {
            treeHealth,
            waterLevel,
            sunLevel,
            fertilizer,
            dayCount,
            completed: true,
            rewardClaimed: true,
            claimedAt: new Date().toISOString(),
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        // server có thể trả lỗi hoặc báo alreadyClaimed — rollback nếu cần
        console.warn('Server trả lỗi khi claim reward:', data);
        // giữ rewardClaimed true trên client (tránh người dùng lặp lại);
        // có thể hiện thông báo tùy server trả về
        if (data && data.alreadyClaimed) {
          alert('Server: phần thưởng đã được nhận trước đó.');
        } else {
          alert('Có lỗi khi nhận thưởng. Trạng thái đã được lưu cục bộ.');
        }
      } else {
        // update điểm theo server
        if (typeof data.points !== 'undefined') {
          setPoints(prev => ({ ...prev, total: data.points }));
        } else {
          setPoints(prev => ({ ...prev, total: (prev.total || 0) + 10 }));
        }
        alert('Chúc mừng! Bạn đã nhận 10 điểm xanh cho cây này.');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Lỗi mạng khi nhận thưởng — trạng thái đã được lưu cục bộ.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setClaimLock(false), 1000);
    }
  };

  // Reset game (trồng cây mới) => mở khóa nhận thưởng lần nữa
  const handleReset = async () => {
    setTreeHealth(0);
    setWaterLevel(50);
    setSunLevel(50);
    setFertilizer(3);
    setDayCount(0);
    setGameCompleted(false);
    setRewardClaimed(false);
    setMessage('');
    setLastAction(null);

    // lưu trạng thái reset
    await saveGame(false);
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
        <div className="relative flex items-center justify-between">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
            <FaArrowLeft className="mr-2" />
            Quay lại
          </button>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Trồng cây xanh</h2>
            <p className="text-sm text-gray-600 mt-1">{isSaving ? '💾 Đang lưu...' : 'Chăm sóc cây để nó lớn lên!'}</p>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">Điểm của bạn</div>
            <div className="text-lg font-semibold text-green-600">{points.total}</div>
          </div>
        </div>
      </div>

      {/* Tree Display */}
      <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-8 relative overflow-hidden">
        <div className="relative text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{currentStage.name}</h3>
            <p className="text-sm text-gray-600">{currentStage.description}</p>
          </div>

          <div className="my-8 relative">
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg"></div>
            <div className="relative z-10 text-9xl animate-bounce" style={{ animationDuration: '3s' }}>
              {currentStage.icon}
            </div>

            {lastAction === 'water' && (<div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-ping">💧</div>)}
            {lastAction === 'sun' && (<div className="absolute top-0 right-1/4 animate-pulse">☀️</div>)}
            {lastAction === 'fertilizer' && (<div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">✨</div>)}
          </div>

          {message && (<div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm animate-pulse">{message}</div>)}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 flex items-center"><FaHeart className="text-red-500 mr-1" />Sức khỏe</span>
            <span className="text-sm font-semibold text-gray-900">{Math.round(treeHealth)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${treeHealth}%` }}></div>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 flex items-center"><FaTint className="text-blue-500 mr-1" />Nước</span>
            <span className="text-sm font-semibold text-gray-900">{Math.round(waterLevel)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${waterLevel}%` }}></div>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 flex items-center"><FaSun className="text-yellow-500 mr-1" />Ánh sáng</span>
            <span className="text-sm font-semibold text-gray-900">{Math.round(sunLevel)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full transition-all duration-500" style={{ width: `${sunLevel}%` }}></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button onClick={handleWater} className="bg-white/80 rounded-xl shadow-sm border border-blue-200 p-4 hover:shadow-md transition-all hover:scale-105 active:scale-95">
          <div className="text-center">
            <FaTint className="text-blue-500 text-3xl mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Tưới nước</div>
            <div className="text-xs text-gray-600 mt-1">+30% nước</div>
          </div>
        </button>

        <button onClick={handleSun} className="bg-white/80 rounded-xl shadow-sm border border-yellow-200 p-4 hover:shadow-md transition-all hover:scale-105 active:scale-95">
          <div className="text-center">
            <FaSun className="text-yellow-500 text-3xl mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Phơi nắng</div>
            <div className="text-xs text-gray-600 mt-1">+30% ánh sáng</div>
          </div>
        </button>

        <button onClick={handleFertilize} disabled={fertilizer === 0} className={`bg-white/80 rounded-xl shadow-sm border border-green-200 p-4 transition-all ${fertilizer > 0 ? 'hover:shadow-md hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'}`}>
          <div className="text-center">
            <FaLeaf className="text-green-500 text-3xl mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Bón phân</div>
            <div className="text-xs text-gray-600 mt-1">{fertilizer > 0 ? `Còn ${fertilizer} lần` : 'Hết phân'}</div>
          </div>
        </button>
      </div>

      {/* Shop phân bón */}
      <div className="bg-white/80 rounded-xl shadow-sm border border-amber-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaShoppingCart className="text-amber-600 mr-2" />
            <div>
              <div className="text-sm font-medium text-gray-900">Cửa hàng phân bón</div>
              <div className="text-xs text-gray-600">1 phân bón = {FERTILIZER_COST} điểm xanh</div>
            </div>
          </div>
          <button onClick={handleBuyFertilizer} disabled={points.total < FERTILIZER_COST || isSaving} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${points.total >= FERTILIZER_COST && !isSaving ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
            {isSaving ? 'Đang xử lý...' : 'Mua phân'}
          </button>
        </div>
      </div>

      {/* Complete/Reset */}
      {gameCompleted ? (
        <div className="bg-white/80 rounded-xl shadow-sm border border-green-200 p-6">
          <div className="text-center">
            <FaTrophy className="text-yellow-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Chúc mừng! Bạn đã trồng cây thành công!</h3>
            <p className="text-gray-600 mb-4">Cây của bạn đã trưởng thành và sẽ giúp làm sạch không khí!</p>
            <div className="space-y-3">
              {!rewardClaimed ? (
                <button onClick={handleClaimReward} disabled={isSaving || claimLock} className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50">
                  {isSaving ? 'Đang xử lý...' : 'Nhận thưởng (+10 điểm)'}
                </button>
              ) : (
                <div className="w-full py-3 px-4 bg-green-100 text-green-800 rounded-lg font-medium text-center">✓ Đã nhận thưởng cho cây này</div>
              )}
              <button onClick={handleReset} disabled={isSaving} className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">Trồng cây mới</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center"><FaBolt className="mr-2" />Hướng dẫn chơi</h4>
          <ul className="text-sm text-blue-800 space-y-1 pl-5 list-disc">
            <li>Luôn giữ mức nước và ánh sáng trên 30%</li>
            <li>Làm nhiệm vụ xanh để kiếm điểm mua phân bón</li>
            <li>Phân bón giúp cây phát triển nhanh hơn (+15% sức khỏe)</li>
            <li>Game tự động lưu mỗi 5 giây</li>
            <li>Đạt 100% sức khỏe để nhận thưởng 10 điểm! Sau khi nhận cho cây này, bạn phải trồng cây mới để nhận thêm.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
