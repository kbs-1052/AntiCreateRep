<script setup>
import { ref, onMounted } from 'vue'
import api from './services/api'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'
import StatCard from './components/StatCard.vue'
import WeeklyScheduleManager from './components/WeeklyScheduleManager.vue'
import DailyAchievementManager from './components/DailyAchievementManager.vue'
import WeeklyHistory from './components/WeeklyHistory.vue'

const subjects = ref([])
const weeklyStats = ref([])
const activeTab = ref('dashboard')

const totalAchievementRate = ref(0)
const todayAchievementRate = ref(0)
const refreshKey = ref(0)
const statsThisMonth = ref(45200) // Mock value for visual
const statsThisYear = ref(229710) // Mock value for visual

const weeklyRef = ref(null)
const dailyRef = ref(null)
const historyRef = ref(null)

const isSearchOpen = ref(false)
const searchResults = ref([])

const handleSearch = async (query) => {
  if (!query.trim()) {
    isSearchOpen.value = false
    return
  }
  try {
    const res = await api.get(`/search?query=${encodeURIComponent(query)}`)
    searchResults.value = res.data
    isSearchOpen.value = true
  } catch (error) {
    console.error("Search failed", error)
  }
}

const fetchSubjects = async () => {
  try {
    const res = await api.get('/subjects')
    subjects.value = res.data
  } catch (error) {
    console.error("Error fetching subjects", error)
  }
}

const fetchStats = async () => {
  try {
    const [weeklyRes, todayRes] = await Promise.all([
      api.get('/stats?weeks=5'),
      api.get('/today')
    ])
    weeklyStats.value = weeklyRes.data
    if (weeklyRes.data.length > 0) {
      totalAchievementRate.value = weeklyRes.data[0].averageAchievementRate
    }
    todayAchievementRate.value = todayRes.data.achievementRate
    refreshKey.value++ // Trigger child reloads
  } catch (error) {
    console.error("Error fetching stats", error)
  }
}

onMounted(() => {
  fetchSubjects()
  fetchStats()
})

// 주간학습계획 저장 시 → 오늘의 성취도 & 주별 히스토리 갱신
const onWeeklyRefresh = () => {
  fetchStats()
  dailyRef.value?.loadAchievements()
  historyRef.value?.fetchHistory()
}

// 오늘의 성취도 저장 시 → 주간학습계획 & 주별 히스토리 갱신
const onDailyRefresh = () => {
  fetchStats()
  weeklyRef.value?.loadSchedules()
  historyRef.value?.fetchHistory()
}
</script>

<template>
  <div class="app-layout">
    <AppSidebar v-model:activeTab="activeTab" @refresh="() => { fetchSubjects(); fetchStats(); }" />
    
    <main class="main-content animate-fade-in">
      <AppHeader :todayAchievement="todayAchievementRate" @search="handleSearch" />

      <!-- Search Results Overlay -->
      <div v-if="isSearchOpen" class="search-overlay" @click.self="isSearchOpen = false">
        <div class="search-results-card glass animate-slide-up">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">검색 결과 ({{ searchResults.length }})</h3>
            <button class="close-btn" @click="isSearchOpen = false">&times;</button>
          </div>
          
          <div class="results-list custom-scrollbar">
            <div v-for="(res, i) in searchResults" :key="i" class="result-item" @click="isSearchOpen = false">
              <div class="flex items-center gap-3 mb-1">
                <div class="color-dot" :style="{ backgroundColor: res.subjectColor }"></div>
                <span class="text-xs font-bold uppercase text-muted">{{ res.type }}</span>
                <span v-if="res.date" class="text-xs text-muted ml-auto">{{ res.date }}</span>
              </div>
              <div class="result-content">
                <div class="font-semibold text-sm mb-1">{{ res.subjectName }}</div>
                <div class="text-sm text-main line-clamp-2">{{ res.content }}</div>
              </div>
            </div>
            <div v-if="searchResults.length === 0" class="py-8 text-center text-muted">
              검색 결과가 없습니다.
            </div>
          </div>
        </div>
      </div>

      <div v-show="activeTab === 'history'" class="animate-slide-up">
        <WeeklyHistory ref="historyRef" />
      </div>

      <div v-show="activeTab === 'dashboard'" class="dashboard-content">
        <!-- Top Stats Row -->
        <section class="stats-grid mb-4">
          <StatCard 
            title="오늘의 성취율" 
            :value="todayAchievementRate.toFixed(1) + '%'" 
            subtitle="Sales Today"
            trend="up"
            type="primary"
          />
          <StatCard 
            title="이번 주 성취율" 
            :value="totalAchievementRate.toFixed(1) + '%'" 
            subtitle="Sales This Month"
            trend="up"
          />
          <StatCard 
            title="전체 공부 시간" 
            value="12.5h" 
            subtitle="Total Study Time"
            trend="neutral"
          />
        </section>

        <!-- Main Dashboard Grid -->
        <div class="dashboard-grid">
          <div class="grid-left flex flex-col gap-4">
            <!-- Weekly Schedule as 'Orders' -->
            <WeeklyScheduleManager ref="weeklyRef" :subjects="subjects" @refresh="onWeeklyRefresh" />
          </div>
          
          <div class="grid-right flex flex-col gap-4">
            <!-- Daily Achievement as 'Drivers' -->
            <DailyAchievementManager ref="dailyRef" :subjects="subjects" @refresh="onDailyRefresh" />
            
            <!-- History Statistics -->
            <div class="glass-card">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-sm font-bold uppercase text-muted">주별 통계 이력</h3>
              </div>
              <div class="flex flex-col gap-2">
                <div v-for="stat in weeklyStats.slice(1)" :key="stat.weekStartDate" class="stat-row">
                  <span class="text-sm">{{ stat.weekStartDate }}</span>
                  <div class="progress-bar-small">
                    <div class="progress-fill" :style="{ width: stat.averageAchievementRate + '%' }"></div>
                  </div>
                  <span class="text-xs font-bold">{{ stat.averageAchievementRate.toFixed(0) }}%</span>
                </div>
                <div v-if="weeklyStats.length <= 1" class="text-center text-muted py-4 text-xs">
                  표시할 통계 데이터가 없습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.stat-row:last-child {
  border-bottom: none;
}

.progress-bar-small {
  flex: 1;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 3px;
}
/* Search Overlay Styling */
.search-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  z-index: 3000;
  display: flex;
  justify-content: center;
  padding-top: 80px;
}

.search-results-card {
  width: 90%;
  max-width: 600px;
  height: fit-content;
  max-height: 70vh;
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.results-list {
  overflow-y: auto;
  padding-right: 0.5rem;
}

.result-item {
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.result-item:hover {
  background: white;
  transform: translateY(-2px);
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted);
}
</style>
