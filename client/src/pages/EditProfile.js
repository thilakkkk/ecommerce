import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EditProfile = ({ theme }) => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/edit-profile' } });
      return;
    }

    // Load user data
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        setUsername(currentUser.username || '');
        setEmail(currentUser.email || '');
        setBio(currentUser.bio || '');
        setImagePreview(currentUser.profileImage || 'https://via.placeholder.com/150');
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data');
    }
  }, [isAuthenticated, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPEG, PNG, or GIF)');
        return;
      }

      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setError('Image size should be less than 50MB');
        return;
      }

      // Create a preview and update state
      const reader = new FileReader();
      reader.onloadstart = () => setUploadProgress(0);
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      };
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setProfileImage(file);
        setUploadProgress(100);
        setSuccess('Image uploaded successfully!');
      };
      reader.onerror = () => {
        setError('Error uploading image. Please try again.');
        setUploadProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Get current user data
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        throw new Error('No user data found');
      }

      // Create updated user object - only include essential fields to reduce storage size
      const updatedUser = {
        id: currentUser.id, // Ensure ID is preserved
        username: username || currentUser.username,
        email: email || currentUser.email,
        bio: bio.trim() || undefined, // Skip if empty
        profileImage: imagePreview || currentUser.profileImage
      };

      // Use the updateProfile function from AuthContext
      // which has been updated to handle localStorage safely
      if (typeof updateProfile === 'function') {
        const result = await updateProfile(updatedUser);
        if (result.success) {
          setSuccess('Profile updated successfully!');
          
          // Navigate after a short delay
          setTimeout(() => {
            navigate('/profile');
          }, 1500);
        }
      } else {
        throw new Error('Update profile function not available');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndClearAllData = () => {
    try {
      const keysToKeep = ['theme']; // Keep theme preference
      const allKeys = Object.keys(localStorage);
      
      // Clear all except theme
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      setSuccess('All user data has been cleared successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setError('Failed to clear data. Please try again.');
    }
  };

  return (
    <Container className="py-4" style={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#e6f3ff', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className={`${theme === 'dark' ? 'bg-dark text-light' : ''}`} 
                style={{ border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <Card.Body className="p-4">
              <h2 className="text-center mb-4" style={{ color: theme === 'dark' ? '#fff' : '#1e88e5' }}>
                Edit Profile
              </h2>
              
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </Alert>
              )}

              <div className="text-end mb-4">
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={verifyAndClearAllData}
                  className="me-2"
                >
                  <i className="bi bi-shield-check me-2"></i>
                  Verify & Clear All Data
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => {
                    const keys = Object.keys(localStorage);
                    setSuccess(keys.length === 0 ? 'No data in storage' : `Storage contains: ${keys.join(', ')}`);
                  }}
                >
                  <i className="bi bi-search me-2"></i>
                  Check Storage
                </Button>
              </div>

              <Form onSubmit={handleSubmit}>
                <div className="text-center mb-4">
                  <div 
                    className="position-relative d-inline-block"
                    style={{ cursor: 'pointer' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {loading && (
                      <div 
                        className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ 
                          backgroundColor: 'rgba(0,0,0,0.5)', 
                          borderRadius: '50%',
                          zIndex: 1 
                        }}
                      >
                        <Spinner animation="border" variant="light" />
                      </div>
                    )}
                    <img
                      src={imagePreview || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      className="rounded-circle"
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        border: `3px solid ${theme === 'dark' ? '#666' : '#1e88e5'}`,
                        transition: 'border-color 0.3s ease'
                      }}
                    />
                    <div
                      className="position-absolute bottom-0 end-0 p-2 bg-primary rounded-circle"
                      style={{ 
                        transform: 'translate(20%, 20%)',
                        transition: 'transform 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      <i className="bi bi-camera-fill text-white"></i>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageChange}
                  />
                  <small className={`d-block mt-2 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                    Click to change profile picture
                  </small>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                      <div className="progress" style={{ height: '4px' }}>
                        <div 
                          className="progress-bar" 
                          role="progressbar" 
                          style={{ width: `${uploadProgress}%` }}
                          aria-valuenow={uploadProgress} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    disabled
                    className={`${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    disabled
                    className={`${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className={`${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                    className="py-2"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'outline-light' : 'outline-primary'}
                    onClick={() => navigate('/profile')}
                    className="py-2"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile; 