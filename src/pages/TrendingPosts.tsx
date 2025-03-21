import React from 'react';
import useSWR from 'swr';
import { TrendingUp, MessageCircle } from 'lucide-react';
import { fetchUsers, fetchUserPosts, fetchPostComments } from '../api/client';
import type { Post, Comment } from '../types';

const TrendingPosts: React.FC = () => {
  const { data: usersData } = useSWR('users', fetchUsers);
  const [trendingPosts, setTrendingPosts] = React.useState<Array<{ post: Post; commentCount: number }>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTrendingPosts = async () => {
      if (!usersData) return;
      
      const userIds = Object.keys(usersData.users);
      const postsPromises = userIds.map(id => fetchUserPosts(id));
      const postsResults = await Promise.all(postsPromises);
      
      const allPosts = postsResults.flatMap(result => result.posts);
      
      // Fetch comments for each post
      const postsWithComments = await Promise.all(
        allPosts.map(async (post) => {
          const comments = await fetchPostComments(post.id);
          return {
            post,
            commentCount: comments.comments.length
          };
        })
      );
      
      // Sort by comment count and get posts with maximum comments
      const maxComments = Math.max(...postsWithComments.map(p => p.commentCount));
      const trending = postsWithComments
        .filter(p => p.commentCount === maxComments)
        .sort((a, b) => b.post.id - a.post.id);
      
      setTrendingPosts(trending);
      setLoading(false);
    };

    fetchTrendingPosts();
  }, [usersData]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Trending Posts
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Posts with the most engagement
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {trendingPosts.map(({ post, commentCount }) => (
            <li key={post.id} className="px-4 py-6">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={`https://source.unsplash.com/100x100/?portrait&${post.userid}`}
                    alt=""
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {usersData?.users[post.userid.toString()]}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{post.content}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {commentCount} comments
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrendingPosts;