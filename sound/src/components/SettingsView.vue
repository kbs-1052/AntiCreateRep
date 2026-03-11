<template>
  <div class="settings-container">
    <div class="section-header">
      <h2>⚙️ 환경 설정</h2>
      <p class="subtitle">시스템 기본 설정 및 예약 공통 옵션을 구성합니다.</p>
    </div>

    <div class="settings-card">
      <h3>일반 설정</h3>
      <div class="form-group setting-item">
        <div class="setting-text">
          <label>기본 알림 활성화</label>
          <span class="setting-desc">예약 시작 시 시스템 알림을 표시합니다.</span>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" v-model="settings.enableNotifications">
          <span class="slider round"></span>
        </label>
      </div>

      <div class="form-group setting-item">
        <label>테마 설정</label>
        <select class="form-control" v-model="settings.theme">
          <option value="light">라이트 모드 (기본)</option>
          <option value="dark">다크 모드</option>
          <option value="system">시스템 설정 따름</option>
        </select>
      </div>
    </div>

    <div class="settings-card">
      <h3>미디어 설정</h3>
      <div class="form-group setting-item">
        <div class="setting-text">
          <label>기본 예약 볼륨</label>
          <span class="setting-desc">새로운 예약을 등록할 때 기본으로 사용할 볼륨 크기입니다.</span>
        </div>
        <div class="volume-control">
          <input type="range" v-model.number="settings.defaultVolume" min="0" max="100" class="vol-slider">
          <span class="vol-text">{{ settings.defaultVolume }}%</span>
        </div>
      </div>
    </div>

    <div class="settings-actions">
      <button class="btn btn-primary" @click="saveSettings">설정 저장</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

const settings = reactive({
  enableNotifications: true,
  theme: 'light',
  defaultVolume: 50
})

onMounted(() => {
  const saved = localStorage.getItem('appSettings')
  if (saved) {
    Object.assign(settings, JSON.parse(saved))
  }
})

const saveSettings = () => {
  localStorage.setItem('appSettings', JSON.stringify(settings))
  alert('환경 설정이 저장되었습니다.')
}
</script>

<style scoped>
.settings-container {
  padding: 20px 40px;
  max-width: 800px;
  margin: 0 auto;
}
.subtitle {
  color: var(--text-medium);
  margin-top: 5px;
  margin-bottom: 20px;
}
.settings-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}
.settings-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--text-dark);
}
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.setting-text {
  display: flex;
  flex-direction: column;
}
.setting-text label {
  font-weight: 600;
  margin-bottom: 4px;
}
.setting-desc {
  font-size: 0.85rem;
  color: var(--text-medium);
}
.form-control {
  width: 200px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}
.volume-control {
  display: flex;
  align-items: center;
  gap: 15px;
}
.vol-slider {
  width: 150px;
}
.vol-text {
  font-weight: 600;
  min-width: 40px;
}
.settings-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* Toggle Switch CSS */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}
input:checked + .slider {
  background-color: #4361ee;
}
input:focus + .slider {
  box-shadow: 0 0 1px #4361ee;
}
input:checked + .slider:before {
  transform: translateX(24px);
}
.slider.round {
  border-radius: 26px;
}
.slider.round:before {
  border-radius: 50%;
}
</style>
