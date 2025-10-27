'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaHeart, FaRegHeart, FaShare, FaCalendarAlt, FaComment, FaUser } from 'react-icons/fa';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lọc bài viết theo từ khóa tìm kiếm
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.activity?.toLowerCase().includes(searchTerm.toLowerCase()) || '';

    return matchesSearch;
  });
  
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

      {/* Danh sách bài viết */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Đang tải bài viết...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {post.images && (
                <div className="h-48 bg-gray-200">
                  <img
                    src={post.images}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center mb-3 text-sm text-gray-600">
                  <FaUser className="mr-2" />
                  <span className="font-medium">{post.user.name}</span>
                  <span className="mx-2">•</span>
                  <FaCalendarAlt className="mr-2" />
                  <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>

                {post.activity && (
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                      {post.activity}
                    </span>
                  </div>
                )}

                <p className="text-gray-700 text-base mb-4 whitespace-pre-wrap">{post.content}</p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-gray-600">
                    <button className="flex items-center space-x-1 hover:text-red-500">
                      <FaHeart />
                      <span className="text-sm">{post._count.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-500">
                      <FaComment />
                      <span className="text-sm">{post._count.comments}</span>
                    </button>
                  </div>

                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <FaShare className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {posts.length === 0 ? 'Chưa có bài viết nào.' : 'Không tìm thấy bài viết nào phù hợp.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}