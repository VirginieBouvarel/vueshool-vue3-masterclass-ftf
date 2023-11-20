<template>
  <header class="header" id="header">
    <router-link :to="{ name: 'Home' }" class="logo">
      <img
        src="../assets/svg/vueschool-logo.svg"
        alt="Vueschool Logo"
        width="50"
        height="50"
      />
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar">
      <ul>
        <li v-if="authUser" class="navbar-user">
          <a
            @click.prevent="userDropdownOpen = !userDropdownOpen"
            v-click-outside="() => (userDropdownOpen = false)"
          >
            <img
              v-show="authUser.avatar"
              class="avatar-small"
              :src="authUser.avatar"
              :alt="`${authUser.name} profile picture`"
              width="30"
              height="30"
            />
            <span>
              {{ authUser.name }}
              <img
                class="icon-profile"
                src="../assets/svg/arrow-profile.svg"
                alt="chevron-down"
                width="15"
                height="15"
              />
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{ 'active-drop': userDropdownOpen }">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <router-link :to="{ name: 'Profile' }"> Profile </router-link>
              </li>
              <li class="dropdown-menu-item">
                <router-link :to="{ name: 'SignOut' }"> Sign Out </router-link>
              </li>
            </ul>
          </div>
        </li>
        <li v-if="!authUser" class="navbar-item">
          <router-link :to="{ name: 'SignIn' }">Sign In</router-link>
        </li>
        <li v-if="!authUser" class="navbar-item">
          <router-link :to="{ name: 'Register' }">Register</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import { storeToRefs } from "pinia";

const { authUser } = storeToRefs(useAuthStore());

const userDropdownOpen = ref(false);
</script>
