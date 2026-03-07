<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'refresh']);

const subjects = ref([]);
const newSubject = ref({ name: '', color: '#3b82f6' });
const editingSubject = ref(null);
const isLoading = ref(false);

const presetColors = [
  '#3b82f6', // Blue
  '#facc15', // Yellow
  '#ef4444', // Red
  '#a855f7', // Purple
  '#10b981', // Emerald
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#ec4899'  // Pink
];

const fetchSubjects = async () => {
  try {
    const response = await api.get('/subjects');
    subjects.value = response.data;
  } catch (error) {
    console.error('Failed to fetch subjects:', error);
  }
};

const isColorTaken = (color) => {
  return subjects.value.some(s => s.color.toLowerCase() === color.toLowerCase() && (!editingSubject.value || s.id !== editingSubject.value.id));
};

const handleAddSubject = async () => {
  if (!newSubject.value.name.trim()) return;
  
  if (isColorTaken(newSubject.value.color)) {
    alert('이미 사용 중인 색상입니다. 다른 색상을 선택해 주세요.');
    return;
  }

  isLoading.value = true;
  try {
    await api.post('/subjects', newSubject.value);
    newSubject.value = { name: '', color: '#3b82f6' };
    await fetchSubjects();
    emit('refresh');
  } catch (error) {
    console.error('Failed to add subject:', error);
  } finally {
    isLoading.value = false;
  }
};

const startEdit = (subject) => {
  editingSubject.value = { ...subject };
};

const cancelEdit = () => {
  editingSubject.value = null;
};

const handleUpdateSubject = async () => {
  if (!editingSubject.value.name.trim()) return;

  if (isColorTaken(editingSubject.value.color)) {
    alert('이미 사용 중인 색상입니다. 다른 색상을 선택해 주세요.');
    return;
  }

  isLoading.value = true;
  try {
    await api.put(`/subjects/${editingSubject.value.id}`, editingSubject.value);
    editingSubject.value = null;
    await fetchSubjects();
    emit('refresh');
  } catch (error) {
    console.error('Failed to update subject:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteSubject = async (id) => {
  if (!confirm('정말 삭제하시겠습니까? 이 과목과 관련된 모든 일정과 성취 기록이 삭제될 수 있습니다.')) return;

  isLoading.value = true;
  try {
    await api.delete(`/subjects/${id}`);
    await fetchSubjects();
    emit('refresh');
  } catch (error) {
    console.error('Failed to delete subject:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchSubjects);
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-content glass">
        <div class="modal-header">
          <h3>과목 관리</h3>
          <button class="close-btn" @click="emit('close')">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Add Subject Form -->
          <div class="add-subject-section">
            <h4>새 과목 추가</h4>
            <div class="input-group">
              <input 
                v-model="newSubject.name" 
                type="text" 
                placeholder="과목명 (예: 국어)"
                class="glass-input"
              />
              <div class="color-picker-wrapper">
                <input type="color" v-model="newSubject.color" class="color-input" />
                <div class="preset-colors">
                  <div 
                    v-for="color in presetColors" 
                    :key="color"
                    class="color-dot"
                    :style="{ backgroundColor: color }"
                    :class="{ active: newSubject.color === color }"
                    @click="newSubject.color = color"
                  ></div>
                </div>
              </div>
              <button 
                class="primary-btn" 
                @click="handleAddSubject"
                :disabled="isLoading || !newSubject.name"
              >
                추가
              </button>
            </div>
          </div>

          <!-- Subject List -->
          <div class="subject-list-section">
            <h4>등록된 과목</h4>
            <div class="subject-grid">
              <div v-for="subject in subjects" :key="subject.id" class="subject-item glass">
                <template v-if="editingSubject?.id === subject.id">
                  <input v-model="editingSubject.name" type="text" class="glass-input small" />
                  <input type="color" v-model="editingSubject.color" class="color-input" />
                  <div class="actions">
                    <button class="icon-btn save" @click="handleUpdateSubject">✓</button>
                    <button class="icon-btn cancel" @click="cancelEdit">✕</button>
                  </div>
                </template>
                <template v-else>
                  <div class="subject-info">
                    <div class="color-preview" :style="{ backgroundColor: subject.color }"></div>
                    <span class="subject-name">{{ subject.name }}</span>
                  </div>
                  <div class="actions">
                    <button class="icon-btn edit" @click="startEdit(subject)">✎</button>
                    <button class="icon-btn delete" @click="handleDeleteSubject(subject.id)">🗑</button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 20px;
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-main);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted);
}

.add-subject-section, .subject-list-section {
  margin-bottom: 32px;
}

h4 {
  margin: 0 0 16px 0;
  font-weight: 500;
  color: var(--text-main);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  padding: 0;
  cursor: pointer;
  background: none;
}

.preset-colors {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.color-dot.active {
  border-color: var(--text-main);
  transform: scale(1.2);
}

.subject-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.subject-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
}

.subject-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-preview {
  width: 14px;
  height: 14px;
  border-radius: 4px;
}

.subject-name {
  font-weight: 500;
  color: var(--text-main);
}

.actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-main);
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.icon-btn.delete:hover {
  color: var(--status-down);
}

.icon-btn.save {
  color: var(--primary);
}

.glass-input.small {
  padding: 8px 12px;
  font-size: 0.9rem;
}
</style>
