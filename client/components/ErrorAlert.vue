<template>
  <transition name="alert-slide">
    <div v-if="show" role="alert" aria-live="assertive" class="alert-container">
      <div class="alert alert-danger d-flex align-items-start" role="alert">
        <div class="alert-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-alert-circle"
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
            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>
        <div class="flex-grow-1">
          <h4 class="alert-heading mb-1">{{ title }}</h4>
          <div class="alert-description">{{ detail }}</div>
        </div>
        <button type="button" class="btn-close ms-auto" aria-label="Close" @click="$emit('close')">
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
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </transition>
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
      default: "Something went wrong",
    },
    detail: {
      type: String,
      default: "",
    },
  },
  emits: ["close"],
};
</script>

<style scoped>
.alert-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  max-width: min(400px, 95vw);
  animation: alert-entry 0.3s ease-out;
}

.alert {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 72, 72, 0.25);
}

.alert-icon {
  margin-right: 0.75rem;
  margin-top: 0.125rem;
}

.btn-close {
  color: inherit;
  opacity: 0.75;
  padding: 0.25rem;
  margin-left: 1rem;
}

.btn-close:hover {
  opacity: 1;
}

.alert-slide-enter-active,
.alert-slide-leave-active {
  transition: all 0.3s ease;
}

.alert-slide-enter-from,
.alert-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.alert-slide-enter-to,
.alert-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
