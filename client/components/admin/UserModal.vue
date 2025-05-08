<template>
  <div class="modal modal-blur fade" id="modal-user" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ showEditPanel ? "Edit User" : "Create User" }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-6">
              <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input
                  type="text"
                  class="form-control"
                  :value="userRecord.data.attributes.name"
                  @input="updateAttribute('name', $event.target.value)"
                  required
                />
              </div>
            </div>
            <div class="col-lg-6">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  :value="userRecord.data.attributes.email"
                  @input="updateAttribute('email', $event.target.value)"
                  required
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-6">
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  :value="userRecord.data.attributes.password"
                  @input="updateAttribute('password', $event.target.value)"
                  :required="!showEditPanel"
                />
                <small v-if="showEditPanel" class="text-muted">Leave blank to keep current password</small>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="mb-3">
                <label class="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control"
                  :value="confirmPassword"
                  @input="$emit('update:confirmPassword', $event.target.value)"
                  :required="!showEditPanel"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-6">
              <div class="mb-3">
                <label class="form-label">Status</label>
                <select
                  class="form-select"
                  :value="userRecord.data.attributes.active"
                  @change="updateAttribute('active', parseInt($event.target.value))"
                >
                  <option :value="1">Active</option>
                  <option :value="0">Inactive</option>
                </select>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="mb-3">
                <label class="form-label">Admin Privileges</label>
                <select
                  class="form-select"
                  :value="userRecord.data.attributes.isAdmin"
                  @change="updateAttribute('isAdmin', parseInt($event.target.value))"
                >
                  <option :value="1">Yes</option>
                  <option :value="0">No</option>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12">
              <div class="mb-3">
                <label class="form-label">Metadata (JSON format)</label>
                <textarea
                  class="form-control"
                  rows="3"
                  :value="metadataJson"
                  @input="updateMetadata($event.target.value)"
                  placeholder='{"department": "engineering", "custom_field": "value"}'
                ></textarea>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12">
              <div class="mb-3">
                <label class="form-label">App Data (JSON format)</label>
                <textarea
                  class="form-control"
                  rows="3"
                  :value="appdataJson"
                  @input="updateAppdata($event.target.value)"
                  placeholder='{"preferences": {"theme": "dark"}}'
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <a href="#" class="btn btn-link link-secondary" data-bs-dismiss="modal"> Cancel </a>
          <a href="#" class="btn btn-primary ms-auto" @click.prevent="$emit('submit')">
            {{ showEditPanel ? "Update User" : "Create User" }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  showEditPanel: Boolean,
  userRecord: Object,
  confirmPassword: String,
});

const emit = defineEmits(["update:userRecord", "update:confirmPassword", "submit"]);

const metadataJson = computed(() => {
  return JSON.stringify(props.userRecord.data.attributes.metadata || {}, null, 2);
});

const appdataJson = computed(() => {
  return JSON.stringify(props.userRecord.data.attributes.appdata || {}, null, 2);
});

const updateAttribute = (field, value) => {
  const updatedRecord = {
    ...props.userRecord,
    data: {
      ...props.userRecord.data,
      attributes: {
        ...props.userRecord.data.attributes,
        [field]: value,
      },
    },
  };
  emit("update:userRecord", updatedRecord);
};

const updateMetadata = (value) => {
  try {
    const parsed = JSON.parse(value);
    updateAttribute("metadata", parsed);
  } catch (e) {
    console.error("Invalid JSON format for Metadata");
  }
};

const updateAppdata = (value) => {
  try {
    const parsed = JSON.parse(value);
    updateAttribute("appdata", parsed);
  } catch (e) {
    console.error("Invalid JSON format for App Data");
  }
};
</script>
