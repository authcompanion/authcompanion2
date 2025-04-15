<template>
  <div class="d-flex flex-column flex-grow-1">
    <!-- Error Alert -->
    <ErrorAlert :show="showError" :title="errorTitle" :detail="errorDetail" class="alert-container" />

    <!-- Login Form -->
    <div class="page page-center flex-grow-1">
      <div class="container py-2 container-tight">
        <div class="card card-md">
          <div class="card-body">
            <h2 class="mb-4 text-center h2">Login to your account</h2>
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
                <label class="form-label">
                  Password
                  <span class="form-label-description">
                    <a href="/v1/web/recovery">I forgot password</a>
                  </span>
                </label>
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
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
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
          Don't have account yet? <a href="#" @click.prevent="createAccount" tabindex="-1">Sign up</a>
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

const components = {
  ErrorAlert,
};
const router = useRouter();
const email = ref("");
const password = ref("");
const showError = ref(false);
const errorTitle = ref("");
const errorDetail = ref("");

const submit = async () => {
  try {
    const response = await fetch("/v1/auth/login", {
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

    const appOrigin = response.headers.get("x-authc-app-origin");
    const resBody = await response.json();

    if (response.ok) {
      localStorage.setItem("ACCESS_TOKEN", resBody.data.attributes.access_token);
      window.location.href = appOrigin;
    } else {
      showError.value = true;
      errorTitle.value = "Error";
      errorDetail.value = "Login failed, please check your credentials and try again.";
    }
  } catch (error) {
    console.log(error);
    showError.value = true;
    errorTitle.value = "Error";
    errorDetail.value = "There was an issue connecting, please refresh your browser and try again.";
  }
};

const passkeySubmit = async () => {
  try {
    const optionsResponse = await fetch("/v1/auth/login-options", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (optionsResponse.ok) {
      const opts = await optionsResponse.json();
      const attResp = await startAuthentication(opts);

      const verificationResponse = await fetch("/v1/auth/login-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-authc-app-challenge": opts.challenge,
        },
        body: JSON.stringify(attResp),
      });

      const reply = await verificationResponse.json();
      const appOrigin = verificationResponse.headers.get("x-authc-app-origin");

      localStorage.setItem("ACCESS_TOKEN", reply.data.attributes.access_token);
      showError.value = false;
      window.location.href = appOrigin;
    } else {
      showError.value = true;
      errorTitle.value = "Error";
      errorDetail.value = "There was an issue logging in, please try again";
    }
  } catch (error) {
    console.log(error);
    showError.value = true;
    errorTitle.value = "Error";
    errorDetail.value = "There was an issue connecting, please refresh your browser and try again.";
  }
};

const createAccount = () => {
  router.push("/register");
};
</script>

<style></style>
