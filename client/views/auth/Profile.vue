<template>
  <div class="d-flex flex-column min-vh-100">
    <ErrorAlert
      :show="showError"
      :type="errorType"
      :title="errorTitle"
      :detail="errorDetail"
      class="alert-container"
      @close="showError = false"
    />

    <div class="page page-center flex-grow-1">
      <div class="container py-2 container-tight">
        <div class="card card-md">
          <div class="card-body">
            <h2 class="mb-4 text-center h2">Update account</h2>
            <form @submit.prevent="submit" autocomplete="off" novalidate>
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="name" type="text" class="form-control" placeholder="Enter name" />
              </div>
              <div class="mb-3">
                <label class="form-label">Email address</label>
                <input
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="your@email.com"
                  :readonly="isRecoveryToken"
                />
              </div>
              <div class="mb-2">
                <label class="form-label">Password</label>
                <div class="input-group input-group-flat">
                  <input v-model="password" type="password" class="form-control" placeholder="New password" required />
                  <span class="input-group-text">
                    <a href="#" class="link-secondary" title="Show password">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24">
                        <!-- Eye icon SVG -->
                      </svg>
                    </a>
                  </span>
                </div>
              </div>

              <div class="form-footer">
                <button type="submit" class="btn btn-primary w-100">
                  {{ isRecoveryToken ? "Reset Password" : "Update Account" }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="mt-3 text-center text-secondary">
          <router-link to="/">Back to Home</router-link>
        </div>
      </div>
    </div>

    <div class="fixed inset-x-0 bottom-0">
      <div class="m-4 text-xs text-gray-400">
        Powered by <a href="https://github.com/authcompanion/authcompanion2">AuthCompanion</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import ErrorAlert from "../../components/ErrorAlert.vue";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const isRecoveryToken = ref(false);

// Error handling
const showError = ref(false);
const errorType = ref("danger");
const errorTitle = ref("");
const errorDetail = ref("");

const token = ref(null);

const handleError = (title, message, type = "danger") => {
  errorType.value = type;
  errorTitle.value = title;
  errorDetail.value = message;
  showError.value = true;
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get("token");

  if (urlToken) {
    token.value = urlToken;
    isRecoveryToken.value = true;
    window.history.replaceState({}, document.title, window.location.pathname);
  } else {
    token.value = localStorage.getItem("ACCESS_TOKEN");
  }

  try {
    const decoded = jwtDecode(token.value);
    email.value = decoded.email;
    name.value = decoded.name || "";

    if (isRecoveryToken.value && decoded.recoveryToken !== "true") {
      throw new Error("Invalid recovery token");
    }
  } catch (error) {
    handleError("Session Expired", "Please login again", "warning");
    setTimeout(() => router.push("/login"), 2000);
  }
});

const updateUser = async () => {
  const url = isRecoveryToken.value ? `/v1/auth/profile?token=${encodeURIComponent(token.value)}` : "/v1/auth/profile";

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(!isRecoveryToken.value && { Authorization: `Bearer ${token.value}` }),
    },
    body: JSON.stringify({
      data: {
        type: "users",
        attributes: {
          name: name.value,
          email: email.value,
          password: password.value,
        },
      },
    }),
  });
};

const submit = async () => {
  try {
    const response = await updateUser();
    const responseData = await response.json().catch(() => ({}));

    if (response.ok) {
      if (isRecoveryToken.value) {
        handleError("Success", "Password updated! Redirecting to login...", "success");
        localStorage.removeItem("ACCESS_TOKEN");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        localStorage.setItem("ACCESS_TOKEN", responseData.data?.attributes?.access_token || token.value);
        handleError("Success", "Account updated successfully!", "success");
        password.value = "";
      }
    } else if (response.status === 401 && !isRecoveryToken.value) {
      // Handle token refresh for regular users
      const refreshResponse = await fetch("/v1/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const refreshData = await refreshResponse.json();

      if (refreshResponse.ok) {
        localStorage.setItem("ACCESS_TOKEN", refreshData.data?.attributes?.access_token);
        const updatedResponse = await updateUser();

        if (updatedResponse.ok) {
          handleError("Success", "Account updated successfully!", "success");
          password.value = "";
        } else {
          throw new Error("Failed to update after refresh");
        }
      } else {
        throw new Error("Session expired. Please login again");
      }
    } else {
      throw new Error(responseData.error?.message || "Failed to update profile");
    }
  } catch (error) {
    handleError("Update Failed", error.message);
  }
};
</script>

<style>
.alert-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  max-width: min(400px, 95vw);
}

/* Keep existing styles */
</style>
