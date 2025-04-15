<template>
  <div class="page">
    <!-- Navbar -->
    <header class="navbar navbar-expand-md d-print-none">
      <!-- Keep existing navbar structure -->
      <div class="container-xl">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-menu"
          aria-controls="navbar-menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
          <a href=""> AuthCompanion </a>
        </h1>
        <div class="flex-row navbar-nav order-md-last">
          <div class="d-none d-md-flex">
            <!-- Theme toggler and notifications -->
          </div>
          <div class="nav-item dropdown">
            <a
              href="#"
              class="p-0 nav-link d-flex lh-1 text-reset"
              data-bs-toggle="dropdown"
              aria-label="Open user menu"
            >
              <span class="text-white avatar avatar-sm bg-dark">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-3 h-3"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </span>
              <div class="d-none d-xl-block ps-2">
                <div v-cloak>{{ adminEmail }}</div>
                <div class="mt-1 small text-muted">Admin</div>
              </div>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <p class="dropdown-item" @click="logout()">logout</p>
            </div>
          </div>
        </div>
        <div class="collapse navbar-collapse" id="navbar-menu">
          <div class="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
            <ul class="navbar-nav">
              <li class="nav-item active">
                <a class="nav-link" href="/v1/admin/dashboard">
                  <span class="nav-link-icon d-md-none d-lg-inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                    </svg>
                  </span>
                  <span class="nav-link-title"> Home </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <div class="page-wrapper">
      <div class="page-header d-print-none">
        <div class="container-xl">
          <div class="row g-2 align-items-center">
            <div class="col">
              <div class="page-pretitle">Admin Panel</div>
              <h2 class="page-title">User Management</h2>
            </div>
            <div class="col-auto ms-auto d-print-none">
              <div class="btn-list">
                <a
                  href="#"
                  class="btn btn-primary d-none d-sm-inline-block"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-user"
                  @click="toggleCreatePanel()"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 5l0 14" />
                    <path d="M5 12l14 0" />
                  </svg>
                  Create user
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="page-body">
        <div class="container-xl">
          <div class="row row-deck row-cards">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Accounts</h3>
                </div>
                <div class="py-3 card-body border-bottom">
                  <div class="d-flex">
                    <div class="text-muted">
                      Show
                      <div class="mx-2 d-inline-block">
                        <select
                          v-model="pageSize"
                          @change="handlePageSizeInputChange()"
                          class="form-select form-select-sm"
                        >
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="30">30</option>
                        </select>
                      </div>
                      entries
                    </div>
                    <div class="ms-auto text-muted">
                      Search:
                      <div class="ms-2 d-inline-block">
                        <input
                          placeholder="User Email"
                          v-model="searchValue"
                          @keyup.enter="searchUser()"
                          @input="handleSearchInputChange()"
                          type="text"
                          class="form-control form-control-sm"
                          aria-label="Search users"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div v-cloak class="table-responsive">
                  <table class="table table-vcenter card-table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Admin</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th class="w-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(user, index) in users.data" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td class="text-muted">{{ user.attributes.name }}</td>
                        <td class="text-muted">{{ user.attributes.email }}</td>
                        <td class="text-muted">{{ user.attributes.active == 1 ? "Active" : "Inactive" }}</td>
                        <td class="text-muted">{{ user.attributes.isAdmin == 1 ? "Yes" : "No" }}</td>
                        <td class="text-muted">{{ user.attributes.created }}</td>
                        <td class="text-muted">{{ user.attributes.updated }}</td>
                        <td class="text-muted">
                          <a data-bs-toggle="modal" data-bs-target="#modal-user" href="#" @click="toggleEditPanel(user)"
                            >Edit</a
                          >
                          <a href="#" class="mx-2" @click.stop="deleteUserRecord(user.id)">Delete</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="card-footer d-flex align-items-center">
                  <ul class="m-0 pagination ms-auto">
                    <li class="page-item">
                      <a class="page-link" href="#" tabindex="-1" @click="previousPage">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M15 6l-6 6l6 6" />
                        </svg>
                        prev
                      </a>
                    </li>
                    <input class="w-4 mx-2 form-control form-control-sm" type="text" v-model="pageNumber" readonly />
                    <li class="page-item">
                      <a class="page-link" href="#" @click="nextPage">
                        next
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M9 6l6 6l-6 6" />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="footer footer-transparent d-print-none">
        <div class="container-xl">
          <div class="flex-row-reverse text-center row align-items-center">
            <div class="col-lg-auto ms-lg-auto">
              <ul class="mb-0 list-inline list-inline-dots">
                <li class="list-inline-item">
                  <a
                    href="https://github.com/authcompanion/authcompanion2/blob/main/CHANGELOG.md"
                    class="link-secondary"
                    rel="noopener"
                  >
                    Changelog
                  </a>
                </li>
                <li class="list-inline-item">
                  <a href="https://docs.authcompanion.com/" target="_blank" class="link-secondary" rel="noopener"
                    >Documentation</a
                  >
                </li>
                <li class="list-inline-item">
                  <a href="https://hachyderm.io/@paulfish" target="_blank" class="link-secondary" rel="noopener">
                    Made by Paul Fish
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon text-pink icon-filled icon-inline"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
            <div class="mt-3 col-12 col-lg-auto mt-lg-0">
              <ul class="mb-0 list-inline list-inline-dots">
                <li class="list-inline-item">
                  Copyright &copy; 2023
                  <a href="" class="link-secondary">AuthCompanion</a>. All rights reserved.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <!-- User Modal -->
    <div class="modal modal-blur fade" id="modal-user" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ showEditPanel ? "Edit User" : "Create User" }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-6">
                <div class="mb-3">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control" v-model="userRecord.data.attributes.name" required />
                </div>
              </div>
              <div class="col-lg-6">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="userRecord.data.attributes.email" required />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-6">
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="userRecord.data.attributes.password"
                    :required="!showEditPanel"
                  />
                  <small v-if="showEditPanel" class="text-muted">Leave blank to keep current password</small>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="mb-3">
                  <label class="form-label">Confirm Password</label>
                  <input type="password" class="form-control" v-model="confirmPassword" :required="!showEditPanel" />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-6">
                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <select class="form-select" v-model="userRecord.data.attributes.active">
                    <option :value="1">Active</option>
                    <option :value="0">Inactive</option>
                  </select>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="mb-3">
                  <label class="form-label">Admin Privileges</label>
                  <select class="form-select" v-model="userRecord.data.attributes.isAdmin">
                    <option :value="1">Yes</option>
                    <option :value="0">No</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-12">
                <div class="mb-3">
                  <label class="form-label">Metadata (JSON format)</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    v-model="metadataJson"
                    placeholder='{"department": "engineering", "custom_field": "value"}'
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-12">
                <div class="mb-3">
                  <label class="form-label">App Data (JSON format)</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    v-model="appdataJson"
                    placeholder='{"preferences": {"theme": "dark"}}'
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <a href="#" class="btn btn-link link-secondary" data-bs-dismiss="modal"> Cancel </a>
            <a
              href="#"
              class="btn btn-primary ms-auto"
              @click.prevent="showEditPanel ? updateUserRecord() : createUserRecord()"
            >
              {{ showEditPanel ? "Update User" : "Create User" }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Alert -->
    <div v-cloak v-if="showNotification" class="top-0 p-3 position-fixed end-0">
      <div
        :class="['bg-white', 'alert', isError ? 'alert-danger' : 'alert-success', 'alert-dismissible', 'fade', 'show']"
        role="alert"
      >
        <strong>{{ isError ? "Error: " : "Success: " }} </strong>{{ notificationMessage }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import * as jose from "jose";

// Reactive state
const adminEmail = ref("");
const users = reactive({ data: [] });
const showEditPanel = ref(false);
const showNotification = ref(false);
const notificationMessage = ref("");
const searchValue = ref("");
const selectedUser = reactive({});
const confirmPassword = ref("");
const pageSize = ref(10);
const pageNumber = ref(1);
const isError = ref(false);
const refForm = ref(null);

// User record structure
const userRecord = reactive({
  data: {
    type: "users",
    attributes: {},
  },
});

// Computed properties for JSON fields
const metadataJson = computed({
  get() {
    return JSON.stringify(userRecord.data.attributes.metadata || {}, null, 2);
  },
  set(newValue) {
    try {
      userRecord.data.attributes.metadata = JSON.parse(newValue);
    } catch (e) {
      showNotificationMessage("Invalid JSON format for Metadata", true);
    }
  },
});

const appdataJson = computed({
  get() {
    return JSON.stringify(userRecord.data.attributes.appdata || {}, null, 2);
  },
  set(newValue) {
    try {
      userRecord.data.attributes.appdata = JSON.parse(newValue);
    } catch (e) {
      showNotificationMessage("Invalid JSON format for App Data", true);
    }
  },
});

// Initialize from JWT
const token = localStorage.getItem("ACCESS_TOKEN");
if (token) {
  const claims = jose.decodeJwt(token);
  adminEmail.value = claims.email;
}

// Methods
const resetForm = () => refForm.value?.reset();

const showNotificationMessage = (message, error = false) => {
  notificationMessage.value = message;
  isError.value = error;
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
    isError.value = false;
  }, 3600);
};

