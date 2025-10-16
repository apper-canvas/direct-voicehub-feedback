import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import VoteButton from "@/components/molecules/VoteButton";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { postService } from "@/services/api/postService";
import { boardService } from "@/services/api/boardService";

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPostData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const postData = await postService.getById(postId);
      setPost(postData);
      
      // Load board data
      if (postData.boardId) {
        try {
          const boardData = await boardService.getById(postData.boardId);
          setBoard(boardData);
        } catch (boardError) {
          console.warn("Failed to load board data:", boardError);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      loadPostData();
    }
  }, [postId]);

  const handleVote = async (postId, hasVoted) => {
    try {
      await postService.vote(postId, hasVoted);
      // Update local state
      setPost(prevPost => ({
        ...prevPost,
        votes: hasVoted ? prevPost.votes + 1 : Math.max(0, prevPost.votes - 1),
        hasVoted
      }));
    } catch (error) {
      throw error; // Re-throw to be handled by VoteButton component
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      planned: "planned",
      "in-progress": "in-progress",
      completed: "completed",
      cancelled: "cancelled"
    };
    return variants[status] || "default";
  };

  const handleBackToBoard = () => {
    if (post?.boardId) {
      navigate(`/boards/${post.boardId}`);
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return <Loading type="post-detail" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load post"
        message="We couldn't load the post details. Please try again."
        onRetry={loadPostData}
      />
    );
  }

  if (!post) {
    return (
      <Error 
        title="Post not found"
        message="The post you're looking for doesn't exist or has been removed."
        showRetry={false}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToBoard}
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          Back to Board
        </Button>
        
        {board && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-lg">{board.icon}</span>
            <span>{board.name}</span>
          </div>
        )}
      </div>

      {/* Post Header */}
      <div className="bg-white rounded-lg shadow-card border p-8">
        <div className="flex gap-6">
          {/* Vote Button */}
          <div className="flex-shrink-0">
            <VoteButton
              postId={post.Id}
              votes={post.votes}
              hasVoted={post.hasVoted}
              onVote={handleVote}
              size="lg"
            />
          </div>

          {/* Post Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>
              
              <Badge 
                variant={getStatusVariant(post.status)}
                size="lg"
              >
                {post.status}
              </Badge>
            </div>

            {/* Author and Meta */}
            <div className="flex items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {post.author?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <ApperIcon name="MessageSquare" className="w-4 h-4" />
                  <span>{post.commentCount || 0} comments</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <ApperIcon name="Eye" className="w-4 h-4" />
                  <span>{post.viewCount || 0} views</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="bg-white rounded-lg shadow-card border p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          {post.description.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-card border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <VoteButton
              postId={post.Id}
              votes={post.votes}
              hasVoted={post.hasVoted}
              onVote={handleVote}
              size="md"
            />
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">{post.votes}</span> people found this helpful
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast.info("Share functionality coming soon")}
            >
              <ApperIcon name="Share2" className="w-4 h-4" />
              Share
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast.info("Bookmark functionality coming soon")}
            >
              <ApperIcon name="Bookmark" className="w-4 h-4" />
              Bookmark
            </Button>
          </div>
        </div>
      </div>

      {/* Comments Section Placeholder */}
      <div className="bg-white rounded-lg shadow-card border p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Comments</h2>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="MessageSquare" className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Comments Coming Soon</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            The discussion and commenting system will be available in the next update. 
            Stay tuned for more interactive features!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;