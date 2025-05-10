'use client';

import { useState } from 'react';
import { 
  FaExclamationTriangle, 
  FaMapMarkerAlt, 
  FaImage, 
  FaCloudUploadAlt,
  FaCheck,
  FaList,
  FaUser,
  FaTrash,
  FaEye,
  FaTimes
} from 'react-icons/fa';

// Dữ liệu mẫu cho các báo cáo
const REPORTS = [
  {
    id: 1,
    title: 'Rác thải tại bờ hồ Hoàn Kiếm',
    location: 'Bờ hồ Hoàn Kiếm, Hoàn Kiếm, Hà Nội',
    description: 'Phát hiện một lượng lớn rác thải nhựa tại khu vực bờ hồ phía Nam, gần cầu Thê Húc.',
    images: ['/images/trash-report.jpg'],
    category: 'Rác thải',
    status: 'Đang xử lý',
    date: '05/05/2025',
    votes: 15,
    comments: 3,
  },
  {
    id: 2,
    title: 'Xả thải công nghiệp ra sông',
    location: 'Sông Hồng, gần cầu Long Biên',
    description: 'Phát hiện có dấu hiệu xả thải công nghiệp không qua xử lý, nước có màu đậm bất thường.',
    images: ['/images/pollution-report.jpg'],
    category: 'Ô nhiễm nước',
    status: 'Đã tiếp nhận',
    date: '02/05/2025',
    votes: 28,
    comments: 7,
  },
];

// Các danh mục báo cáo
const CATEGORIES = [
  'Rác thải',
  'Ô nhiễm nước',
  'Ô nhiễm không khí',
  'Phá rừng',
  'Săn bắt động vật',
  'Khác',
];

