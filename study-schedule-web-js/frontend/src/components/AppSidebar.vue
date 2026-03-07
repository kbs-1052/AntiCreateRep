<script setup>
import { ref } from 'vue';
import SubjectManager from './SubjectManager.vue';

defineProps({
  activeTab: String
})

const emit = defineEmits(['update:activeTab', 'refresh'])
const isSubjectManagerOpen = ref(false);

const handleRefresh = () => {
  emit('refresh');
};
</script>

<template>
  <aside class="sidebar">
    <!-- ... existing logo ... -->
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
      </div>
      <span class="logo-text">StudyFlow</span>
    </div>

    <nav class="sidebar-nav">
      <a 
        class="sidebar-link" 
        :class="{ active: activeTab === 'dashboard' }"
        @click="$emit('update:activeTab', 'dashboard')"
      >
        <span class="icon">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </span>
        <span class="label">대시보드</span>
      </a>
      
      <a 
        class="sidebar-link" 
        :class="{ active: activeTab === 'history' }"
        @click="$emit('update:activeTab', 'history')"
      >
        <span class="icon">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
        </span>
        <span class="label">주별 통계</span>
      </a>

      <div class="sidebar-divider"></div>

      <a 
        class="sidebar-link" 
        @click="isSubjectManagerOpen = true"
      >
        <span class="icon">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        </span>
        <span class="label">과목 관리</span>
      </a>
    </nav>

    <SubjectManager 
      :is-open="isSubjectManagerOpen" 
      @close="isSubjectManagerOpen = false"
      @refresh="handleRefresh"
    />

    <div class="sidebar-footer">
      <div class="user-profile">
        <div class="user-avatar text-primary">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <div class="user-info">
          <div class="user-name">김윤서</div>
          <div class="user-role">풍무고 1학년</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  background: var(--bg-side);
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.25rem;
  height: 100vh;
  position: sticky;
  top: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 3rem;
  padding-left: 0.5rem;
}

.logo-icon {
  background: var(--primary);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.025em;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-footer {
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
}

.user-role {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sidebar-divider {
  height: 1px;
  background: var(--glass-border);
  margin: 1rem 0;
  opacity: 0.5;
}
</style>
