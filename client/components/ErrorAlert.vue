<template>
  <transition name="alert-slide">
    <div v-if="show" role="alert" aria-live="assertive" class="alert-container">
      <div :class="['alert', `alert-${type}`, 'd-flex align-items-start']" role="alert">
        <div class="alert-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon alert-icon"
          >
            <!-- Success Icon -->
            <path v-if="type === 'success'" d="M5 12l5 5l10 -10" />
            <!-- Info Icon -->
            <template v-if="type === 'info'">
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M12 9h.01" />
              <path d="M11 12h1v4h1" />
            </template>
            <!-- Warning Icon -->
            <template v-if="type === 'warning'">
              <path d="M12 9v4" />
              <path
                d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z"
              />
              <path d="M12 16h.01" />
            </template>
            <!-- Danger Icon -->
            <template v-if="type === 'danger'">
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </template>
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
    type: {
      type: String,
      default: "success",
      validator: (value) => ["success", "info", "warning", "danger"].includes(value),
    },
    title: {
      type: String,
      default: "",
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
}

.alert {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;
  display: flex;
  align-items: start;
}

.alert-success {
  background-color: #f8fff9;
  border-color: #2fb344;
}

.alert-info {
  background-color: #f8f9ff;
  border-color: #467fcf;
}

.alert-warning {
  background-color: #fffce5;
  border-color: #f59f00;
}

.alert-danger {
  background-color: #fff5f6;
  border-color: #e55353;
}

.alert-icon {
  margin-right: 0.75rem;
  margin-top: 0.125rem;
}

.alert-heading {
  font-size: 1rem;
  font-weight: 600;
}

.alert-description {
  font-size: 0.875rem;
  color: #495057;
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
