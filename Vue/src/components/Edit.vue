<template>
  <div class="form-container">
    <h1>Edit Team Member</h1>
    <form @submit.prevent="submitForm">
      <!-- Form Fields -->
      <div class="form-group">
        <input v-model="formData.first_name" placeholder="First Name" required />
        <span v-if="errors.first_name" class="error-message">{{ errors.first_name }}</span>
      </div>
      <div class="form-group">
        <input v-model="formData.last_name" placeholder="Last Name" required />
        <span v-if="errors.last_name" class="error-message">{{ errors.last_name }}</span>
      </div>
      <div class="form-group">
        <input v-model="formData.phone" placeholder="Phone" required />
        <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
      </div>
      <div class="form-group">
        <input v-model="formData.email" placeholder="Email" required />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>
      <div class="form-group">
        <select v-model="formData.role">
          <option value="regular">Regular</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" class="submit-btn">Save</button>
      <button type="button" @click="deleteMember" class="delete-btn">Delete</button>
    </form>

    <!-- Error Dialog -->
    <ErrorDialog
      :visible="isErrorVisible"
      :message="errorMessage"
      @close="closeErrorDialog"
    />
  </div>
</template>

<script>
import axios from 'axios';
import ErrorDialog from './ErrorDialog.vue';

export default {
  components: {
    ErrorDialog,
  },
  data() {
    return {
      formData: {
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        role: 'regular',
      },
      errors: {}, // Holds validation errors
      isErrorVisible: false,
      errorMessage: '',
    };
  },
  async mounted() {
      // Fetch the team member data when the component is mounted
    const memberId = this.$route.params.id;
    const response = await axios.get(`http://localhost:8000/api/team-members/${memberId}/`);
    this.formData = response.data;
  },
  methods: {
    closeDialog() {
      this.isErrorVisible = false;
      this.errorMessage = '';
    },
    async submitForm() {
      this.errors = {}; // Clear previous errors
      try {
        const memberId = this.$route.params.id;
        const response = await axios.put(`http://localhost:8000/api/team-members/${memberId}/`, this.formData);
        this.$router.push('/'); // Redirect to the list page on success
      } catch (error) {
        if (error.response && error.response.data) {
          // Handle validation errors
          this.errors = error.response.data;
        } else {
          // Handle other errors
          this.isErrorVisible = true;
          this.errorMessage = 'An unknown error occurred. Please try again.';
        }
      }
    },
    async deleteMember() {
  if (!this.formData?.id) {
    alert('Team member data is not loaded. Please try again.');
    return;
  }

  if (confirm('Are you sure you want to delete this team member?')) {
    try {
      await axios.delete(`http://localhost:8000/api/team-members/${this.formData.id}/`);
      alert('Team member deleted successfully!');
      this.$router.push('/'); // Redirect to the team members list
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Failed to delete team member.');
    }
  }
},
  },
};
</script>

<style scoped>
.form-container {
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

input,
select {
  width: 100%;
  padding: 0.8rem;
  margin: 0.4rem 0;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button.submit-btn {
  width: 100%;
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

button.submit-btn:hover {
  background-color: #45a049;
}

button.delete-btn {
  width: 100%;
  padding: 1rem;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

button.delete-btn:hover {
  background-color: #cc0000;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.2rem;
  display: block;
}
</style>
