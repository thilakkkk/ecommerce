import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image, Nav, Tab, Badge, Button, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import FriendManager from '../components/FriendManager';
import { Link } from 'react-router-dom';

const Profile = ({ theme }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [friends, setFriends] = useState([]);

  // Load friends from localStorage
  useEffect(() => {
    if (user) {
      const userFriends = JSON.parse(localStorage.getItem(`friends_${user.id}`) || '[]');
      setFriends(userFriends);
    }
  }, [user]);

  // Orders data
  const orders = {
    completed: [
      { id: 1, date: '2024-03-15', items: ['Product 1', 'Product 2'], status: 'Delivered', total: 150 },
      { id: 2, date: '2024-03-10', items: ['Product 3'], status: 'Delivered', total: 75 },
    ],
    pending: [
      { id: 3, date: '2024-03-20', items: ['Product 4', 'Product 5'], status: 'Processing', total: 200 },
      { id: 4, date: '2024-03-18', items: ['Product 6'], status: 'Shipped', total: 90 },
    ]
  };

  return (
    <Container fluid className="py-4">
      {/* Profile Header */}
      <Row className="mb-4">
        <Col>
          <Card className={`border-0 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
            <Card.Body>
              <div className="d-flex align-items-center">
                <Image
                  src={user?.profileImage || 'https://via.placeholder.com/150'}
                  roundedCircle
                  width={120}
                  height={120}
                  className="border border-primary border-3"
                  style={{ objectFit: 'cover' }}
                />
                <div className="ms-4">
                  <h2 className="mb-1">{user?.name}</h2>
                  <p className={`mb-2 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                    @{user?.username}
                  </p>
                  <div className="d-flex justify-content-end mb-3">
                    <Link to="/edit-profile" className="btn btn-primary">
                      <i className="bi bi-pencil-square me-2"></i>
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Friend Manager */}
      <Row className="mb-4">
        <Col>
          <FriendManager theme={theme} />
        </Col>
      </Row>

      {/* Profile Content */}
      <Row>
        <Col>
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Card className={theme === 'dark' ? 'bg-dark text-light' : ''}>
              <Card.Header className="bg-transparent">
                <Nav variant="tabs" className="border-bottom-0">
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="overview" 
                      className={`${theme === 'dark' ? 'text-light' : ''} ${activeTab === 'overview' ? 'active' : ''}`}
                    >
                      Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="friends" 
                      className={`${theme === 'dark' ? 'text-light' : ''} ${activeTab === 'friends' ? 'active' : ''}`}
                    >
                      Friends
                      {friends.length > 0 && (
                        <Badge bg="primary" className="ms-2">
                          {friends.length}
                        </Badge>
                      )}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      eventKey="orders" 
                      className={`${theme === 'dark' ? 'text-light' : ''} ${activeTab === 'orders' ? 'active' : ''}`}
                    >
                      Orders
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>

              <Card.Body>
                <Tab.Content>
                  {/* Overview Tab */}
                  <Tab.Pane eventKey="overview">
                    <Row>
                      <Col md={8}>
                        <h5 className="mb-3">Recent Orders</h5>
                        <ListGroup variant={theme === 'dark' ? 'dark' : ''}>
                          {orders.pending.map(order => (
                            <ListGroup.Item 
                              key={order.id}
                              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <p className="mb-1">Order #{order.id}</p>
                                  <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                                    {order.date} - {order.items.join(', ')}
                                  </small>
                                </div>
                                <div className="text-end">
                                  <Badge bg={order.status === 'Processing' ? 'warning' : 'info'}>
                                    {order.status}
                                  </Badge>
                                  <p className="mb-0 mt-1">${order.total}</p>
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Col>
                      <Col md={4}>
                        <h5 className="mb-3">Friends ({friends.length})</h5>
                        {friends.length === 0 ? (
                          <Card className={`text-center ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
                            <Card.Body>
                              <i className="bi bi-people fs-1 text-muted mb-2 d-block"></i>
                              <p className="mb-0">No friends yet</p>
                              <small className={`${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                                Use the search bar above to find friends
                              </small>
                            </Card.Body>
                          </Card>
                        ) : (
                          <ListGroup variant={theme === 'dark' ? 'dark' : ''}>
                            {friends.slice(0, 3).map(friend => (
                              <ListGroup.Item 
                                key={friend.id}
                                className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                              >
                                <div className="d-flex align-items-center">
                                  <Image
                                    src={friend.profileImage || 'https://via.placeholder.com/40'}
                                    roundedCircle
                                    width={40}
                                    height={40}
                                    style={{ objectFit: 'cover' }}
                                  />
                                  <div className="ms-3">
                                    <p className="mb-0">{friend.name}</p>
                                    <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                                      @{friend.username}
                                    </small>
                                  </div>
                                </div>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </Col>
                    </Row>
                  </Tab.Pane>

                  {/* Friends Tab */}
                  <Tab.Pane eventKey="friends">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">Friends List</h5>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => {
                          // Clear all friend-related data from localStorage
                          if (user) {
                            localStorage.removeItem(`friends_${user.id}`);
                            localStorage.removeItem(`friendRequests_${user.id}`);
                            localStorage.removeItem(`pendingRequests_${user.id}`);
                            // Clear friends state
                            setFriends([]);
                          }
                        }}
                      >
                        Clear Friends Data
                      </Button>
                    </div>
                    {friends.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-people fs-1 text-muted mb-3 d-block"></i>
                        <h5 className={theme === 'dark' ? 'text-light' : ''}>No Friends Yet</h5>
                        <p className={`mb-4 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                          Start connecting with other users by using the search bar above
                        </p>
                        <Button 
                          variant="primary" 
                          onClick={() => document.querySelector('input[placeholder="Search users..."]').focus()}
                        >
                          Find Friends
                        </Button>
                      </div>
                    ) : (
                      <Row xs={1} md={2} lg={3} className="g-4">
                        {friends.map(friend => (
                          <Col key={friend.id}>
                            <Card className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}>
                              <Card.Body>
                                <div className="d-flex align-items-center">
                                  <div className="position-relative">
                                    <Image
                                      src={friend.profileImage || 'https://via.placeholder.com/60'}
                                      roundedCircle
                                      width={60}
                                      height={60}
                                      style={{ objectFit: 'cover' }}
                                    />
                                  </div>
                                  <div className="ms-3">
                                    <h6 className="mb-1">{friend.name}</h6>
                                    <p className={`mb-0 small ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                                      @{friend.username}
                                    </p>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Tab.Pane>

                  {/* Orders Tab */}
                  <Tab.Pane eventKey="orders">
                    <Row>
                      <Col>
                        <h5 className="mb-3">Pending Orders</h5>
                        <ListGroup variant={theme === 'dark' ? 'dark' : ''}>
                          {orders.pending.map(order => (
                            <ListGroup.Item 
                              key={order.id}
                              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <p className="mb-1">Order #{order.id}</p>
                                  <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                                    {order.date} - {order.items.join(', ')}
                                  </small>
                                </div>
                                <div className="text-end">
                                  <Badge bg={order.status === 'Processing' ? 'warning' : 'info'}>
                                    {order.status}
                                  </Badge>
                                  <p className="mb-0 mt-1">${order.total}</p>
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>

                        <h5 className="mb-3 mt-4">Completed Orders</h5>
                        <ListGroup variant={theme === 'dark' ? 'dark' : ''}>
                          {orders.completed.map(order => (
                            <ListGroup.Item 
                              key={order.id}
                              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <p className="mb-1">Order #{order.id}</p>
                                  <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                                    {order.date} - {order.items.join(', ')}
                                  </small>
                                </div>
                                <div className="text-end">
                                  <Badge bg="success">
                                    {order.status}
                                  </Badge>
                                  <p className="mb-0 mt-1">${order.total}</p>
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Col>
                    </Row>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 