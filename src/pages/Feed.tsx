import React from 'react';
import useSWR from 'swr';
import { BarChart2 } from 'lucide-react';
import { fetchUsers, fetchUserPosts } from '../api/client';
import type { Post } from '../types';

const Feed: React.FC = () => {
  const { data: usersData } = useSWR('users', fetchUsers);
  const [allPosts, setAllPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAllPosts = async () => {
      if (!usersData) return;
      
      const userIds = Object.keys(usersData.users);
      const postsPromises = userIds.map(id => fetchUserPosts(id));
      const postsResults = await Promise.all(postsPromises);
      
      const posts = postsResults.flatMap(result => result.posts)
        .sort((a, b) => b.id - a.id); // Sort by newest first
      
      setAllPosts(posts);
      setLoading(false);
    };

    fetchAllPosts();
  }, [usersData]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <BarChart2 className="h-5 w-5 mr-2" />
          Feed
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Real-time social media feed
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {allPosts.map((post) => (
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
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Feed;