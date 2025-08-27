import React, { useState } from 'react';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: [],
    knownLanguages: []
  });
  const [loading, setLoading] = useState(false);

  const availableInterests = [
    'Programming', 'Web Development', 'Data Science', 'Machine Learning',
    'Design', 'Marketing', 'Business', 'Photography', 'Music', 'Art',
    'Mobile Development', 'DevOps', 'Cybersecurity', 'Game Development'
  ];

  const availableLanguages = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js',
    'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go', 'Rust', 'C#', 'TypeScript'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        interests: formData.interests,
        knownLanguages: formData.knownLanguages
      };
      await onRegister(registerData);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join our learning community</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create password (min 6 chars)"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Interests (Optional)</label>
            <div className="multi-select">
              {availableInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  className={`tag-button ${formData.interests.includes(interest) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect('interests', interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Known Programming Languages (Optional)</label>
            <div className="multi-select">
              {availableLanguages.map(language => (
                <button
                  key={language}
                  type="button"
                  className={`tag-button ${formData.knownLanguages.includes(language) ? 'selected' : ''}`}
                  onClick={() => handleMultiSelect('knownLanguages', language)}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button 
              type="button"
              className="link-button"
              onClick={onSwitchToLogin}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;