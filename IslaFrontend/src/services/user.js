import api from './api';

const userService = {
  // Address management
  async getAddresses() {
    try {
      console.log('🔄 Getting addresses...');
      const response = await api.get('/user/addresses');
      console.log('✅ Addresses response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get addresses error:', error);
      throw error;
    }
  },

  async addAddress(addressData) {
    try {
      console.log('🔄 Adding address:', addressData);
      const response = await api.post('/user/addresses', addressData);
      console.log('✅ Add address response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Add address error:', error);
      throw error;
    }
  },

  async updateAddress(addressData) {
    try {
      console.log('🔄 Updating address:', addressData);
      const response = await api.put('/user/addresses', addressData);
      console.log('✅ Update address response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update address error:', error);
      throw error;
    }
  },

  async deleteAddress(addressId) {
    try {
      console.log('🔄 Deleting address:', addressId);
      const response = await api.delete('/user/addresses', { 
        data: { id: addressId } 
      });
      console.log('✅ Delete address response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Delete address error:', error);
      throw error;
    }
  },

  async setDefaultAddress(addressId) {
    try {
      console.log('🔄 Setting default address:', addressId);
      const response = await api.post('/user/addresses/default', { 
        id: addressId 
      });
      console.log('✅ Set default address response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Set default address error:', error);
      throw error;
    }
  },

  // Profile management
  async updateProfile(profileData) {
    try {
      console.log('🔄 Updating profile:', profileData);
      const response = await api.put('/user/profile', profileData);
      console.log('✅ Update profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw error;
    }
  },

  async changePassword(passwordData) {
    try {
      console.log('🔄 Changing password');
      const response = await api.post('/user/change-password', passwordData);
      console.log('✅ Change password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Change password error:', error);
      throw error;
    }
  }
};

export default userService;