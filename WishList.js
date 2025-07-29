import React, { useState, useEffect } from "react";
import ProfilePage from '../CSS/ProfilePage.css'; // Add this import
import { useParams } from "react-router-dom";

const UserList = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4501/api/users/${id}/wishlist`) // Correct the fetch URL
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => setError(error.message));
  }, [id]); // Use id as the dependency

  if (error) return <div>Error: {error}</div>;
  if (!users.length) return <div>Loading...</div>;

  return (
    <div>
      <h1>Wishlist</h1>
      {users.map((user) => (
        <div key={user._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.emailOrMobile}</p>
          <p><strong>Wishlist:</strong> {user.wishlist.length ? user.wishlist.join(", ") : "No items"}</p>
        </div>
      ))}
      <ProfilePage users={users} /> {/* Pass users as props */}
    </div>
  );
};

export default UserList;
