<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const history = ref([])

const fetchHistory = async () => {
  try {
    const res = await api.get('/stats?weeks=12') // Fetch last 12 weeks
    history.value = res.data
  } catch (error) {
    console.error("Error fetching history", error)
  }
}

onMounted(fetchHistory)

defineExpose({ fetchHistory })
</script>

<template>
  <div class="glass-panel p-6 animate-slide-up">
    <h2 class="text-2xl font-bold mb-6 text-primary">주별 정보 (Weekly History)</h2>
    <div class="history-list flex flex-col gap-4">
      <div v-for="item in history" :key="item.weekStartDate" class="history-item glass-panel p-4 flex justify-between items-center">
        <div>
          <span class="font-bold text-lg">{{ item.weekStartDate }} 주차</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="progress-bar-bg w-48 h-4 bg-gray-200 rounded-full overflow-hidden">
            <div class="progress-bar-fill h-full bg-primary" :style="{ width: item.averageAchievementRate + '%' }"></div>
          </div>
          <span class="font-bold text-primary">{{ item.averageAchievementRate.toFixed(1) }}%</span>
        </div>
      </div>
      <div v-if="history.length === 0" class="text-center text-muted py-10">
        표시할 주별 정보가 없습니다.
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-item {
  transition: transform 0.2s;
}
.history-item:hover {
  transform: translateY(-2px);
}
.progress-bar-bg {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.bg-primary {
  background: var(--primary-gradient);
}
</style>
