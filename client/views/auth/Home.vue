<template>
  <div class="page-body">
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

    <!-- Error Alert -->
    <ErrorAlert :show="showError" :title="errorTitle" :detail="errorDetail" class="alert-container" />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import ErrorAlert from "../../components/ErrorAlert.vue";

export default {
  components: {
    ErrorAlert,
  },
  setup() {
    const showError = ref(false);
    const errorTitle = ref(null);
    const errorDetail = ref(null);
    const jwt = ref(window.localStorage.getItem("ACCESS_TOKEN") || "");

    const jwtDebugUrl = computed(() => {
      return jwt.value ? `https://jwt.io/#debugger-io?token=${jwt.value}` : "";
    });

    if (!jwt.value) {
      showError.value = true;
      errorTitle.value = "Error";
      errorDetail.value = "Please try logging in again at /login";
    }

    return {
      showError,
      errorTitle,
      errorDetail,
      jwtDebugUrl,
    };
  },
};
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
  bottom: 20px;
  right: 20px;
  max-width: 400px;
  z-index: 1000;
}
</style>