const toggleEditPanel = (user) => {
  resetForm();
  Object.assign(selectedUser, user);
  Object.assign(userRecord.data.attributes, user.attributes);
  showEditPanel.value = true;
};

const toggleCreatePanel = () => {
  resetForm();
  showEditPanel.value = false;
  userRecord.data.attributes = {};
  confirmPassword.value = "";
};

// API methods
const fetchUsers = async () => {
  try {
    const url = `/v1/admin/users?page[number]=${pageNumber.value}&page[size]=${pageSize.value}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    users.data = data.data;
  } catch (e) {
    showNotificationMessage(e.message, true);
  }
};

const updateUserRecord = async () => {
  try {
    if (userRecord.data.attributes.password && userRecord.data.attributes.password !== confirmPassword.value) {
      showNotificationMessage("Passwords do not match!", true);
      return;
    }

    // Remove password if empty in edit mode
    if (!userRecord.data.attributes.password) {
      delete userRecord.data.attributes.password;
    }

    const response = await fetch(`/v1/admin/users/${selectedUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userRecord),
    });

    if (!response.ok) throw new Error("Update failed");
    showNotificationMessage("User updated successfully!");
    fetchUsers();
  } catch (e) {
    showNotificationMessage(e.message, true);
  }
};

const createUserRecord = async () => {
  try {
    if (userRecord.data.attributes.password !== confirmPassword.value) {
      showNotificationMessage("Passwords do not match!", true);
      return;
    }

    if (!userRecord.data.attributes.name || !userRecord.data.attributes.email) {
      showNotificationMessage("Name and Email are required fields", true);
      return;
    }

    const response = await fetch(`/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userRecord),
    });

    if (!response.ok) throw new Error("Create failed");
    showNotificationMessage("User created successfully!");
    fetchUsers();
  } catch (e) {
    showNotificationMessage(e.message, true);
  }
};

const deleteUserRecord = async (userId) => {
  if (!window.confirm("Are you sure?")) return;

  try {
    const response = await fetch(`/v1/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Delete failed");
    showNotificationMessage("User deleted successfully!");
    fetchUsers();
  } catch (e) {
    showNotificationMessage(e.message, true);
  }
};

const searchUser = async () => {
  try {
    const response = await fetch(
      `/v1/admin/users?search[email]=${searchValue.value}&page[size]=${pageSize.value}&page[number]=${pageNumber.value}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) throw new Error("Search failed");
    const data = await response.json();
    users.data = data.data;
    showNotificationMessage(`Found ${users.data.length} users`);
  } catch (e) {
    showNotificationMessage(e.message, true);
  }
};

const handleSearchInputChange = () => {
  if (searchValue.value.trim() === "") fetchUsers();
};

const handlePageSizeInputChange = () => {
  pageNumber.value = 1;
  searchValue.value ? searchUser() : fetchUsers();
};

const nextPage = () => {
  pageNumber.value++;
  searchValue.value ? searchUser() : fetchUsers();
};

const previousPage = () => {
  if (pageNumber.value > 1) {
    pageNumber.value--;
    searchValue.value ? searchUser() : fetchUsers();
  }
};

const logout = async () => {
  try {
    await fetch(`/v1/admin/logout`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem("ACCESS_TOKEN");
    window.location.href = "/admin/login";
  } catch (e) {
    showNotificationMessage("Logout failed", true);
  }
};

onMounted(fetchUsers);
</script>

<style></style>
