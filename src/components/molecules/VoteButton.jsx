import { useState } from "react";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";

const VoteButton = ({ 
  postId, 
  votes = 0, 
  hasVoted = false, 
  onVote,
  className,
  size = "md" 
}) => {
  const [isVoting, setIsVoting] = useState(false);
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [voted, setVoted] = useState(hasVoted);

  const handleVote = async () => {
    if (isVoting) return;
    
    setIsVoting(true);
    
    try {
      // Optimistic update
      const newVoted = !voted;
      const newVotes = newVoted ? currentVotes + 1 : currentVotes - 1;
      
      setVoted(newVoted);
      setCurrentVotes(newVotes);
      
      if (onVote) {
        await onVote(postId, newVoted);
      }
      
      toast.success(newVoted ? "Vote added!" : "Vote removed", {
        autoClose: 1500
      });
    } catch (error) {
      // Revert on error
      setVoted(voted);
      setCurrentVotes(currentVotes);
      toast.error("Failed to update vote");
    } finally {
      setIsVoting(false);
    }
  };

  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base", 
    lg: "w-16 h-16 text-lg"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <button
      onClick={handleVote}
      disabled={isVoting}
      className={cn(
        "flex flex-col items-center justify-center rounded-full border-2 transition-all duration-200 group",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        voted 
          ? "bg-gradient-to-br from-primary-500 to-secondary-500 border-primary-500 text-white shadow-lg" 
          : "bg-white border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-600 hover:shadow-md",
        sizeClasses[size],
        voted && "vote-success",
        className
      )}
    >
      <ApperIcon 
        name={voted ? "ChevronUp" : "ChevronUp"} 
        className={cn(
          iconSizes[size],
          isVoting && "animate-pulse"
        )} 
      />
      <span className={cn(
        "font-semibold leading-none",
        size === "sm" && "text-xs",
        size === "md" && "text-sm", 
        size === "lg" && "text-base"
      )}>
        {currentVotes}
      </span>
    </button>
  );
};

export default VoteButton;