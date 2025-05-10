'use client';

import { useState } from 'react';
import { 
  FaWater, 
  FaBolt, 
  FaChartLine, 
  FaRegLightbulb,
  FaPlusCircle,
  FaChevronDown,
  FaChevronRight,
  FaTrash,
  FaPencilAlt,
  FaTimes
} from 'react-icons/fa';

// Dữ liệu mẫu cho tiêu thụ điện
const ELECTRICITY_DATA = [
  { month: 'T1', usage: 120, cost: 240000 },
  { month: 'T2', usage: 115, cost: 230000 },
  { month: 'T3', usage: 125, cost: 250000 },
  { month: 'T4', usage: 110, cost: 220000 },
  { month: 'T5', usage: 100, cost: 200000 },
];

// Dữ liệu mẫu cho tiêu thụ nước
const WATER_DATA = [
  { month: 'T1', usage: 12, cost: 120000 },
  { month: 'T2', usage: 14, cost: 140000 },
  { month: 'T3', usage: 13, cost: 130000 },
  { month: 'T4', usage: 12, cost: 120000 },
  { month: 'T5', usage: 11, cost: 110000 },
];

// Dữ liệu mẫu cho thiết bị điện
const DEVICES = [
  { 
    id: 1, 
    name: 'Tủ lạnh', 
    wattage: 150, 
    hoursPerDay: 24, 
    type: 'electricity',
    active: true
  },
  { 
    id: 2, 
    name: 'Máy lạnh', 
    wattage: 1200, 
    hoursPerDay: 6, 
    type: 'electricity',
    active: true
  },
  { 
    id: 3, 
    name: 'Đèn phòng khách', 
    wattage: 40, 
    hoursPerDay: 5, 
    type: 'electricity',
    active: true
  },
  { 
    id: 4, 
    name: 'Vòi tưới cây', 
    wattage: 0, 
    hoursPerDay: 0.5,
    litersPerHour: 10, 
    type: 'water',
    active: true
  },
  { 
    id: 5, 
    name: 'Vòi rửa chén', 
    wattage: 0, 
    hoursPerDay: 1,
    litersPerHour: 5, 
    type: 'water',
    active: true
  }
];

// Dữ liệu mẫu cho mẹo tiết kiệm
const SAVING_TIPS = [
  {
    id: 1,
    title: 'Tắt đèn và thiết bị khi không sử dụng',
    description: 'Tạo thói quen tắt đèn và rút phích cắm các thiết bị khi không sử dụng.',
    type: 'electricity',
    savingPotential: '10-15%',
  },
  {
    id: 2,
    title: 'Sử dụng bóng đèn LED',
    description: 'Bóng đèn LED tiêu thụ ít điện hơn 75% so với bóng đèn sợi đốt truyền thống.',
    type: 'electricity',
    savingPotential: '5-10%',
  },
  {
    id: 3,
    title: 'Sửa vòi nước bị rò rỉ',
    description: 'Một vòi nước rò rỉ có thể lãng phí hàng nghìn lít nước mỗi năm.',
    type: 'water',
    savingPotential: '10%',
  },
  {
    id: 4,
    title: 'Tắm ngắn hơn',
    description: 'Giảm thời gian tắm xuống 5 phút có thể tiết kiệm tới 35 lít nước mỗi lần.',
    type: 'water',
    savingPotential: '15%',
  },
];

