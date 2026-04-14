import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${slug}`);
      setPost(response.data.data);
    } catch (err) {
      setError("Post not found");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
        ← Back to Home
      </button>
      <div className="blog-detail">
        <h1>{post.title}</h1>
        <div className="meta">
          <div>By {post.author}</div>
          <div>Published: {formatDate(post.createdAt)}</div>
          <div>Last updated: {formatDate(post.updatedAt)}</div>
        </div>
        <div className="blog-tags" style={{ marginBottom: "20px" }}>
          {post.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
        <div className="content">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index} style={{ marginBottom: "1rem" }}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
