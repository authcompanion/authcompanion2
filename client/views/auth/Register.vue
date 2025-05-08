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

    <!-- Registration Form -->
    <div class="page page-center flex-grow-1">
      <div class="container py-2 container-tight">
        <div class="card card-md">
          <div class="card-body">
            <h2 class="mb-4 text-center h2">Create new account</h2>
            <form @submit.prevent="submit" autocomplete="off" novalidate>
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="name" type="text" class="form-control" placeholder="Enter name" autocomplete="off" />
              </div>
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
                  <span class="text-center flex-grow-1">Create new account</span>
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

          <div class="hr-text">or</div>

          <div class="card-body">
            <button
              @click="passkeySubmit"
              class="btn btn-primary d-flex justify-content-center align-items-center w-100"
            >
              <span class="text-center flex-grow-1">Passkey</span>
              <span class="ms-auto">
                <svg
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <div class="mt-3 text-center text-secondary">
          Already have account? <router-link to="/login">Sign in</router-link>
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
import { startRegistration } from "@simplewebauthn/browser";
import ErrorAlert from "../../components/ErrorAlert.vue";

const router = useRouter();
const name = ref("");
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
    const response = await fetch("/v1/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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

    const appOrigin = response.headers.get("x-authc-app-origin");
    const resBody = await response.json();

    if (response.ok) {
      localStorage.setItem("ACCESS_TOKEN", resBody.data.attributes.access_token);
      window.location.href = appOrigin;
    } else {
      handleError("Registration Failed", resBody.error?.message || "Please check your registration details");
    }
  } catch (error) {
    console.error("Registration error:", error);
    handleError("Connection Error", "Unable to connect to the server. Please check your network connection.");
  }
};

const passkeySubmit = async () => {
  try {
    const userName = name.value;
    const userEmail = email.value;

    if (!userName || !userEmail) {
      handleError("Missing Information", "Please provide your name and email to use passkey registration", "warning");
      return;
    }

    const optionsResponse = await fetch("/v1/auth/registration-options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userName,
        email: userEmail,
      }),
    });

    if (!optionsResponse.ok) {
      handleError("Registration Error", "Failed to start passkey registration");
      return;
    }

    const opts = await optionsResponse.json();
    const attResp = await startRegistration(opts);

    const verificationResponse = await fetch("/v1/auth/registration-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-authc-app-userid": opts.user.id,
      },
      body: JSON.stringify(attResp),
    });

    if (!verificationResponse.ok) {
      handleError("Verification Failed", "Passkey registration failed. Please try again.");
      return;
    }

    const reply = await verificationResponse.json();
    const appOrigin = verificationResponse.headers.get("x-authc-app-origin");

    localStorage.setItem("ACCESS_TOKEN", reply.data.attributes.access_token);
    window.location.href = appOrigin;
  } catch (error) {
    console.error("Passkey registration error:", error);
    handleError("Registration Error", error.userVisibleMessage || "Passkey registration failed");
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
