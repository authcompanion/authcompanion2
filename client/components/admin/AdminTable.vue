<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Accounts</h3>
    </div>
    <div class="py-3 card-body border-bottom">
      <div class="d-flex">
        <div class="text-muted">
          Show
          <div class="mx-2 d-inline-block">
            <select
              :value="pageSize"
              @change="$emit('page-size-change', $event.target.value)"
              class="form-select form-select-sm"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </div>
          entries
        </div>
        <div class="ms-auto text-muted">
          Search:
          <div class="ms-2 d-inline-block">
            <input
              placeholder="User Email"
              :value="searchValue"
              @input="$emit('search-input', $event.target.value)"
              @keyup.enter="$emit('search')"
              type="text"
              class="form-control form-control-sm"
              aria-label="Search users"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-cloak class="table-responsive">
      <table class="table table-vcenter card-table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Admin</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th class="w-1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users.data" :key="user.id">
            <td>{{ user.id }}</td>
            <td class="text-muted">{{ user.attributes.name }}</td>
            <td class="text-muted">{{ user.attributes.email }}</td>
            <td class="text-muted">{{ user.attributes.active == 1 ? "Active" : "Inactive" }}</td>
            <td class="text-muted">{{ user.attributes.isAdmin == 1 ? "Yes" : "No" }}</td>
            <td class="text-muted">
              {{
                formatDate
                  ? formatDate(user.attributes.created_at || user.attributes.created)
                  : user.attributes.created_at || user.attributes.created
              }}
            </td>
            <td class="text-muted">
              {{
                formatDate
                  ? formatDate(user.attributes.updated_at || user.attributes.updated)
                  : user.attributes.updated_at || user.attributes.updated
              }}
            </td>
            <td class="text-muted">
              <a href="#" data-bs-toggle="modal" data-bs-target="#modal-user" @click="$emit('edit-user', user)">
                Edit
              </a>
              <a href="#" class="mx-2" @click.stop="$emit('delete-user', user.id)"> Delete </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="card-footer d-flex align-items-center">
      <ul class="m-0 pagination ms-auto">
        <li class="page-item">
          <a class="page-link" href="#" tabindex="-1" @click="$emit('previous-page')">
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
              <path d="M15 6l-6 6l6 6" />
            </svg>
            prev
          </a>
        </li>
        <input class="w-4 mx-2 form-control form-control-sm" type="text" :value="pageNumber" readonly />
        <li class="page-item">
          <a class="page-link" href="#" @click="$emit('next-page')">
            next
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
              <path d="M9 6l6 6l-6 6" />
            </svg>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  users: {
    type: Object,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  pageNumber: {
    type: Number,
    default: 1,
  },
  searchValue: {
    type: String,
    default: "",
  },
  formatDate: {
    type: Function,
    default: null,
  },
});

defineEmits(["page-size-change", "search-input", "search", "edit-user", "delete-user", "previous-page", "next-page"]);
</script>
