<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '../services/api'

const props = defineProps({ subjects: Array })
const weekOffset = ref(0)
const schedules = ref([])
const isModalOpen = ref(false)
const selectedSubject = ref(null)
const selectedDate = ref(null)
const planContent = ref('')
const achievements = ref([])

const days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']

const formatDate = (d) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getMonday = (offset = 0) => {
  const d = new Date()
  const day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  monday.setHours(0,0,0,0)
  monday.setDate(monday.getDate() + (offset * 7))
  return monday
}

const currentWeekStart = ref(formatDate(getMonday(0)))

const getWeekDates = () => {
  const start = getMonday(weekOffset.value)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return formatDate(d)
  })
}

const weekDates = ref(getWeekDates())

const loadSchedules = async () => {
  try {
    const weekEnd = formatDate(new Date(new Date(currentWeekStart.value).setDate(new Date(currentWeekStart.value).getDate() + 6)))
    const [schedRes, achRes] = await Promise.all([
      api.get(`/schedules?weekStartDate=${currentWeekStart.value}`),
      api.get(`/achievements?startDate=${currentWeekStart.value}&endDate=${weekEnd}`)
    ])
    schedules.value = schedRes.data
    achievements.value = achRes.data
  } catch (err) { console.error(err) }
}

const changeWeek = (offsetChange) => {
  weekOffset.value += offsetChange
  const monday = getMonday(weekOffset.value)
  currentWeekStart.value = formatDate(monday)
  weekDates.value = getWeekDates()
  loadSchedules()
}

const openPlanModal = (sub, date) => {
  selectedSubject.value = sub
  selectedDate.value = date
  const existingSched = schedules.value.find(s => s.subject_id === sub.id && s.date === date)
  planContent.value = existingSched ? existingSched.plan_content : ''
  isModalOpen.value = true
}

const emit = defineEmits(['refresh'])

const savePlan = async () => {
  if (!selectedSubject.value || !selectedDate.value) return
  try {
    const payload = {
      subject_id: selectedSubject.value.id,
      date: selectedDate.value,
      plan_content: planContent.value
    }
    await api.post('/schedules', payload)
    isModalOpen.value = false
    await loadSchedules()
    emit('refresh')
    window.alert('학습 계획이 저장되었습니다.')
  } catch (err) {
    console.error("Save failed:", err)
    window.alert('저장에 실패했습니다. 서버 상태를 확인해주세요.')
  }
}

watch(() => props.subjects, loadSchedules)
onMounted(loadSchedules)
defineExpose({ loadSchedules })
</script>

<template>
  <div class="glass-card w-full overflow-hidden">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-bold">주간 학습 계획</h2>
      <div class="flex items-center gap-2">
        <button class="btn-nav" @click="changeWeek(-1)">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <span class="text-sm font-bold">{{ currentWeekStart }}</span>
        <button class="btn-nav" @click="changeWeek(1)">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
    
    <div class="table-container">
      <table class="schedule-table">
        <thead>
          <tr>
            <th>과목</th>
            <th v-for="(day, i) in days" :key="day" class="text-center">
              <div class="day-label">{{ day }}</div>
              <div class="date-label" :class="{ today: weekDates[i] === formatDate(new Date()) }">
                {{ weekDates[i].split('-')[2] }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sub in subjects" :key="sub.id">
            <td>
              <div class="subject-cell">
                <div class="color-dot" :style="{ backgroundColor: sub.color }"></div>
                <span class="subject-name">{{ sub.name }}</span>
              </div>
            </td>
            <td v-for="date in weekDates" :key="date" @click="openPlanModal(sub, date)">
              <div class="goal-cell" 
                   :class="{ 'has-content': schedules.find(s => s.subject_id === sub.id && s.date === date) }">
                <div class="cell-content">
                  <span class="plan-text">{{ schedules.find(s => s.subject_id === sub.id && s.date === date)?.plan_content || '+' }}</span>
                  <div v-if="achievements.find(a => a.subject_id === sub.id && a.date === date)" class="ach-badge" :style="{ background: sub.color }">
                    {{ achievements.find(a => a.subject_id === sub.id && a.date === date)?.achievement_rate || 0 }}%
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="subjects.length === 0" class="empty-state">
      과목 정보가 없습니다. 사이드바에서 과목을 추가해주세요.
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
        <div class="modal-content glass animate-fade-in">
          <div class="modal-header">
            <div class="flex items-center gap-3">
              <div class="color-dot" :style="{ backgroundColor: selectedSubject?.color, width: '12px', height: '12px' }"></div>
              <h3 class="text-lg font-bold">{{ selectedSubject?.name }}</h3>
            </div>
            <button class="close-btn" @click="isModalOpen = false">&times;</button>
          </div>
          <div class="modal-body py-4">
            <label class="block text-xs font-semibold text-muted uppercase mb-2">{{ selectedDate }} 학습 계획</label>
            <textarea 
              v-model="planContent" 
              class="glass-input w-full mb-4" 
              rows="3" 
              placeholder="오늘 어떤 공부를 할 계획인가요?"
            ></textarea>

            <div v-if="achievements.find(a => a.subject_id === selectedSubject?.id && a.date === selectedDate)" class="achievement-info-section mt-4">
              <div class="flex justify-between items-center mb-2">
                <label class="text-xs font-semibold text-muted uppercase">현재 성취도</label>
                <span class="text-primary font-bold">
                  {{ achievements.find(a => a.subject_id === selectedSubject?.id && a.date === selectedDate)?.achievement_rate || 0 }}%
                </span>
              </div>
              <div class="achievement-readonly-bar">
                <div class="achievement-readonly-fill" :style="{ width: (achievements.find(a => a.subject_id === selectedSubject?.id && a.date === selectedDate)?.achievement_rate || 0) + '%', background: selectedSubject?.color }"></div>
              </div>
              <p class="text-[10px] text-muted mt-1">※ 성취도는 '오늘의 성취도' 탭에서 수정할 수 있습니다.</p>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-2">
            <button class="primary-btn" @click="savePlan">저장하기</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.table-container {
  overflow-x: auto;
  margin: 0 -1.5rem;
  padding: 0 1.5rem;
}

.schedule-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.schedule-table th {
  padding: 1.25rem 0.75rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  border-bottom: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.02);
}

.day-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-bottom: 0.35rem;
}

.date-label {
  font-size: 1rem;
  color: var(--text-main);
  font-weight: 600;
}

.date-label.today {
  color: var(--primary);
  position: relative;
}

.date-label.today::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--primary);
  border-radius: 50%;
}

.schedule-table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid var(--glass-border);
  vertical-align: middle;
}

.subject-cell {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 120px;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 8px currentColor;
}

.subject-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-main);
}

.goal-cell {
  width: 100%;
  min-height: 44px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.5rem 0.75rem;
  border: 1px solid transparent;
}

.goal-cell:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateY(-1px);
  border-color: var(--glass-border);
}

.goal-cell.has-content {
  background: white;
  color: var(--text-main);
  border-color: var(--glass-border);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  justify-content: flex-start;
  text-align: left;
}

.cell-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.plan-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ach-badge {
  font-size: 0.65rem;
  padding: 1px 4px;
  border-radius: 4px;
  color: white;
  width: fit-content;
  font-weight: 700;
}

.achievement-readonly-bar {
  height: 8px;
  background: rgba(0,0,0,0.06);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.25rem;
}

.achievement-readonly-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.btn-nav {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--glass-border);
  background: var(--card-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-main);
  transition: all 0.2s;
}

.btn-nav:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
  font-size: 0.9375rem;
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
  z-index: 2100;
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
