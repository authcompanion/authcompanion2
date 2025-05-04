<template>
  <div class="page-body">
    <!-- Error Alert -->
    <ErrorAlert
      :show="showError"
      :type="errorType"
      :title="errorTitle"
      :detail="errorDetail"
      class="alert-container"
      @close="showError = false"
    />

    <div class="container-xl">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-xl-9">
          <div class="card card-lg">
            <div class="card-body markdown">
              <h1>Success 🎉🎉 !</h1>
              <p class="py-1 text-black">
                Hey, nice job getting started with AuthCompanion. You made it to the home page.
              </p>

              <p class="py-1 text-black">
                When you're ready, tell AuthC to redirect users (after successful login) to your application's home and
                page ditch this one.
              </p>

              <p class="py-1 text-black">
                For a full guide on how to integrate and launch AuthCompanion, check those sections in the docs:
                <a class="text-blue-600 underline hover:text-blue-800" href="https://docs.authcompanion.com/">
                  https://docs.authcompanion.com/
                </a>
              </p>

              <p class="py-1 text-black">
                After a successful login or account registration, AuthC provides developers a user's access token which
                is used for managing your user's session. The access token contains helpful information about the user
                for all sorts of uses.
                <a class="text-blue-600 underline hover:text-blue-800" :href="jwtDebugUrl">
                  Decode the token's payload here to find out.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ErrorAlert from "../../components/ErrorAlert.vue";

// Error handling
const showError = ref(false);
const errorType = ref("warning");
const errorTitle = ref("");
const errorDetail = ref("");

const jwt = ref(localStorage.getItem("ACCESS_TOKEN") || "");
const jwtDebugUrl = computed(() => (jwt.value ? `https://jwt.io/#debugger-io?token=${jwt.value}` : ""));

const handleError = (title, message, type = "warning") => {
  errorType.value = type;
  errorTitle.value = title;
  errorDetail.value = message;
  showError.value = true;
};

onMounted(() => {
  if (!jwt.value) {
    handleError("Session Required", "Please login to access this page", "warning");
  }
});
</script>

<style>
html {
  font-family: "Inter var", sans-serif;
}

[v-cloak] {
  display: none;
}

.alert-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  max-width: min(400px, 95vw);
  z-index: 1000;
}

.text-blue-600 {
  color: #2563eb;
}

.hover\:text-blue-800:hover {
  color: #1e40af;
}

.underline {
  text-decoration: underline;
}
</style>