export default function ResourceManagement() {
  const [activeTab, setActiveTab] = useState('electricity'); // 'electricity' hoặc 'water'
  const [devices, setDevices] = useState(DEVICES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editDeviceId, setEditDeviceId] = useState(null);
  
  const [newDevice, setNewDevice] = useState({
    name: '',
    wattage: 0,
    hoursPerDay: 0,
    litersPerHour: 0,
    type: 'electricity',
  });
  
  // Lọc thiết bị theo loại
  const filteredDevices = devices.filter(device => device.type === activeTab);
  
  // Tính tổng tiêu thụ
  const totalUsage = filteredDevices.reduce((sum, device) => {
    if (device.active) {
      if (activeTab === 'electricity') {
        // Tính kWh trong tháng
        return sum + (device.wattage * device.hoursPerDay * 30) / 1000;
      } else {
        // Tính m³ trong tháng
        return sum + (device.litersPerHour * device.hoursPerDay * 30) / 1000;
      }
    }
    return sum;
  }, 0);
  
  // Tính chi phí ước tính
  const estimatedCost = activeTab === 'electricity' 
    ? totalUsage * 2000 // 2000 VND/kWh
    : totalUsage * 10000; // 10000 VND/m³
  
  // Xử lý thay đổi bảng
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAddForm(false);
    setEditDeviceId(null);
  };
  
  // Xử lý thay đổi trạng thái thiết bị
  const toggleDeviceActive = (id) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, active: !device.active } : device
    ));
  };
  
  // Xử lý thay đổi form thêm thiết bị
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewDevice(prev => ({
      ...prev,
      [name]: name === 'name' ? value : parseFloat(value) || 0
    }));
  };
  
  // Xử lý thêm thiết bị mới
  const handleAddDevice = (e) => {
    e.preventDefault();
    
    const deviceToAdd = {
      id: Date.now(),
      ...newDevice,
      active: true,
    };
    
    setDevices([...devices, deviceToAdd]);
    setShowAddForm(false);
    setNewDevice({
      name: '',
      wattage: 0,
      hoursPerDay: 0,
      litersPerHour: 0,
      type: activeTab,
    });
  };
  
  // Xử lý bắt đầu chỉnh sửa thiết bị
  const handleStartEdit = (device) => {
    setEditDeviceId(device.id);
    setNewDevice({
      name: device.name,
      wattage: device.wattage || 0,
      hoursPerDay: device.hoursPerDay || 0,
      litersPerHour: device.litersPerHour || 0,
      type: device.type,
    });
  };
  
  // Xử lý lưu chỉnh sửa thiết bị
  const handleSaveEdit = () => {
    setDevices(devices.map(device => 
      device.id === editDeviceId 
        ? { ...device, ...newDevice, id: editDeviceId } 
        : device
    ));
    
    setEditDeviceId(null);
    setNewDevice({
      name: '',
      wattage: 0,
      hoursPerDay: 0,
      litersPerHour: 0,
      type: activeTab,
    });
  };
  
  // Xử lý xóa thiết bị
  const handleDeleteDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
    
    if (editDeviceId === id) {
      setEditDeviceId(null);
    }
  };
  
  // Lấy dữ liệu biểu đồ theo tab hiện tại
  const getChartData = () => {
    return activeTab === 'electricity' ? ELECTRICITY_DATA : WATER_DATA;
  };
  
  // Render trạng thái sử dụng tài nguyên
  const renderUsageStats = () => {
    const chartData = getChartData();
    const currentMonth = chartData[chartData.length - 1];
    const prevMonth = chartData[chartData.length - 2];
    
    const changePercentage = ((currentMonth.usage - prevMonth.usage) / prevMonth.usage * 100).toFixed(1);
    const isDecrease = currentMonth.usage < prevMonth.usage;
    
    const unit = activeTab === 'electricity' ? 'kWh' : 'm³';
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">
            Tình hình sử dụng {activeTab === 'electricity' ? 'điện' : 'nước'}
          </h2>
          <span className="text-xs text-gray-500">
            Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-gray-500 text-sm">Lượng sử dụng</div>
            <div className="text-2xl font-bold text-gray-800">
              {currentMonth.usage} {unit}
            </div>
            <div className={`text-xs flex items-center ${isDecrease ? 'text-green-600' : 'text-red-600'}`}>
              {isDecrease ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {Math.abs(changePercentage)}% so với tháng trước
            </div>
          </div>
          
          <div>
            <div className="text-gray-500 text-sm">Chi phí</div>
            <div className="text-2xl font-bold text-gray-800">
              {currentMonth.cost.toLocaleString('vi-VN')} đ
            </div>
            <div className="text-xs text-gray-500">
              {activeTab === 'electricity' ? '2,000đ/kWh' : '10,000đ/m³'}
            </div>
          </div>
        </div>
        
        <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-gray-400">Biểu đồ sử dụng {activeTab === 'electricity' ? 'điện' : 'nước'}</div>
        </div>
      </div>
    );
  };
  
  // Render danh sách thiết bị
  const renderDevicesList = () => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-800">
          Thiết bị {activeTab === 'electricity' ? 'điện' : 'nước'}
        </h2>
        
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditDeviceId(null);
            setNewDevice({
              name: '',
              wattage: 0,
              hoursPerDay: 0,
              litersPerHour: 0,
              type: activeTab,
            });
          }}
          className="text-sm text-green-600 flex items-center"
        >
          <FaPlusCircle className="mr-1" />
          {showAddForm ? 'Đóng' : 'Thêm thiết bị'}
        </button>
      </div>
      
      {showAddForm && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">
            {editDeviceId ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
          </h3>
          
          <form onSubmit={editDeviceId ? handleSaveEdit : handleAddDevice} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tên thiết bị</label>
              <input
                type="text"
                name="name"
                value={newDevice.name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="VD: Tủ lạnh"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {activeTab === 'electricity' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Công suất (W)</label>
                  <input
                    type="number"
                    name="wattage"
                    value={newDevice.wattage}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="VD: 150"
                    min="0"
                  />
                </div>
              )}
              
              {activeTab === 'water' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Lít/giờ</label>
                  <input
                    type="number"
                    name="litersPerHour"
                    value={newDevice.litersPerHour}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="VD: 10"
                    min="0"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Giờ sử dụng/ngày</label>
                <input
                  type="number"
                  name="hoursPerDay"
                  value={newDevice.hoursPerDay}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="VD: 5"
                  min="0"
                  max="24"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditDeviceId(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {editDeviceId ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredDevices.length > 0 ? (
          filteredDevices.map(device => (
            <div key={device.id} className="border rounded-lg overflow-hidden">
              <div className="flex items-center p-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={device.active}
                    onChange={() => toggleDeviceActive(device.id)}
                    className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
                
                <div className="ml-3 flex-1">
                  <h3 className={`font-medium ${device.active ? 'text-gray-800' : 'text-gray-500'}`}>
                    {device.name}
                  </h3>
                  <div className="text-xs text-gray-500">
                    {activeTab === 'electricity' 
                      ? `${device.wattage}W • ${device.hoursPerDay} giờ/ngày • ${((device.wattage * device.hoursPerDay * 30) / 1000).toFixed(1)} kWh/tháng`
                      : `${device.litersPerHour} lít/giờ • ${device.hoursPerDay} giờ/ngày • ${((device.litersPerHour * device.hoursPerDay * 30) / 1000).toFixed(1)} m³/tháng`
                    }
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleStartEdit(device)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <FaPencilAlt size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteDevice(device.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            Chưa có thiết bị nào. Hãy thêm thiết bị để theo dõi.
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-gray-600">Tổng ước tính</div>
            <div className="text-xl font-bold text-gray-800">
              {totalUsage.toFixed(1)} {activeTab === 'electricity' ? 'kWh' : 'm³'}/tháng
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-gray-600">Chi phí ước tính</div>
            <div className="text-xl font-bold text-green-600">
              {estimatedCost.toLocaleString('vi-VN')} đ/tháng
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render mẹo tiết kiệm
  const renderSavingTips = () => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-800">
          Mẹo tiết kiệm {activeTab === 'electricity' ? 'điện' : 'nước'}
        </h2>
        <FaRegLightbulb className="text-yellow-500" />
      </div>
      
      <div className="space-y-3">
        {SAVING_TIPS.filter(tip => tip.type === activeTab).map(tip => (
          <div key={tip.id} className="p-3 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-1">{tip.title}</h3>
            <p className="text-sm text-blue-700 mb-1">{tip.description}</p>
            <div className="text-xs text-blue-600 font-medium">
              Tiết kiệm tiềm năng: {tip.savingPotential}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6 pb-16">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Tiết kiệm tài nguyên
        </h1>
        <p className="text-gray-600 mt-1">
          Theo dõi và quản lý việc sử dụng điện, nước
        </p>
      </div>
      
      {/* Tab lựa chọn */}
      <div className="flex rounded-lg overflow-hidden border">
        <button
          className={`flex-1 py-3 flex items-center justify-center ${
            activeTab === 'electricity' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700'
          }`}
          onClick={() => handleTabChange('electricity')}
        >
          <FaBolt className="mr-2" />
          <span>Điện</span>
        </button>
        <button
          className={`flex-1 py-3 flex items-center justify-center ${
            activeTab === 'water' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700'
          }`}
          onClick={() => handleTabChange('water')}
        >
          <FaWater className="mr-2" />
          <span>Nước</span>
        </button>
      </div>
      
      {/* Nội dung */}
      {renderUsageStats()}
      
      {renderDevicesList()}
      
      {renderSavingTips()}
      
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
          <FaChartLine className="mr-2" />
          Tiết kiệm cùng gia đình
        </h3>
        <p className="text-sm text-yellow-700">
          Chia sẻ ứng dụng với các thành viên trong gia đình để cùng theo dõi và tiết kiệm tài nguyên.
        </p>
      </div>
    </div>
  );
}