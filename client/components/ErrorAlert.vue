<template>
  <div v-if="show" role="alert">
    <div class="alert alert-danger" role="alert">
      <div class="d-flex">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon alert-icon"
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
            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
        </div>
        <div>
          <h4 class="alert-title">{{ title }}</h4>
          <div class="text-secondary">{{ detail }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Something went wrong:",
    },
    detail: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.alert-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}
</style>
