'use client';

import { useState } from 'react';
import { FaSearch, FaBookmark, FaRegBookmark, FaShare, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';

// Dữ liệu mẫu cho các bài viết
const ARTICLES = [
  {
    id: 1,
    title: 'Cách giảm thiểu rác thải nhựa trong sinh hoạt hàng ngày',
    excerpt: 'Với những thói quen đơn giản, bạn có thể giảm đáng kể lượng rác thải nhựa và góp phần bảo vệ môi trường.',
    image: '/images/reduce-plastic.jpg',
    date: '05/05/2025',
    category: 'Mẹo hay',
    readTime: '5 phút',
    saved: true,
  },
  {
    id: 2,
    title: 'Thế hệ Z và cuộc chiến chống biến đổi khí hậu',
    excerpt: 'Thanh niên trên toàn cầu đang đứng lên để đòi hỏi hành động quyết liệt từ các nhà lãnh đạo.',
    image: '/images/gen-z-climate.jpg',
    date: '02/05/2025',
    category: 'Xu hướng',
    readTime: '8 phút',
    saved: false,
  },
  {
    id: 3,
    title: 'Loài cây bản địa phù hợp cho vườn trường học',
    excerpt: 'Khám phá các loài cây bản địa dễ trồng, ít chăm sóc và mang lại nhiều lợi ích cho môi trường học đường.',
    image: '/images/native-plants.jpg',
    date: '28/04/2025',
    category: 'Hướng dẫn',
    readTime: '6 phút',
    saved: false,
  },
  {
    id: 4,
    title: 'Năng lượng tái tạo: Giải pháp cho tương lai xanh',
    excerpt: 'Tìm hiểu về các nguồn năng lượng tái tạo và vai trò của chúng trong việc giảm phát thải khí nhà kính.',
    image: '/images/renewable-energy.jpg',
    date: '25/04/2025',
    category: 'Kiến thức',
    readTime: '10 phút',
    saved: true,
  },
];

// Danh mục
const CATEGORIES = [
  'Tất cả',
  'Mẹo hay',
  'Xu hướng',
  'Hướng dẫn',
  'Kiến thức',
  'Sự kiện',
];

export default function Blog() {
  const [articles, setArticles] = useState(ARTICLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  
  // Lọc bài viết theo từ khóa tìm kiếm và danh mục
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Tất cả' || article.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Xử lý lưu bài viết
  const toggleSaveArticle = (id) => {
    setArticles(articles.map(article => 
      article.id === id ? { ...article, saved: !article.saved } : article
    ));
  };
  
  return (
    <div className="space-y-6 pb-16">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">
          Tin tức & Bài viết
        </h1>
        <p className="text-gray-600 mt-1">
          Cập nhật thông tin và mẹo sống xanh
        </p>
      </div>
      
      {/* Thanh tìm kiếm */}
      <div className="relative">
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <FaSearch />
        </div>
      </div>
      
      {/* Danh mục */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2">
        {CATEGORIES.map(category => (
          <button
            key={category}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap text-sm font-medium ${
              activeCategory === category
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Danh sách bài viết */}
      <div className="space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                {/* Placeholder cho hình ảnh */}
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                  <span className="text-green-800 font-semibold">{article.category}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    <span>{article.date}</span>
                  </div>
                  <span>{article.readTime} đọc</span>
                </div>
                
                <h2 className="font-bold text-green-800 mb-2">{article.title}</h2>
                <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
                
                <div className="flex justify-between items-center">
                  <Link 
                    href={`/tin-tuc/${article.id}`}
                    className="text-green-600 text-sm font-medium hover:text-green-700"
                  >
                    Đọc tiếp
                  </Link>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleSaveArticle(article.id)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      {article.saved ? (
                        <FaBookmark className="text-green-600" />
                      ) : (
                        <FaRegBookmark className="text-gray-500" />
                      )}
                    </button>
                    
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <FaShare className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy bài viết nào phù hợp.</p>
          </div>
        )}
      </div>
      
      {/* Thông báo cập nhật */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Đăng ký nhận thông báo</h3>
        <p className="text-sm text-blue-700 mb-3">
          Cập nhật tin tức và mẹo sống xanh mới nhất vào mỗi tuần
        </p>
        <div className="flex">
          <input
            type="email"
            placeholder="Email của bạn"
            className="flex-1 border border-blue-200 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg font-semibold hover:bg-blue-700">
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}