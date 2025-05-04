<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Error Alert -->
    <ErrorAlert
      :show="showError"
      :type="errorType"
      :title="errorTitle"
      :detail="errorDetail"
      class="alert-container"
      @close="showError = false"
    />

    <!-- Login Form -->
    <div class="page page-center flex-grow-1">
      <div class="container py-2 container-tight">
        <div class="card card-md">
          <div class="card-body">
            <h2 class="mb-4 text-center h2">Login to your Admin Panel</h2>
            <form @submit.prevent="submit" autocomplete="off" novalidate>
              <div class="mb-3">
                <label class="form-label">Email address</label>
                <input
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="your@email.com"
                  autocomplete="off"
                />
              </div>
              <div class="mb-2">
                <label class="form-label">Password</label>
                <div class="input-group input-group-flat">
                  <input
                    v-model="password"
                    type="password"
                    class="form-control"
                    placeholder="Your password"
                    autocomplete="off"
                  />
                  <span class="input-group-text">
                    <a
                      href="#"
                      class="link-secondary"
                      data-bs-toggle="tooltip"
                      aria-label="Show password"
                      data-bs-original-title="Show password"
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
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                        <path
                          d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
                        ></path>
                      </svg>
                    </a>
                  </span>
                </div>
              </div>

              <div class="form-footer">
                <button type="submit" class="btn btn-primary d-flex justify-content-center align-items-center w-100">
                  <span class="text-center flex-grow-1">Sign in</span>
                  <span class="ms-auto">
                    <svg
                      width="16"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="fixed inset-x-0 bottom-0">
      <div class="m-4 text-xs text-gray-400">
        Powered by
        <span class="underline">
          <a href="https://github.com/authcompanion/authcompanion2">AuthCompanion</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ErrorAlert from "../../components/ErrorAlert.vue";

const router = useRouter();
const email = ref("");
const password = ref("");

// Error handling
const showError = ref(false);
const errorType = ref("danger");
const errorTitle = ref("");
const errorDetail = ref("");

const handleError = (title, message, type = "danger") => {
  errorType.value = type;
  errorTitle.value = title;
  errorDetail.value = message;
  showError.value = true;
};

const submit = async () => {
  try {
    const response = await fetch("/v1/admin/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "users",
          attributes: {
            email: email.value,
            password: password.value,
          },
        },
      }),
    });

    const resBody = await response.json().catch(() => ({}));

    if (response.ok) {
      localStorage.setItem("ACCESS_TOKEN", resBody.data?.attributes?.access_token);
      router.push("/admin");
    } else {
      handleError(
        resBody.errors?.[0]?.title || "Authentication Failed",
        resBody.errors?.[0]?.detail || "Invalid admin credentials",
        "danger"
      );
    }
  } catch (error) {
    console.error("Admin login error:", error);
    handleError(
      "Connection Error",
      "Unable to connect to the admin server. Please check your network connection.",
      "danger"
    );
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
</style>
