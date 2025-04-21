import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Button, ListGroup, Modal, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const FriendManager = ({ theme }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  // Load friend requests and pending requests from localStorage
  useEffect(() => {
    if (user) {
      const requests = JSON.parse(localStorage.getItem(`friendRequests_${user.id}`) || '[]');
      const pending = JSON.parse(localStorage.getItem(`pendingRequests_${user.id}`) || '[]');
      setFriendRequests(requests);
      setPendingRequests(pending);
    }
  }, [user]);

  // Save friend requests to localStorage
  useEffect(() => {
    if (user && friendRequests.length > 0) {
      try {
        // Limit the number of friend requests to prevent quota issues
        let requestsToSave = [...friendRequests];
        if (requestsToSave.length > 20) {
          requestsToSave = requestsToSave.slice(0, 20);
        }
        localStorage.setItem(`friendRequests_${user.id}`, JSON.stringify(requestsToSave));
      } catch (error) {
        console.error("Error saving friend requests to localStorage:", error);
        // Continue without breaking the app if localStorage fails
      }
    } else if (user) {
      try {
        localStorage.removeItem(`friendRequests_${user.id}`);
      } catch (error) {
        console.error("Error removing friend requests from localStorage:", error);
      }
    }
  }, [friendRequests, user]);

  // Save pending requests to localStorage
  useEffect(() => {
    if (user && pendingRequests.length > 0) {
      try {
        // Limit the number of pending requests to prevent quota issues
        let pendingToSave = [...pendingRequests];
        if (pendingToSave.length > 20) {
          pendingToSave = pendingToSave.slice(0, 20);
        }
        localStorage.setItem(`pendingRequests_${user.id}`, JSON.stringify(pendingToSave));
      } catch (error) {
        console.error("Error saving pending requests to localStorage:", error);
        // Continue without breaking the app if localStorage fails
      }
    } else if (user) {
      try {
        localStorage.removeItem(`pendingRequests_${user.id}`);
      } catch (error) {
        console.error("Error removing pending requests from localStorage:", error);
      }
    }
  }, [pendingRequests, user]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    // Get all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    
    // Get current user's friends
    const currentUserFriends = JSON.parse(localStorage.getItem(`friends_${user.id}`) || '[]');
    
    // Filter users based on search term and exclude:
    // 1. Current user
    // 2. Existing friends
    // 3. Users who sent requests
    // 4. Users who have pending requests
    const results = allUsers.filter(u => 
      u.id !== user.id && 
      !currentUserFriends.some(f => f.id === u.id) && 
      !friendRequests.some(fr => fr.id === u.id) && 
      !pendingRequests.some(pr => pr.id === u.id) &&
      (u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
       u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setSearchResults(results);
  };

  const sendFriendRequest = (targetUser) => {
    try {
      // Check if already friends
      const currentUserFriends = JSON.parse(localStorage.getItem(`friends_${user.id}`) || '[]');
      if (currentUserFriends.some(f => f.id === targetUser.id)) {
        return; // Already friends, do nothing
      }

      // Add to pending requests for current user
      setPendingRequests(prev => {
        if (prev.some(p => p.id === targetUser.id)) return prev;
        return [...prev, targetUser];
      });
      
      // Add to friend requests for target user
      const targetRequests = JSON.parse(localStorage.getItem(`friendRequests_${targetUser.id}`) || '[]');
      
      // Limit the number of friend requests to prevent quota issues
      // Only keep the 20 most recent requests if getting too large
      if (targetRequests.length >= 20) {
        targetRequests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        targetRequests.splice(20); // Keep only 20 items
      }
      
      if (!targetRequests.some(r => r.id === user.id)) {
        // Only store essential user data to reduce storage size
        const minimalUserData = {
          id: user.id,
          name: user.name,
          username: user.username,
          profileImage: user.profileImage,
          timestamp: new Date().toISOString()
        };
        
        targetRequests.push(minimalUserData);
        
        try {
          localStorage.setItem(`friendRequests_${targetUser.id}`, JSON.stringify(targetRequests));
        } catch (storageError) {
          console.error("Storage quota exceeded:", storageError);
          alert("Unable to send friend request - storage limit reached. Try again later after clearing some browser data.");
          // Still update the UI even if localStorage fails
        }
      }
      
      // Clear search results
      setSearchResults([]);
      setSearchTerm('');
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Something went wrong while sending the friend request. Please try again.");
    }
  };

  const acceptFriendRequest = (requestUser) => {
    try {
      // Add to friends list for both users
      const currentUserFriends = JSON.parse(localStorage.getItem(`friends_${user.id}`) || '[]');
      const requestUserFriends = JSON.parse(localStorage.getItem(`friends_${requestUser.id}`) || '[]');
      
      // Prune friend data to minimize storage
      const prunedUserData = {
        id: user.id,
        name: user.name,
        username: user.username,
        profileImage: user.profileImage
      };
      
      const prunedRequestUserData = {
        id: requestUser.id,
        name: requestUser.name,
        username: requestUser.username,
        profileImage: requestUser.profileImage
      };
      
      // Limit the number of friends stored (if needed)
      if (currentUserFriends.length >= 100) {
        currentUserFriends.splice(0, currentUserFriends.length - 99); // Keep only last 99 to add new one
      }
      
      if (requestUserFriends.length >= 100) {
        requestUserFriends.splice(0, requestUserFriends.length - 99); // Keep only last 99 to add new one
      }
      
      // Add current user to requester's friends list
      if (!requestUserFriends.some(f => f.id === user.id)) {
        requestUserFriends.push(prunedUserData);
        try {
          localStorage.setItem(`friends_${requestUser.id}`, JSON.stringify(requestUserFriends));
        } catch (storageError) {
          console.error("Storage quota exceeded for requester's friends:", storageError);
          // Continue execution - we'll still update the UI even if storage fails
        }
      }

      // Add requester to current user's friends list
      if (!currentUserFriends.some(f => f.id === requestUser.id)) {
        currentUserFriends.push(prunedRequestUserData);
        try {
          localStorage.setItem(`friends_${user.id}`, JSON.stringify(currentUserFriends));
        } catch (storageError) {
          console.error("Storage quota exceeded for current user's friends:", storageError);
          // Continue execution - we'll still update the UI even if storage fails
        }
      }
      
      // Remove from friend requests for current user
      setFriendRequests(prev => prev.filter(req => req.id !== requestUser.id));
      
      // Remove from pending requests for the requester
      try {
        const otherUserPending = JSON.parse(localStorage.getItem(`pendingRequests_${requestUser.id}`) || '[]');
        const updatedPending = otherUserPending.filter(req => req.id !== user.id);
        localStorage.setItem(`pendingRequests_${requestUser.id}`, JSON.stringify(updatedPending));
      } catch (error) {
        console.error("Error updating pending requests:", error);
        // Continue execution
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Something went wrong while accepting the friend request. The friend may have been added anyway.");
    }
  };

  const rejectFriendRequest = (requestUser) => {
    try {
      // Remove from friend requests for current user
      setFriendRequests(prev => prev.filter(req => req.id !== requestUser.id));
      
      // Remove from pending requests for the requester
      try {
        const otherUserPending = JSON.parse(localStorage.getItem(`pendingRequests_${requestUser.id}`) || '[]');
        const updatedPending = otherUserPending.filter(req => req.id !== user.id);
        localStorage.setItem(`pendingRequests_${requestUser.id}`, JSON.stringify(updatedPending));
      } catch (error) {
        console.error("Error updating pending requests during rejection:", error);
        // Continue execution - we'll still update the UI
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  return (
    <>
      <div className="mb-4">
        <InputGroup>
          <Form.Control
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
          />
          <Button variant="outline-primary" onClick={handleSearch}>
            <i className="bi bi-search"></i>
          </Button>
          <Button 
            variant="outline-primary" 
            onClick={() => setShowRequestsModal(true)}
            className="position-relative"
          >
            <i className="bi bi-people-fill"></i>
            {friendRequests.length > 0 && (
              <Badge 
                bg="danger" 
                className="position-absolute top-0 start-100 translate-middle rounded-pill"
              >
                {friendRequests.length}
              </Badge>
            )}
          </Button>
        </InputGroup>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <ListGroup className="mt-2">
            {searchResults.map(result => (
              <ListGroup.Item
                key={result.id}
                className={`d-flex justify-content-between align-items-center ${
                  theme === 'dark' ? 'bg-dark text-light border-secondary' : ''
                }`}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={result.profileImage || 'https://via.placeholder.com/40'}
                    alt={result.name}
                    className="rounded-circle me-2"
                    width="40"
                    height="40"
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    <div className="fw-bold">{result.name}</div>
                    <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>@{result.username}</small>
                  </div>
                </div>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => sendFriendRequest(result)}
                >
                  Add Friend
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      {/* Friend Requests Modal */}
      <Modal
        show={showRequestsModal}
        onHide={() => setShowRequestsModal(false)}
        centered
        className={theme === 'dark' ? 'dark-modal' : ''}
      >
        <Modal.Header className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}>
          <Modal.Title>Friend Requests</Modal.Title>
          <Button 
            variant="link" 
            className="text-decoration-none p-0 ms-2" 
            onClick={() => setShowRequestsModal(false)}
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        </Modal.Header>
        <Modal.Body className={theme === 'dark' ? 'bg-dark text-light' : ''}>
          {friendRequests.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-people fs-1 text-muted mb-3 d-block"></i>
              <p className="mb-0">No friend requests</p>
            </div>
          ) : (
            <ListGroup variant={theme === 'dark' ? 'dark' : ''}>
              {friendRequests.map(request => (
                <ListGroup.Item
                  key={request.id}
                  className={`${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={request.profileImage || 'https://via.placeholder.com/40'}
                        alt={request.name}
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                        style={{ objectFit: 'cover' }}
                      />
                      <div>
                        <div className="fw-bold">{request.name}</div>
                        <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                          @{request.username}
                        </small>
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => acceptFriendRequest(request)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => rejectFriendRequest(request)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FriendManager; 