<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '../services/api'

const props = defineProps({ subjects: Array })
const emit = defineEmits(['refresh'])
const formatDate = (d) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const selectedDate = ref(formatDate(new Date()))
const achievements = ref([])
const isModalOpen = ref(false)
const selectedSubject = ref(null)
const achievementRate = ref(0)
const note = ref('')

const loadAchievements = async () => {
  try {
    const res = await api.get(`/achievements?startDate=${selectedDate.value}&endDate=${selectedDate.value}`)
    achievements.value = res.data
  } catch (err) { console.error(err) }
}

const openAchievementModal = (sub) => {
  selectedSubject.value = sub
  const existing = achievements.value.find(a => a.subject_id === sub.id)
  achievementRate.value = existing ? existing.achievement_rate : 0
  note.value = existing ? existing.note : ''
  isModalOpen.value = true
}

const saveAchievement = async () => {
  if (!selectedSubject.value) return
  try {
    await api.post('/achievements', {
      subject_id: selectedSubject.value.id,
      date: selectedDate.value,
      achievement_rate: achievementRate.value,
      note: note.value
    })
    isModalOpen.value = false
    await loadAchievements()
    emit('refresh')
  } catch (err) {
    console.error("Save failure:", err)
  }
}

watch(selectedDate, loadAchievements)
watch(() => props.subjects, loadAchievements, {deep:true})
onMounted(loadAchievements)
defineExpose({ loadAchievements })
</script>

<template>
  <div class="glass-card w-full">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-sm font-bold uppercase text-muted tracking-wider">오늘의 성취도</h3>
      <input type="date" v-model="selectedDate" class="date-picker" />
    </div>

    <div class="subject-list">
      <div v-for="sub in subjects" :key="sub.id" class="subject-item" @click="openAchievementModal(sub)">
        <div class="subject-avatar" :style="{ background: sub.color + '15', color: sub.color }">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        </div>
        
        <div class="subject-info">
          <div class="flex justify-between items-center mb-1">
            <span class="subject-name">{{ sub.name }}</span>
            <div class="flex items-center gap-2">
              <span class="achievement-text" :class="{ 'text-primary': (achievements.find(a => a.subject_id === sub.id)?.achievement_rate || 0) > 0 }">
                {{ achievements.find(a => a.subject_id === sub.id)?.achievement_rate || 0 }}%
              </span>
              <button class="record-btn-mini">기록</button>
            </div>
          </div>
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: (achievements.find(a => a.subject_id === sub.id)?.achievement_rate || 0) + '%', background: sub.color }"></div>
          </div>
          <p v-if="achievements.find(a => a.subject_id === sub.id)?.note" class="subject-note">
            {{ achievements.find(a => a.subject_id === sub.id)?.note }}
          </p>
        </div>
      </div>
      
      <div v-if="subjects.length === 0" class="empty-state">
        과목을 먼저 추가해 주세요.
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
        <div class="modal-content animate-fade-in">
          <h3 class="text-lg font-bold mb-2">{{ selectedSubject?.name }} 성취도 기록</h3>
          <p class="text-sm text-muted mb-6">{{ selectedDate }}</p>
          
          <div class="input-group">
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-bold">성취율</label>
              <span class="text-primary font-bold">{{ achievementRate }}%</span>
            </div>
            <input type="range" min="0" max="100" v-model.number="achievementRate" class="range-input" />
          </div>
          
          <div class="input-group">
            <label class="text-sm font-bold block mb-2">학습 메모</label>
            <textarea v-model="note" class="input-field" rows="3" placeholder="오늘 어떤 내용을 공부했나요?"></textarea>
          </div>
          
          <div class="flex justify-end gap-2 mt-8">
            <button class="btn btn-ghost" @click="isModalOpen = false">취소</button>
            <button class="btn btn-primary" @click="saveAchievement">기록 저장</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.date-picker {
  border: none;
  background: #f3f4f6;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  color: var(--text-main);
  outline: none;
  cursor: pointer;
}

.subject-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.subject-item {
  display: flex;
  gap: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: background 0.2s ease;
}

.subject-item:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.record-btn-mini {
  background: var(--primary);
  color: white;
  border: none;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
}

.subject-item:hover .record-btn-mini {
  opacity: 1;
}

.subject-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.subject-info {
  flex: 1;
  min-width: 0;
}

.subject-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
}

.achievement-text {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-light);
}

.progress-container {
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  margin: 0.25rem 0;
}

.progress-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.subject-note {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.input-group {
  margin-bottom: 1.5rem;
}

.range-input {
  width: 100%;
  accent-color: var(--primary);
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  font-size: 0.8125rem;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2200;
}

.modal-content {
  width: 90%;
  max-width: 460px;
  border-radius: 24px;
  padding: 2rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted);
  padding: 0.5rem;
  line-height: 1;
}
</style>
