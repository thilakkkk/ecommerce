import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Nav, Card, Modal, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ChatProductMessage from '../components/ChatProductMessage';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Chat = ({ theme }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [chatWishlist, setChatWishlist] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get friends list with profile pictures
  const friends = React.useMemo(() => {
    const savedFriends = JSON.parse(localStorage.getItem(`friends_${user.id}`) || '[]');
    const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    
    // Merge friend data with user data to get profile pictures
    return savedFriends.map(friend => {
      const userData = allUsers.find(u => u.id === friend.id);
      return {
        ...friend,
        profileImage: userData?.profileImage || 'https://via.placeholder.com/40',
        name: userData?.name || friend.name,
        username: userData?.username || friend.username
      };
    });
  }, [user.id]);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChat && user) {
      const chatId = `chat_${Math.min(user.id, selectedChat.id)}_${Math.max(user.id, selectedChat.id)}`;
      const chatMessages = JSON.parse(localStorage.getItem(chatId) || '[]');
      const wishlist = JSON.parse(localStorage.getItem(`chatWishlist_${chatId}`) || '[]');
      setMessages(chatMessages);
      setChatWishlist(wishlist);
    }
  }, [selectedChat, user]);

  // If not authenticated, show login message
  if (!isAuthenticated) {
    return (
      <Container className="mt-4">
        <Card className={`text-center ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
          <Card.Body className="py-5">
            <i className="bi bi-chat-dots fs-1 mb-3 d-block"></i>
            <Card.Title className="mb-3">Please Log In to Access Chat</Card.Title>
            <Card.Text className="mb-4">
              You need to be logged in to view and send messages.
            </Card.Text>
            <Button 
              variant="primary" 
              onClick={() => navigate('/login', { state: { from: '/chat' } })}
              className="px-4"
            >
              Go to Login
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageObj = {
      id: Date.now(),
      sender: user.id,
      content: newMessage.trim(),
      type: 'text',
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, messageObj];
    setMessages(updatedMessages);
    setNewMessage('');

    // Save to localStorage
    localStorage.setItem(`chat_${selectedChat.id}_messages`, JSON.stringify(updatedMessages));
  };

  const handleAddToChatWishlist = (product) => {
    if (chatWishlist.some(item => item.id === product.id)) {
      return;
    }
    const updatedWishlist = [...chatWishlist, product];
    setChatWishlist(updatedWishlist);
    localStorage.setItem(`chat_${selectedChat.id}_wishlist`, JSON.stringify(updatedWishlist));
  };

  const handleRemoveFromChatWishlist = (productId) => {
    const updatedWishlist = chatWishlist.filter(product => product.id !== productId);
    setChatWishlist(updatedWishlist);
    localStorage.setItem(`chat_${selectedChat.id}_wishlist`, JSON.stringify(updatedWishlist));
  };

  const handleDeleteMessage = (messageId) => {
    const updatedMessages = messages.filter(message => message.id !== messageId);
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${selectedChat.id}_messages`, JSON.stringify(updatedMessages));
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToWishlist = (product) => {
    if (isInWishlist(product.id)) {
      return;
    }
    addToWishlist(product);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  return (
    <Container fluid className="py-3" style={{ 
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#e6f3ff',
      minHeight: '100vh',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: ${theme === 'dark' ? '#1a1a1a' : '#f8f9fa'};
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: ${theme === 'dark' ? '#666' : '#999'};
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: ${theme === 'dark' ? '#888' : '#777'};
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: ${theme === 'dark' ? '#666 #1a1a1a' : '#999 #f8f9fa'};
          }
        `}
      </style>
      <Row className="h-100 m-0">
        {/* Chat List */}
        <Col md={3} className={`border-end ${theme === 'dark' ? 'border-secondary' : ''} p-0`} style={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="p-3 border-bottom" style={{ flexShrink: 0 }}>
            <h5 className={theme === 'dark' ? 'text-light' : ''}>Chats</h5>
          </div>
          <div className="custom-scrollbar" style={{ 
            flex: 1,
            overflowY: 'auto',
            position: 'relative'
          }}>
            {friends.length === 0 ? (
              <Card className={`text-center m-3 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
                <Card.Body>
                  <i className="bi bi-people fs-1 text-muted mb-3 d-block"></i>
                  <p className="mb-0">No friends yet</p>
                  <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                    Add friends to start chatting
                  </small>
                </Card.Body>
              </Card>
            ) : (
              <ListGroup variant={theme === 'dark' ? 'dark' : ''} className="border-0">
                {friends.map(friend => (
                  <ListGroup.Item
                    key={friend.id}
                    action
                    active={selectedChat?.id === friend.id}
                    onClick={() => setSelectedChat(friend)}
                    className={`d-flex align-items-center rounded-0 ${
                      theme === 'dark' ? 'bg-dark text-light border-secondary' : ''
                    }`}
                  >
                    <img
                      src={friend.profileImage}
                      alt={friend.name}
                      className="rounded-circle me-2"
                      width="40"
                      height="40"
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <div className="fw-bold">{friend.name}</div>
                      <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                        @{friend.username}
                      </small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </Col>

        {/* Chat Messages Area */}
        <Col md={9} className="d-flex flex-column p-0" style={{ 
          height: '100%',
          position: 'relative'
        }}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className={`p-3 border-bottom ${theme === 'dark' ? 'border-secondary' : ''}`} style={{ flexShrink: 0 }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <img
                      src={selectedChat?.profileImage || 'https://via.placeholder.com/40'}
                      alt={selectedChat?.name}
                      className="rounded-circle me-2"
                      width="40"
                      height="40"
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <h5 className={`mb-0 ${theme === 'dark' ? 'text-light' : ''}`}>
                        {selectedChat?.name}
                      </h5>
                      <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                        @{selectedChat?.username}
                      </small>
                    </div>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setShowWishlistModal(true)}
                    className="d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-heart"></i>
                    Chat Wishlist
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-grow-1 overflow-auto p-3" style={{ 
                height: 'calc(100% - 120px)',
                position: 'relative'
              }}>
                {messages.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-chat-dots fs-1 text-muted mb-3 d-block"></i>
                    <h5 className={theme === 'dark' ? 'text-light' : ''}>No Messages Yet</h5>
                    <p className={`mb-0 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                      Start the conversation by sending a message
                    </p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`d-flex mb-3 ${
                          message.sender === user.id ? 'justify-content-end' : 'justify-content-start'
                        }`}
                      >
                        <div className="d-flex align-items-start">
                          {message.sender !== user.id && (
                            <img
                              src={selectedChat.profileImage || 'https://via.placeholder.com/40'}
                              alt="Profile"
                              className="rounded-circle me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          )}
                          <div className="d-flex flex-column">
                            {message.type === 'product' ? (
                              <Card
                                className={`mb-2 ${
                                  theme === 'dark' ? 'bg-dark text-light border-secondary' : ''
                                }`}
                                style={{ maxWidth: '300px' }}
                              >
                                <div style={{ 
                                  position: 'relative',
                                  paddingTop: '100%',
                                  overflow: 'hidden'
                                }}>
                                  <Card.Img
                                    variant="top"
                                    src={message.content.image}
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                </div>
                                <Card.Body>
                                  <Card.Title className="h6">{message.content.name}</Card.Title>
                                  <Card.Text className="text-primary">
                                    ₹{Math.round(message.content.price * 20)}
                                  </Card.Text>
                                  <div className="d-flex gap-2">
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() => addToCart(message.content)}
                                      className="flex-grow-1"
                                    >
                                      <i className="bi bi-cart-plus me-2"></i>
                                      Add to Cart
                                    </Button>
                                    <Button
                                      variant={chatWishlist.some(item => item.id === message.content.id) ? "danger" : "outline-danger"}
                                      size="sm"
                                      onClick={() => {
                                        const isInChatWishlist = chatWishlist.some(item => item.id === message.content.id);
                                        if (isInChatWishlist) {
                                          handleRemoveFromChatWishlist(message.content.id);
                                        } else {
                                          handleAddToChatWishlist(message.content);
                                        }
                                      }}
                                      className="d-flex align-items-center"
                                    >
                                      <i className={`bi bi-heart${chatWishlist.some(item => item.id === message.content.id) ? '-fill' : ''} me-2`}></i>
                                      {chatWishlist.some(item => item.id === message.content.id) ? 'Remove' : 'Add to Chat Wishlist'}
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Card>
                            ) : (
                              <div
                                className={`p-3 rounded ${
                                  message.sender === user.id
                                    ? theme === 'dark'
                                      ? 'bg-primary text-white'
                                      : 'bg-primary text-white'
                                    : theme === 'dark'
                                    ? 'bg-secondary text-white'
                                    : 'bg-light text-dark'
                                }`}
                              >
                                {message.content}
                              </div>
                            )}
                            <small className={`text-muted mt-1 ${message.sender === user.id ? 'text-end' : ''}`}>
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </small>
                          </div>
                          {message.sender === user.id && (
                            <img
                              src={user.profileImage || 'https://via.placeholder.com/40'}
                              alt="Profile"
                              className="rounded-circle ms-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-3 border-top" style={{ 
                backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                flexShrink: 0
              }}>
                <Form onSubmit={handleSendMessage} className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  />
                  <Button type="submit" variant="primary">
                    <i className="bi bi-send"></i>
                  </Button>
                </Form>
              </div>
            </>
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <i className="bi bi-chat-square-dots fs-1 text-muted mb-3 d-block"></i>
                <p className={`text-center mb-0 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                  Select a chat to start messaging
                </p>
              </div>
            </div>
          )}
        </Col>
      </Row>

      {/* Chat Wishlist Modal */}
      <Modal
        show={showWishlistModal}
        onHide={() => setShowWishlistModal(false)}
        centered
        size="lg"
        className={theme === 'dark' ? 'dark-modal' : ''}
      >
        <Modal.Header className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}>
          <Modal.Title>Chat Wishlist</Modal.Title>
          <Button 
            variant="link" 
            className="text-decoration-none" 
            onClick={() => setShowWishlistModal(false)}
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        </Modal.Header>
        <Modal.Body className={theme === 'dark' ? 'bg-dark text-light' : ''}>
          {chatWishlist.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-heart fs-1 text-muted mb-3 d-block"></i>
              <h5 className={theme === 'dark' ? 'text-light' : ''}>No Items in Chat Wishlist</h5>
              <p className={`mb-0 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                Items added to chat wishlist will appear here
              </p>
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {chatWishlist.map(product => (
                <Col key={product.id}>
                  <Card 
                    className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                    style={{ cursor: 'default' }}
                  >
                    <Card.Img
                      variant="top"
                      src={product.image}
                      style={{ height: '200px', objectFit: 'cover' }}
                      onClick={() => handleProductClick(product.id)}
                      className="cursor-pointer"
                    />
                    <Card.Body className="p-3">
                      <Card.Title className="h6 mb-2 text-truncate">{product.name}</Card.Title>
                      <Card.Text className="text-primary mb-3">
                        ₹{Math.round(product.price * 20)}
                      </Card.Text>
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromChatWishlist(product.id);
                          }}
                          style={{ minWidth: 'auto', flex: '0 0 auto' }}
                          className="d-inline-flex align-items-center"
                        >
                          <i className="bi bi-trash me-2"></i>
                          Remove
                        </Button>
                        <Button
                          variant={isInWishlist(product.id) ? "outline-danger" : "outline-primary"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            isInWishlist(product.id) 
                              ? handleRemoveFromWishlist(product.id)
                              : handleAddToWishlist(product);
                          }}
                          style={{ minWidth: 'auto', flex: '0 0 auto' }}
                          className="d-inline-flex align-items-center"
                        >
                          <i className={`bi bi-heart${isInWishlist(product.id) ? '-fill' : ''} me-2`}></i>
                          {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product.id);
                          }}
                          style={{ minWidth: 'auto', flex: '0 0 auto' }}
                          className="d-inline-flex align-items-center"
                        >
                          <i className="bi bi-box-arrow-up-right me-2"></i>
                          View
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Create a shareable message
                            const shareMessage = {
                              id: Date.now(),
                              sender: user.id,
                              content: product,
                              type: 'product',
                              timestamp: new Date().toISOString(),
                            };
                            // Add to messages
                            const updatedMessages = [...messages, shareMessage];
                            setMessages(updatedMessages);
                            // Save to localStorage
                            const chatId = `chat_${Math.min(user.id, selectedChat.id)}_${Math.max(user.id, selectedChat.id)}`;
                            localStorage.setItem(chatId, JSON.stringify(updatedMessages));
                          }}
                          style={{ minWidth: 'auto', flex: '0 0 auto' }}
                          className="d-inline-flex align-items-center"
                        >
                          <i className="bi bi-share me-2"></i>
                          Share
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Chat; 