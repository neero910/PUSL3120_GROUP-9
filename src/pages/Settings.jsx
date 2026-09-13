import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin@safron.com',
    phone: '+1 234 567 8900'
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    emailNotifications: true,
    smsNotifications: false,
    language: 'English'
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleToggleChange = (setting) => {
    setPreferences({ ...preferences, [setting]: !preferences[setting] });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate save
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and system configurations</p>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <button 
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i>👤</i> Profile Info
          </button>
          <button 
            className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <i>⚙️</i> Preferences
          </button>
          <button 
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i>🔔</i> Notifications
          </button>
          <button 
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <i>🔒</i> Security
          </button>
        </div>

        <div className="settings-panel">
          {activeTab === 'profile' && (
            <form onSubmit={handleSave}>
              <h2>Profile Information</h2>
              <div className="settings-form-group">
                <label>First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  className="settings-input" 
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="settings-form-group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  className="settings-input" 
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="settings-form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="settings-input" 
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="settings-form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  className="settings-input" 
                  value={profileData.phone}
                  onChange={handleProfileChange}
                />
              </div>
              <button type="submit" className="settings-btn-primary">Save Changes</button>
            </form>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h2>System Preferences</h2>
              
              <div className="settings-toggle-group">
                <div className="settings-toggle-info">
                  <h3>Dark Mode</h3>
                  <p>Toggle dark mode for the application interface</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={preferences.darkMode}
                    onChange={() => handleToggleChange('darkMode')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-form-group" style={{ marginTop: '24px' }}>
                <label>System Language</label>
                <select 
                  className="settings-input"
                  value={preferences.language}
                  onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2>Notification Settings</h2>
              
              <div className="settings-toggle-group">
                <div className="settings-toggle-info">
                  <h3>Email Notifications</h3>
                  <p>Receive daily summary reports and important alerts via email</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={preferences.emailNotifications}
                    onChange={() => handleToggleChange('emailNotifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-toggle-group">
                <div className="settings-toggle-info">
                  <h3>SMS Alerts</h3>
                  <p>Receive immediate text messages for urgent system events</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={preferences.smsNotifications}
                    onChange={() => handleToggleChange('smsNotifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSave}>
              <h2>Security Settings</h2>
              <div className="settings-form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  className="settings-input" 
                  placeholder="Enter current password"
                />
              </div>
              <div className="settings-form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  className="settings-input" 
                  placeholder="Enter new password"
                />
              </div>
              <div className="settings-form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  className="settings-input" 
                  placeholder="Confirm new password"
                />
              </div>
              <button type="submit" className="settings-btn-primary">Update Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
