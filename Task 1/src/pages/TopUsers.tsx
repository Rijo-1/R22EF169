import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetchUsers, fetchUserPosts } from '../api/client';
import { Users } from 'lucide-react';

const TopUsers: React.FC = () => {
  const { data: usersData, error: usersError } = useSWR('users', fetchUsers);
  const [topUsers, setTopUsers] = useState<Array<{ id: string; name: string; postCount: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      if (!usersData) return;

      try {
        const userIds = Object.keys(usersData.users);

   
        const postsData = await Promise.all(
          userIds.map(async (id) => {
            try {
              const posts = await fetchUserPosts(id);
              return { id, name: usersData.users[id], postCount: posts.posts.length };
            } catch (error) {
              console.error(`Failed to fetch posts for user ${id}:`, error);
              return { id, name: usersData.users[id], postCount: 0 }; 
            }
          })
        );

        const sorted = postsData.sort((a, b) => b.postCount - a.postCount).slice(0, 5);

        setTopUsers(sorted);
      } catch (error) {
        console.error("Error fetching top users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, [usersData]);

  if (usersError) return <div className="text-red-500">Error loading users.</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Top Users
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Users with the highest number of posts
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {topUsers.map((user) => (
            <li key={user.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} // Using DiceBear for avatars
                    alt={user.name}
                    onError={(e) => (e.currentTarget.src = '/fallback-avatar.png')} // Fallback avatar
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.postCount} posts</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopUsers;
