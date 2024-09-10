'use client'
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Page = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Artificial delay for loading demonstration
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]); // Correctly include user in dependencies

  return (
    <div className='p-4'>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <p>Welcome, {user.displayName}! You are logged in to view this page (protected route).</p>
      ) : (
        <p>You must be logged in to view this page (protected route).</p>
      )}
    </div>
  );
};

export default Page;
