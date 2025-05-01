<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Error Alert -->
    <ErrorAlert
      :show="showError"
      :title="errorTitle"
      :detail="errorDetail"
      class="alert-container"
      @close="showError = false"
    />
    <!-- Recovery Form -->
    <div class="page page-center flex-grow-1">
      <div class="container py-4 container-tight">
        <form class="card card-md" @submit.prevent="submit" autocomplete="off" novalidate>
          <div class="card-body">
            <h2 class="mb-4 text-center card-title">Forgot password</h2>
            <p class="mb-4 text-secondary">Enter your email address and a reset link will be emailed to you.</p>

            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input v-model="email" type="email" class="form-control" placeholder="Enter email" required />
            </div>

            <div class="form-footer">
              <button type="submit" class="btn btn-primary w-100">
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
                  <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>
                  <path d="M3 7l9 6l9 -6"></path>
                </svg>
                Send me login link
              </button>
            </div>
          </div>
        </form>

        <div class="mt-3 text-center text-secondary">
          It's ok, <router-link to="/login">send me back</router-link> to the sign in screen.
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
import ErrorAlert from "../../components/ErrorAlert.vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
const components = {
  ErrorAlert,
};

const router = useRouter();
const email = ref("");
const showError = ref(false);
const errorTitle = ref("");
const errorDetail = ref("");

const isSuccess = computed(() => errorTitle.value === "Success");
const isError = computed(() => errorTitle.value === "Error");

const submit = async () => {
  try {
    if (!email.value) {
      showError.value = true;
      errorTitle.value = "Error";
      errorDetail.value = "Please enter an email address";
      return;
    }

    const response = await fetch("/v1/auth/recovery", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value }),
    });

    if (response.ok) {
      errorTitle.value = "Success";
      errorDetail.value = "A recovery email has been sent to the address provided";
      showError.value = true;
      email.value = "";
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send recovery email");
    }
  } catch (error) {
    console.error(error);
    showError.value = true;
    errorTitle.value = "Error";
    errorDetail.value = error.message || "There was an issue with the request. Please try again later.";
  }
};
</script>

<style></style>
