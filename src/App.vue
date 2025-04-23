<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Barra de navegación -->
    <header class="bg-white shadow-sm">
      <div class="container auto px-6 py-4 flex justify-between items-center max-w-full">
        <div class="flex items-center space-x-4">
          <RouterLink to="/" class="text-xl font-bold text-black"> Stock Insights </RouterLink>
        </div>

        <nav class="flex space-x-6 gap-4">
          <RouterLink to="/" class="text-black hover:text-emerald-600 font-medium mx-4">
            Dashboard
          </RouterLink>
          <RouterLink to="/stocks" class="text-black hover:text-emerald-600 font-medium mx-4">
            Stocks
          </RouterLink>
          <RouterLink
            to="/recommendations"
            class="text-black hover:text-emerald-600 font-medium mx-4"
          >
            Recommendations
          </RouterLink>
          <RouterLink to="/about" class="text-black hover:text-emerald-600 font-medium mx-4">
            About
          </RouterLink>
        </nav>
      </div>
    </header>

    <!-- Contenido principal -->
    <RouterView />
  </div>
</template>
