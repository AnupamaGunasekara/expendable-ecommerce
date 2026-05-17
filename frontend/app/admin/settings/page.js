'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    type: 'text'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5030/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch settings');

      const data = await response.json();
      console.log('Settings data:', data);
      // Backend returns array directly
      setSettings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSetting = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5030/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add setting');
      }

      toast.success('Setting added successfully');
      setShowAddModal(false);
      setFormData({ key: '', value: '', type: 'text' });
      fetchSettings();
    } catch (error) {
      console.error('Error adding setting:', error);
      toast.error(error.message);
    }
  };

  const handleEditSetting = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5030/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          key: currentSetting.key,
          value: formData.value,
          type: currentSetting.type
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update setting');
      }

      toast.success('Setting updated successfully');
      setShowEditModal(false);
      setCurrentSetting(null);
      setFormData({ key: '', value: '', type: 'text' });
      fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error(error.message);
    }
  };

  const handleDeleteSetting = async (id) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;

    try {
      const response = await fetch(`http://localhost:5030/api/admin/settings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete setting');
      }

      toast.success('Setting deleted successfully');
      fetchSettings();
    } catch (error) {
      console.error('Error deleting setting:', error);
      toast.error(error.message);
    }
  };

  const openEditModal = (setting) => {
    setCurrentSetting(setting);
    let displayValue = setting.value;
    
    // Parse JSON string for display
    if (setting.type === 'json' && typeof setting.value === 'string') {
      try {
        displayValue = JSON.stringify(JSON.parse(setting.value), null, 2);
      } catch (e) {
        displayValue = setting.value;
      }
    } else if (typeof setting.value === 'object') {
      displayValue = JSON.stringify(setting.value, null, 2);
    } else {
      displayValue = String(setting.value);
    }
    
    setFormData({
      key: setting.key,
      value: displayValue,
      type: setting.type
    });
    setShowEditModal(true);
  };

  const formatValue = (value, type) => {
    if (type === 'json') {
      try {
        const jsonValue = typeof value === 'string' ? JSON.parse(value) : value;
        return <pre className="text-xs bg-gray-100 p-2 rounded max-w-md overflow-auto">{JSON.stringify(jsonValue, null, 2)}</pre>;
      } catch (e) {
        return <pre className="text-xs bg-gray-100 p-2 rounded max-w-md overflow-auto">{String(value)}</pre>;
      }
    }
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Add New Setting
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {settings.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  No settings found. Click "Add New Setting" to create one.
                </td>
              </tr>
            ) : (
              settings.map((setting) => (
                <tr key={setting.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {setting.key}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatValue(setting.value, setting.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {setting.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(setting)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSetting(setting.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Setting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Setting</h2>
            <form onSubmit={handleAddSetting}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Key</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Value</label>
                {formData.type === 'json' ? (
                  <textarea
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full border rounded px-3 py-2 font-mono text-sm"
                    rows="6"
                    placeholder='{"key": "value"}'
                    required
                  />
                ) : formData.type === 'boolean' ? (
                  <select
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  <input
                    type={formData.type === 'number' ? 'number' : 'text'}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ key: '', value: '', type: 'text' });
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Add Setting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Setting Modal */}
      {showEditModal && currentSetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Setting</h2>
            <form onSubmit={handleEditSetting}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Key</label>
                <input
                  type="text"
                  value={currentSetting.key}
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Type</label>
                <input
                  type="text"
                  value={currentSetting.type}
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Value</label>
                {currentSetting.type === 'json' ? (
                  <textarea
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full border rounded px-3 py-2 font-mono text-sm"
                    rows="6"
                    required
                  />
                ) : currentSetting.type === 'boolean' ? (
                  <select
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  <input
                    type={currentSetting.type === 'number' ? 'number' : 'text'}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setCurrentSetting(null);
                    setFormData({ key: '', value: '', type: 'text' });
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Update Setting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
