<template>
  <div class="page">
    <!-- Navbar -->
    <header class="navbar navbar-expand-md d-print-none">
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
              <p class="dropdown-item" @click="logout()">Logout</p>
            </div>
          </div>
        </div>
        <div class="collapse navbar-collapse" id="navbar-menu">
          <div class="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
            <ul class="navbar-nav">
              <li class="nav-item active">
                <a class="nav-link" href="/admin">
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
              <AdminTable
                :users="users"
                :page-size="pageSize"
                :page-number="pageNumber"
                :search-value="searchValue"
                @page-size-change="handlePageSizeInputChange"
                @search-input="handleSearchInput"
                @search="searchUser"
                @edit-user="toggleEditPanel"
                @delete-user="deleteUserRecord"
                @previous-page="previousPage"
                @next-page="nextPage"
                :format-date="formatDate"
              />
            </div>
          </div>
        </div>
      </div>

      <footer class="footer footer-transparent position-fixed bottom-0 w-100 d-print-none">
        <div class="container-xl">
          <div class="flex-row-reverse text-center row align-items-center">
            <div class="col-lg-auto ms-lg-auto">
              <ul class="mb-0 list-inline list-inline-dots">
                <li class="list-inline-item">
                  <a
                    href="https://github.com/authcompanion/authcompanion2/blob/main/CHANGELOG.md"
                    class="link-secondary"
                    rel="noopener"
                    target="_blank"
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
                  Copyright &copy; 2025
                  <a href="" class="link-secondary">AuthCompanion</a>. All rights reserved.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <!-- User Modal Component -->
    <UserModal
      :show-edit-panel="showEditPanel"
      :user-record="userRecord"
      :confirm-password="confirmPassword"
      @update:user-record="(val) => (userRecord = val)"
      @update:confirm-password="(val) => (confirmPassword = val)"
      @submit="showEditPanel ? updateUserRecord() : createUserRecord()"
    />

    <!-- Notification Alert -->
    <ErrorAlert
      :show="showNotification"
      :type="notificationType"
      :title="notificationTitle"
      :detail="notificationMessage"
      @close="showNotification = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import * as jose from "jose";
import UserModal from "../../components/admin/UserModal.vue";
import AdminTable from "../../components/admin/AdminTable.vue";
import ErrorAlert from "../../components/ErrorAlert.vue"; // Updated import

// Utility: Format ISO date string to human-readable
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Reactive state
const adminEmail = ref("");
const users = reactive({ data: [] });
const showEditPanel = ref(false);
const searchValue = ref("");
const selectedUser = reactive({});
const confirmPassword = ref("");
const pageSize = ref(10);
const pageNumber = ref(1);

// Notification system
const showNotification = ref(false);
const notificationType = ref("success");
const notificationTitle = ref("");
const notificationMessage = ref("");

const userRecord = ref({
  data: {
    type: "users",
    attributes: {},
  },
});

// Initialize from JWT
const token = localStorage.getItem("ACCESS_TOKEN");
if (token) {
  const claims = jose.decodeJwt(token);
  adminEmail.value = claims.email;
}

// Notification handler
const showNotificationMessage = (message, type = "success", title = "") => {
  notificationType.value = type;
  notificationTitle.value = title || `${type.charAt(0).toUpperCase() + type.slice(1)}`;
  notificationMessage.value = message;
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 3600);
};

// Existing methods with updated notifications
const toggleEditPanel = (user) => {
  Object.assign(selectedUser, user);
  userRecord.value.data.attributes = { ...user.attributes };
  showEditPanel.value = true;
};

const toggleCreatePanel = () => {
  showEditPanel.value = false;
  userRecord.value.data.attributes = {};
  confirmPassword.value = "";
};

// API methods with updated notifications
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
    showNotificationMessage(e.message, "danger", "Fetch Error");
  }
};

const updateUserRecord = async () => {
  try {
    const attributes = userRecord.value.data.attributes;

    if (attributes.password && attributes.password !== confirmPassword.value) {
      showNotificationMessage("Passwords do not match!", "warning", "Validation Error");
      return;
    }

    if (!attributes.password) {
      delete attributes.password;
    }

    const response = await fetch(`/v1/admin/users/${selectedUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userRecord.value),
    });

    if (!response.ok) throw new Error("Update failed");
    showNotificationMessage("User updated successfully!", "success");
    fetchUsers();
  } catch (e) {
    showNotificationMessage(e.message, "danger", "Update Error");
  }
};

const createUserRecord = async () => {
  try {
    const attributes = userRecord.value.data.attributes;

    if (attributes.password !== confirmPassword.value) {
      showNotificationMessage("Passwords do not match!", "warning", "Validation Error");
      return;
    }

    if (!attributes.name || !attributes.email) {
      showNotificationMessage("Name and Email are required fields", "warning", "Validation Error");
      return;
    }

    const response = await fetch(`/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userRecord.value),
    });

    if (!response.ok) throw new Error("Create failed");
    showNotificationMessage("User created successfully!", "success");
    fetchUsers();
  } catch (e) {
    showNotificationMessage(e.message, "danger", "Creation Error");
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
    showNotificationMessage("User deleted successfully!", "success");
    fetchUsers();
  } catch (e) {
    showNotificationMessage(e.message, "danger", "Deletion Error");
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
    showNotificationMessage(`Found ${users.data.length} users`, "info", "Search Results");
  } catch (e) {
    showNotificationMessage(e.message, "danger", "Search Error");
  }
};

// Pagination and search handlers remain the same
const handleSearchInput = (value) => {
  searchValue.value = value;
  if (value.trim() === "") fetchUsers();
};

const handlePageSizeInputChange = (newSize) => {
  pageSize.value = Number(newSize);
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
    showNotificationMessage("Logout failed", "danger", "Logout Error");
  }
};

onMounted(fetchUsers);
</script>
<style></style>
