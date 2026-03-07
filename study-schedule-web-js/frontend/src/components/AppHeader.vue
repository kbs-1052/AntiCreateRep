<script setup>
import { ref } from 'vue'

defineProps({
  todayAchievement: Number
})

const emit = defineEmits(['search'])
const searchQuery = ref('')

const onSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<template>
  <header class="app-header">
    <div class="search-container">
      <div class="search-icon" @click="onSearch">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
      <input 
        type="text" 
        placeholder="과목, 계획, 메모 검색..." 
        class="search-input" 
        v-model="searchQuery"
        @keyup.enter="onSearch"
      />
    </div>

    <div class="header-actions">
      <div class="stats-summary" v-if="todayAchievement !== undefined">
        <span class="text-xs text-muted">오늘의 성취도:</span>
        <span class="text-sm font-bold text-primary">{{ todayAchievement.toFixed(1) }}%</span>
      </div>
      <button class="btn btn-export">
        <span>CSV 내보내기</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  margin-bottom: 2rem;
}

.search-container {
  position: relative;
  width: 400px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
}

.search-input {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  border: none;
  background: transparent;
  border-bottom: 2px solid #e5e7eb;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: var(--primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stats-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-export {
  background: white;
  border: 1px solid #e5e7eb;
  color: var(--text-muted);
}

.btn-export:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: var(--text-main);
}
</style>
