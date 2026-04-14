import React, { useState, useEffect } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    status: "published",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log("Đang gọi API lấy danh sách posts...");
      const response = await api.get("/admin/posts");
      console.log("Kết quả:", response.data);
      setPosts(response.data.data || []);
      setError("");
    } catch (err) {
      console.error("Chi tiết lỗi:", err);
      setError(
        "Không thể tải danh sách bài viết. Vui lòng kiểm tra: 1) Backend đã chạy chưa? 2) Token có hợp lệ không?"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const postData = {
      title: formData.title,
      content: formData.content,
      tags: formData.tags.split(",").map((t) => t.trim()),
      status: formData.status,
    };

    try {
      console.log("Đang tạo bài viết mới...", postData);
      await api.post("/admin/posts", postData);
      setMessage("✅ Tạo bài viết thành công!");
      setFormData({ title: "", content: "", tags: "", status: "published" });
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      console.error("Lỗi tạo bài viết:", err);
      setMessage("❌ Tạo bài viết thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      try {
        await api.delete(`/admin/posts/${id}`);
        setMessage("✅ Xóa bài viết thành công!");
        fetchPosts();
      } catch (err) {
        console.error("Lỗi xóa bài viết:", err);
        setMessage("❌ Xóa bài viết thất bại");
      }
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Quản lý bài viết</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hủy" : "+ Thêm bài viết"}
        </button>
      </div>

      {message && (
        <div className={message.includes("✅") ? "success" : "error"}>
          {message}
        </div>
      )}
      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="post-form">
          <h2>Thêm bài viết mới</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tiêu đề:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Nội dung:</label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows="10"
                required
              />
            </div>
            <div className="form-group">
              <label>Tags (cách nhau bằng dấu phẩy):</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="react, nodejs, javascript"
              />
            </div>
            <button type="submit">Tạo bài viết</button>
          </form>
        </div>
      )}

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Trạng thái</th>
              <th>Tác giả</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>{post.status}</td>
                  <td>{post.author}</td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{ background: "red" }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
