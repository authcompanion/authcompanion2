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
    <!-- Profile Form -->
    <div class="page page-center flex-grow-1">
      <div class="container py-2 container-tight">
        <div class="card card-md">
          <div class="card-body">
            <h2 class="mb-4 text-center h2">Update account</h2>
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
                  <span class="text-center flex-grow-1">Update account</span>
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

        <div class="mt-3 text-center text-secondary">
          Done? Navigate back to <router-link to="/">Home Page</router-link>
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";

const components = {
  ErrorAlert,
};
const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const showError = ref(false);
const errorTitle = ref("");
const errorDetail = ref("");

const token = computed(() => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("token") || localStorage.getItem("ACCESS_TOKEN");
});

const isSuccess = computed(() => errorTitle.value === "Success");
const isError = computed(() => errorTitle.value === "Error");

onMounted(() => {
  try {
    const decoded = jwtDecode(token.value);
    email.value = decoded.email;
    name.value = decoded.name;
  } catch (error) {
    console.error("Token decoding failed:", error);
    router.push("/login");
  }
});

const updateUser = async () => {
  return await fetch("/v1/auth/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
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
    const responseData = await response.json();

    if (response.ok) {
      localStorage.setItem("ACCESS_TOKEN", responseData.data.attributes.access_token);
      showError.value = true;
      errorTitle.value = "Success";
      errorDetail.value = "Your account has been updated, thank you!";
    } else if (response.status === 401) {
      const refreshResponse = await fetch("/v1/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (refreshResponse.ok) {
        const refreshBody = await refreshResponse.json();
        localStorage.setItem("ACCESS_TOKEN", refreshBody.data.attributes.access_token);
        const updatedResponse = await updateUser();

        if (updatedResponse.ok) {
          showError.value = true;
          errorTitle.value = "Success";
          errorDetail.value = "Your account has been updated, thank you!";
        }
      }
    } else {
      throw new Error("Failed to update user");
    }
  } catch (error) {
    console.error(error);
    showError.value = true;
    errorTitle.value = "Error";
    errorDetail.value = "An issue occurred, please try again";
  }
};
</script>

<style></style>