export default function ReportIssue() {
  const [reports, setReports] = useState(REPORTS);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'form', 'detail'
  const [selectedReport, setSelectedReport] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    category: '',
    images: [],
  });
  
  // Xử lý thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Mô phỏng upload ảnh
  const handleImageUpload = () => {
    // Trong thực tế sẽ cần xử lý upload ảnh thật
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '/images/placeholder-image.jpg']
    }));
  };
  
  // Xử lý xóa ảnh
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  // Xử lý gửi báo cáo
  const handleSubmitReport = (e) => {
    e.preventDefault();
    
    // Thêm báo cáo mới vào danh sách
    const newReport = {
      id: reports.length + 1,
      ...formData,
      status: 'Chờ xác nhận',
      date: new Date().toLocaleDateString('vi-VN'),
      votes: 0,
      comments: 0,
    };
    
    setReports([newReport, ...reports]);
    setFormSubmitted(true);
    
    // Reset form sau khi gửi
    setTimeout(() => {
      setFormSubmitted(false);
      setViewMode('list');
      setFormData({
        title: '',
        location: '',
        description: '',
        category: '',
        images: [],
      });
    }, 2000);
  };
  
  // Xử lý xem chi tiết báo cáo
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setViewMode('detail');
  };
  
  // Xử lý bỏ phiếu cho báo cáo
  const handleVoteReport = (id) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, votes: report.votes + 1 } : report
    ));
    
    if (selectedReport && selectedReport.id === id) {
      setSelectedReport(prev => ({ ...prev, votes: prev.votes + 1 }));
    }
  };
  
  // Render danh sách báo cáo
  const renderReportsList = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Báo cáo vấn đề
        </h1>
        <p className="text-gray-600 mt-1">
          Cùng nhau phát hiện và xử lý vấn đề môi trường
        </p>
      </div>
      
      <button
        onClick={() => setViewMode('form')}
        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
      >
        <FaExclamationTriangle className="mr-2" />
        Báo cáo vấn đề mới
      </button>
      
      <div className="space-y-4 mt-6">
        <h2 className="font-bold text-green-800 flex items-center">
          <FaList className="mr-2" />
          Danh sách báo cáo gần đây
        </h2>
        
        {reports.map(report => (
          <div 
            key={report.id} 
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            onClick={() => handleViewReport(report)}
          >
            <div className="flex justify-between mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                report.status === 'Đang xử lý' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : report.status === 'Đã tiếp nhận' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {report.status}
              </span>
              <span className="text-xs text-gray-500">{report.date}</span>
            </div>
            
            <h3 className="font-semibold text-green-800 mb-1">{report.title}</h3>
            
            <div className="flex items-center text-xs text-gray-600 mb-2">
              <FaMapMarkerAlt className="mr-1" />
              <span>{report.location}</span>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {report.description}
            </p>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-3 text-xs text-gray-500">
                <button 
                  className="flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVoteReport(report.id);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {report.votes}
                </button>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {report.comments}
                </span>
              </div>
              
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-50 text-green-700">
                {report.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // Render form báo cáo
  const renderReportForm = () => (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setViewMode('list')}
          className="mr-3 text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-green-800">
          Báo cáo vấn đề mới
        </h1>
      </div>
      
      {formSubmitted ? (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-green-800 mb-2">Báo cáo đã gửi!</h2>
          <p className="text-green-700">
            Cảm ơn bạn đã báo cáo vấn đề. Chúng tôi sẽ xem xét và phản hồi sớm.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề vấn đề *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="VD: Rác thải nhựa tại bờ hồ"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vị trí *
            </label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="VD: Bờ hồ Hoàn Kiếm, Hà Nội"
                required
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <FaMapMarkerAlt />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả vấn đề *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Mô tả chi tiết vấn đề bạn phát hiện..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {CATEGORIES.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh (tùy chọn)
            </label>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-green-50 text-green-700">
                    <FaImage />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleImageUpload}
                className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-400"
              >
                <FaCloudUploadAlt size={20} />
                <span className="text-xs mt-1">Thêm</span>
              </button>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Gửi báo cáo
            </button>
          </div>
        </form>
      )}
    </div>
  );
  
  // Render chi tiết báo cáo
  const renderReportDetail = () => {
    if (!selectedReport) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setViewMode('list')}
            className="mr-3 text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-green-800 truncate">
            {selectedReport.title}
          </h1>
        </div>
        
        <div className="bg-gray-100 h-48 rounded-lg mb-4 flex items-center justify-center">
          {selectedReport.images && selectedReport.images.length > 0 ? (
            <div className="w-full h-full flex items-center justify-center bg-green-50 text-green-700">
              <FaImage size={32} />
            </div>
          ) : (
            <div className="text-gray-400">Không có hình ảnh</div>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              selectedReport.status === 'Đang xử lý' 
                ? 'bg-yellow-100 text-yellow-800' 
                : selectedReport.status === 'Đã tiếp nhận' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
            }`}>
              {selectedReport.status}
            </span>
            <span className="text-xs text-gray-500">{selectedReport.date}</span>
          </div>
          
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <FaMapMarkerAlt className="mr-2 text-gray-400" />
              <span>{selectedReport.location}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-5 h-5 mr-2 rounded-full bg-green-100 flex items-center justify-center">
                <FaUser className="text-green-700 text-xs" />
              </div>
              <span>Báo cáo ẩn danh</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Mô tả</h3>
            <p className="text-gray-600">{selectedReport.description}</p>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button 
              className="flex items-center text-gray-600"
              onClick={() => handleVoteReport(selectedReport.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span>Ủng hộ ({selectedReport.votes})</span>
            </button>
            
            <span className="text-sm font-medium px-2 py-0.5 rounded bg-green-50 text-green-700">
              {selectedReport.category}
            </span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-700 mb-3">Bình luận ({selectedReport.comments})</h3>
          
          {selectedReport.comments > 0 ? (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <FaUser className="text-blue-600 text-xs" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Ban Môi trường</div>
                    <div className="text-xs text-gray-500">03/05/2025</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Cảm ơn bạn đã báo cáo. Chúng tôi đã tiếp nhận và sẽ cử người đến kiểm tra.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Chưa có bình luận nào.</p>
          )}
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                placeholder="Viết bình luận..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-600 text-white px-4 py-2 rounded-r-lg font-semibold hover:bg-green-700">
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render theo chế độ xem
  const renderContent = () => {
    switch (viewMode) {
      case 'form':
        return renderReportForm();
      case 'detail':
        return renderReportDetail();
      default:
        return renderReportsList();
    }
  };
  
  return (
    <div className="pb-16">
      {renderContent()}
    </div>
  );
}