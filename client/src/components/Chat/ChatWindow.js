import React, { useState } from 'react';
import { Card, Form, Button, Image } from 'react-bootstrap';
import ShareProduct from './ShareProduct';

const ChatWindow = ({ theme, selectedUser, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showShareProduct, setShowShareProduct] = useState(false);

  // Dummy products for demonstration
  const [products] = useState([
    {
      id: 1,
      name: "Nike Air Max",
      price: 129.99,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      name: "Adidas Ultraboost",
      price: 159.99,
      image: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      name: "Puma RS-X",
      price: 89.99,
      image: "https://via.placeholder.com/150"
    }
  ]);

  // Dummy messages for demonstration
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user1',
      text: 'Hey, check out this product!',
      timestamp: '10:30 AM',
      product: {
        id: 1,
        name: 'Nike Air Max',
        image: 'https://via.placeholder.com/100',
        price: '129.99'
      }
    },
    {
      id: 2,
      sender: 'user2',
      text: 'That looks great!',
      timestamp: '10:31 AM'
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user1',
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleShareProduct = (product) => {
    const newMessage = {
      id: messages.length + 1,
      sender: 'user1',
      text: 'Check out this product!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      product: {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price
      }
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <>
      <Card className={`h-100 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`}>
        {/* Chat Header */}
        <Card.Header className={`d-flex align-items-center ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light'}`}>
          <Image
            src={`https://ui-avatars.com/api/?name=${selectedUser?.name || 'User'}&background=random`}
            roundedCircle
            width={40}
            height={40}
            className="me-2"
          />
          <div>
            <h6 className="mb-0">{selectedUser?.name || 'Select a user'}</h6>
            <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
              {selectedUser?.status || 'Offline'}
            </small>
          </div>
        </Card.Header>

        {/* Messages Area */}
        <div 
          className="messages-area p-3" 
          style={{ 
            height: '400px', 
            overflowY: 'auto',
            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa'
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex mb-3 ${msg.sender === 'user1' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className={`message p-2 rounded-3 ${
                  msg.sender === 'user1'
                    ? theme === 'dark'
                      ? 'bg-primary text-white'
                      : 'bg-primary text-white'
                    : theme === 'dark'
                    ? 'bg-secondary'
                    : 'bg-light'
                }`}
                style={{ maxWidth: '75%' }}
              >
                {msg.product && (
                  <Card className={`mb-2 ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`} style={{ maxWidth: '200px' }}>
                    <Card.Img variant="top" src={msg.product.image} />
                    <Card.Body className="p-2">
                      <Card.Title className="h6">{msg.product.name}</Card.Title>
                      <Card.Text className="small">${msg.product.price}</Card.Text>
                    </Card.Body>
                  </Card>
                )}
                <div>{msg.text}</div>
                <small className={`d-block mt-1 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                  {msg.timestamp}
                </small>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <Card.Footer className={`p-2 ${theme === 'dark' ? 'bg-dark border-secondary' : 'bg-light'}`}>
          <Form onSubmit={handleSendMessage}>
            <div className="d-flex gap-2">
              <Button 
                variant={theme === 'dark' ? 'outline-light' : 'outline-secondary'}
                className="d-flex align-items-center"
                onClick={() => setShowShareProduct(true)}
              >
                <i className="bi bi-share"></i>
              </Button>
              <Form.Control
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
              />
              <Button type="submit" variant="primary" className="d-flex align-items-center">
                <i className="bi bi-send"></i>
              </Button>
            </div>
          </Form>
        </Card.Footer>
      </Card>

      {/* Share Product Modal */}
      <ShareProduct
        show={showShareProduct}
        onHide={() => setShowShareProduct(false)}
        products={products}
        onShareProduct={handleShareProduct}
        theme={theme}
      />
    </>
  );
};

export default ChatWindow; 