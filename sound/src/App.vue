<template>
  <div class="app-wrapper">
    <!-- Left Sidebar (Narrow Icon Menu) -->
    <aside class="sidebar-left">
      <div class="sidebar-logo">
        <div class="logo-icon">📺</div>
      </div>
      <ul class="sidebar-menu top-icons">
        <li :class="{ active: currentView === 'dashboard' }" title="대시보드" @click="currentView = 'dashboard'; searchQuery = '';">
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </li>
        <li title="새 예약 등록" @click="openAddModal">
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </li>
        <li :class="{ active: currentView === 'reservationList' }" title="예약 목록" @click="currentView = 'reservationList'; searchQuery = '';">
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>
        </li>
      </ul>
      <div class="sidebar-bottom">
        <ul class="sidebar-menu">
          <li :class="{ active: currentView === 'settings' }" title="설정" @click="currentView = 'settings'; searchQuery = '';">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-layout">
      <!-- Top Title and Profile Header -->
      <header class="top-header">
        <h1><span class="red-o">월</span>드메르디<span class="red-o">앙</span> S<span class="red-o">o</span>und C<span class="red-o">o</span>ntr<span class="red-o">o</span>ller</h1>
        <div class="header-actions">
          <div class="system-status" :class="isSystemActive ? 'status-active' : 'status-standby'">
            <span class="status-dot"></span>
            <span>{{ isSystemActive ? 'System Active' : 'System Standby' }}</span>
          </div>
          <div class="user-profile">
            <div class="avatar">👨‍💻</div>
            <div class="user-info">
              <span class="user-name">월드 헬스장</span>
            </div>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
      </header>

      <!-- 대시보드 화면 -->
      <main class="content-body" v-if="currentView === 'dashboard'">
        
        <!-- Welcome Banner -->
        <div class="welcome-banner">
          <h2>환영합니다, 헬스장 회원님! 👋</h2>
          <p>오늘도 신나고 음악 들으며 열심히 즐겁게 운동 하세요. ^^</p>
          <div class="pill-group">
            <div class="pill"><span class="pill-num color-blue">{{ waitingCount }}</span> 대기 중인 예약</div>
            <div class="pill"><span class="pill-num color-blue">{{ playingCount }}</span> 재생 중인 미디어</div>
            <div class="pill"><span class="pill-num color-blue">{{ completedCount }}</span> 완료된 예약</div>
          </div>
        </div>

        <div class="search-bar-container">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="예약 검색 (제목, 미디어 입력)..." v-model="searchQuery">
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">총 예약 수</div>
            <div class="value color-blue">{{ reservations.length }}</div>
            <div class="stat-trend trend-up">모든 일정 포함</div>
          </div>
          <div class="stat-card">
            <div class="label">금일 예약 수</div>
            <div class="value color-blue">{{ todayTotalCount }}</div>
            <div class="stat-trend trend-up">오늘 진행 예정</div>
          </div>
          <div class="stat-card">
            <div class="label">금일 상태 (완료 / 남음)</div>
            <div class="value color-blue">{{ todayCompletedCount }} <span style="font-size:1.5rem; color:var(--text-medium)">/ {{ todayTotalCount - todayCompletedCount }}</span></div>
            <div class="stat-link" @click="fetchReservations">새로고침</div>
          </div>
        </div>

        <!-- Reservation Header -->
        <div class="section-header">
          <h2>금일 예정 목록 (Today's Next)</h2>
          <span class="view-all" @click="currentView = 'reservationList'; searchQuery = '';">전체보기</span>
        </div>

        <!-- Reservation List (Today Only on Dashboard) -->
        <div class="reservation-list-container">
          <div 
            v-for="res in todayFilteredReservations" 
            :key="res.id"
            class="res-row"
            :style="{ borderLeft: '4px solid ' + getColor(res.id) }"
            @dblclick="openEditModal(res)"
            title="더블클릭하여 수정"
          >
            <!-- User/Title Info -->
            <div class="res-info">
              <div class="res-avatar" :style="{ backgroundColor: getColor(res.id) + '20', color: getColor(res.id) }">
                {{ res.title.charAt(0).toUpperCase() }}
              </div>
              <div class="res-text">
                <div class="res-title">{{ res.title }}</div>
                <div class="res-subtitle">매주 {{ res.playDays }}</div>
              </div>
            </div>
            
            <!-- Metadata & Status -->
            <div class="res-meta">
              <span>{{ res.mediaContent }}</span>
              <span>{{ formatTime(res.startHour, res.startMinute) }} ~ {{ formatTime(res.endHour, res.endMinute) }}</span>
            </div>

            <!-- Icons / Badges -->
            <div class="res-icons">
               <!-- Some decorative icons to match the design -->
               <span class="status-badge" :class="`status-${res.status}`">{{ statusIcon(res.status) }} {{ res.status }}</span>
               <svg class="chevron" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
               <button class="btn btn-ghost btn-sm delete-btn" @click.stop="deleteReservation(res.id)" title="예약 삭제">
                 <svg viewBox="0 0 24 24" width="16" height="16" stroke="#f72585" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                 <span>삭제</span>
               </button>
            </div>
          </div>

          <div v-if="todayFilteredReservations.length === 0" class="empty-state">
            결과가 없습니다.
          </div>
        </div>

      </main>

      <!-- 예약 목록 전체 화면 -->
      <main class="content-body" style="padding-top: 20px" v-else-if="currentView === 'reservationList'">
        <ReservationView 
          :reservations="reservations"
          v-model:searchQuery="searchQuery"
          @add="openAddModal"
          @edit="openEditModal"
          @delete="deleteReservation"
        />
      </main>

      <!-- 환경 설정 화면 -->
      <main class="content-body" style="padding-top: 20px" v-else-if="currentView === 'settings'">
        <SettingsView />
      </main>
    </div>

    <!-- Right Sidebar (Calendar & Schedule) - Only on Dashboard -->
    <aside class="sidebar-right" v-if="currentView === 'dashboard'">
      <!-- Simple Calendar Header -->
      <div class="sidebar-r-header">
        <h2>Today's Schedule</h2>
        <button class="btn btn-icon btn-ghost btn-sm" @click="openAddModal" title="새 예약 등록">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
      <div class="calendar-widget">
         <div class="cal-header">
           <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="cursor: pointer" @click="prevMonth"><polyline points="15 18 9 12 15 6"></polyline></svg>
           <span>{{ currentMonthName }} {{ currentYear }}</span>
           <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="cursor: pointer" @click="nextMonth"><polyline points="9 18 15 12 9 6"></polyline></svg>
         </div>
         <div class="cal-days">
           <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
         </div>
         <div class="cal-grid">
           <span v-for="(blank, i) in blankDays" :key="'blank-'+i" class="date empty"></span>
           <span 
             v-for="day in daysInMonth" 
             :key="day" 
             class="date" 
             :class="{ active: isToday(day), selected: selectedDate === day }"
             @click="selectedDate = day"
           >
             {{ day }}
             <span class="day-count" v-if="getReservationCountForDay(day) > 0">{{ getReservationCountForDay(day) }}</span>
           </span>
         </div>
      </div>

      <!-- Schedule Timeline -->
      <div class="schedule-timeline">
         <div class="timeline-item" v-for="(item, index) in timelineItems" :key="index">
           <div class="time-label">{{ item.time }}</div>
           <div class="timeline-card">
              <div class="tl-header">
                <div class="tl-avatar" :style="{ background: item.color }"></div>
                <div class="tl-info">
                  <div class="tl-title">{{ item.title }}</div>
                  <div class="tl-time">{{ item.duration }}</div>
                </div>
              </div>
              <div class="tl-footer">
                <span>{{ item.type }}</span>
                <span class="dot-status" :class="item.status"></span>
              </div>
           </div>
         </div>
      </div>
    </aside>

    <ReservationModal
      v-if="showModal"
      :editing="editing"
      @close="closeModal"
      @save="handleSaveReservation"
    />

    <!-- 🎬 YouTube Cinema Player (Fixed Overlay) -->
    <div class="player-overlay yt-cinema" v-if="isYTLoaded" v-show="activeMedia && activeMedia.type === 'youtube'">
      <div class="player-container yt-frame">
        <div class="player-header">
           <span class="player-title">🎬 YouTube Cinema: {{ activeMedia?.title }}</span>
           <button class="btn-close-player" @click="activeMedia && closePlayer(activeMedia.id); revokeBlobUrl();">×</button>
        </div>
        <div class="video-wrapper">
          <div id="yt-player"></div>
        </div>
        <div class="player-info">
          <div class="status-log">{{ playerStatusLog }}</div>
          <div>볼륨: {{ activeMedia?.volume }}%</div>
        </div>
      </div>
    </div>

    <!-- 🎵 Music Mini Player (Sticky Bottom Center) -->
    <div class="audio-mini-player" v-if="activeMedia && activeMedia.type === 'audio'">
      <div class="audio-card">
        <div class="audio-disc">
          <div class="disc-inner">💿</div>
        </div>
        <div class="audio-main">
          <div class="audio-title">Now Playing: {{ activeMedia.title }}</div>
          <div class="audio-controls-row">
            <audio controls autoplay :src="activeMedia.content" ref="audioPlayer" @ended="onAudioEnded"></audio>
          </div>
          <div class="audio-meta">
             <span class="status-log">{{ playerStatusLog }}</span>
             <span>볼륨: {{ activeMedia.volume }}%</span>
          </div>
        </div>
        <button class="audio-close-btn" @click="closePlayer(activeMedia.id); revokeBlobUrl();" title="닫기">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import ReservationModal from './components/ReservationModal.vue'
import ReservationView from './components/ReservationView.vue'
import SettingsView from './components/SettingsView.vue'
import { getMusicFile } from './utils/db.js'

const currentView = ref('dashboard') // 'dashboard' | 'reservationList' | 'settings'

const reservations = ref([])
const showModal = ref(false)
const editing = ref(null)
const searchQuery = ref("")
const activeMedia = ref(null) // { id, title, type, content, volume }
const dismissedIds = ref(new Set()) // 수동으로 닫은 예약 ID들
const currentBlobUrl = ref(null) // 현재 재생 중인 Blob URL
const ytPlayer = ref(null) // YouTube Player Instance
const isYTApiReady = ref(false)
const audioPlayer = ref(null)
const isAudioInterrupted = ref(false) // 음악 재생으로 인해 유튜브가 일시 중지 되었는지 여부
const interruptedYTMedia = ref(null) // 일시 중지된 유튜브 정보
const isSystemActive = ref(false) // 최초 사용자 클릭 여부
const playerStatusLog = ref("시스템 대기 중...")
const isYTInitializing = ref(false) // YouTube 플레이어 생성 중인지 확인
const isYTLoaded = ref(false) // YouTube 플레이어가 DOM에 생성되었는지 여부

// --- Calendar Logic ---
const currentDate = ref(new Date())
const selectedDate = ref(currentDate.value.getDate())

const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentMonthName = computed(() => currentDate.value.toLocaleString('en-US', { month: 'long' }))

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const blankDays = computed(() => {
  // 0 = Sunday, 1 = Monday, etc.
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const isToday = (day) => {
  const today = new Date()
  return day === today.getDate() && 
         currentMonth.value === today.getMonth() && 
         currentYear.value === today.getFullYear()
}

const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
  selectedDate.value = 1
}
const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
  selectedDate.value = 1
}

const getDayOfWeekStr = (year, month, day) => {
  const d = new Date(year, month, day).getDay()
  const days = ["일", "월", "화", "수", "목", "금", "토"]
  return days[d]
}

const getReservationCountForDay = (day) => {
  const weekday = getDayOfWeekStr(currentYear.value, currentMonth.value, day)
  return reservations.value.filter(r => r.playDays && r.playDays.includes(weekday)).length
}
// ----------------------

const COLORS = ['#4361ee', '#f72585', '#4cc9f0', '#f8961e', '#43a047']
const getColor = (id) => COLORS[(id - 1) % COLORS.length]

const playingCount = computed(() => reservations.value.filter(r => r.status === '플레이중').length)
const waitingCount = computed(() => reservations.value.filter(r => r.status === '대기').length)
const completedCount = computed(() => reservations.value.filter(r => r.status === '완료').length)

const todayString = computed(() => getDayOfWeekStr(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))
const todayTotalCount = computed(() => reservations.value.filter(r => r.playDays && r.playDays.includes(todayString.value)).length)
const todayCompletedCount = computed(() => reservations.value.filter(r => r.playDays && r.playDays.includes(todayString.value) && r.status === '완료').length)

const todayFilteredReservations = computed(() => {
  let list = reservations.value.filter(r => r.playDays && r.playDays.includes(todayString.value));
  if (!searchQuery.value) return list;
  const q = searchQuery.value.toLowerCase()
  return list.filter(r => 
    r.title.toLowerCase().includes(q) || 
    r.mediaContent.toLowerCase().includes(q)
  )
})

const timelineItems = computed(() => {
   const weekday = getDayOfWeekStr(currentYear.value, currentMonth.value, selectedDate.value)
   const list = reservations.value.filter(r => r.playDays && r.playDays.includes(weekday))
   return list.map(r => ({
     time: `${r.startHour}:${String(r.startMinute).padStart(2,'0')}`,
     title: r.title,
     duration: `${r.startHour}:${String(r.startMinute).padStart(2,'0')} - ${r.endHour}:${String(r.endMinute).padStart(2,'0')}`,
     type: r.mediaContent.includes('youtu') ? 'YouTube' : '로컬 파일',
     color: getColor(r.id),
     status: r.status === '플레이중' ? 'online' : 'offline'
   })).sort((a,b) => {
      // sort by time
      const aTime = a.time.split(':').map(Number)
      const bTime = b.time.split(':').map(Number)
      if (aTime[0] !== bTime[0]) return aTime[0] - bTime[0]
      return aTime[1] - bTime[1]
   })
})

const fetchReservations = () => {
  const saved = localStorage.getItem('appReservations')
  if (saved) {
    reservations.value = JSON.parse(saved)
  } else {
    reservations.value = []
  }
}

const saveReservationsToStorage = () => {
  localStorage.setItem('appReservations', JSON.stringify(reservations.value))
}

const openAddModal = () => {
  editing.value = null
  showModal.value = true
}

const openEditModal = (res) => {
  editing.value = { ...res }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editing.value = null
}

const closePlayer = (id) => {
  dismissedIds.value.add(id)
  activeMedia.value = null
  revokeBlobUrl()
  isYTInitializing.value = false
  if (ytPlayer.value && typeof ytPlayer.value.stopVideo === 'function') {
    ytPlayer.value.stopVideo()
  }
  
  // 예약 상태를 '완료'로 변경
  const index = reservations.value.findIndex(r => r.id === id)
  if (index !== -1) {
    reservations.value[index].status = '완료'
    saveReservationsToStorage()
  }
}

const revokeBlobUrl = () => {
  if (currentBlobUrl.value) {
    URL.revokeObjectURL(currentBlobUrl.value)
    currentBlobUrl.value = null
  }
}

const handleSaveReservation = (formData) => {
  if (editing.value && editing.value.id) {
    // Update
    const index = reservations.value.findIndex(r => r.id === editing.value.id)
    if (index !== -1) {
      reservations.value[index] = { ...formData, id: editing.value.id }
    }
  } else {
    // Create
    const newId = reservations.value.length > 0 ? Math.max(...reservations.value.map(r => r.id)) + 1 : 1
    reservations.value.push({ ...formData, id: newId })
  }
  saveReservationsToStorage()
}

const deleteReservation = (id) => {
  if (confirm('이 예약을 정말 삭제하시겠습니까?')) {
    reservations.value = reservations.value.filter(r => r.id !== id)
    saveReservationsToStorage()
  }
}

const formatTime = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
const statusIcon = (s) => ({ '대기': '⏳', '플레이중': '▶', '완료': '✅' }[s] || '⚪')

let pollingInterval

onMounted(() => {
  fetchReservations()
  
  // YouTube IFrame API 로드
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    window.onYouTubeIframeAPIReady = () => {
      isYTApiReady.value = true
      playerStatusLog.value = "YouTube API 준비 완료"
    }
  } else {
    isYTApiReady.value = true
  }

  // 스케줄러 시작 (시스템 비활성화 상태에서도 데이터 갱신은 수행)
  pollingInterval = setInterval(updateScheduler, 1000)

  // 전역 클릭 리스너: 첫 클릭 시 자동으로 시스템 활성화 (브라우저 정책 대응)
  const autoActivate = () => {
    if (!isSystemActive.value) {
      activateSystem()
    }
  }
  window.addEventListener('click', autoActivate, { once: true })
})

const activateSystem = () => {
  isSystemActive.value = true
  playerStatusLog.value = "시스템이 활성화되었습니다."
  // 오디오 컨텍스트를 해제하기 위한 더미 소리 재생은 필요 시 추가
}

const initYTPlayer = (videoId) => {
  if (!isYTApiReady.value) {
    playerStatusLog.value = "YouTube API가 아직 로드되지 않았습니다.";
    return;
  }
  
  if (isYTInitializing.value) return; // 이미 초기화 중이면 중단

  isYTLoaded.value = true;
  playerStatusLog.value = `비디오 초기화 시도: ${videoId}`;

  nextTick(() => {
    const el = document.getElementById('yt-player');
    if (!el) {
       playerStatusLog.value = "yt-player 요소를 찾을 수 없습니다.";
       return;
    }

    if (ytPlayer.value && typeof ytPlayer.value.loadVideoById === 'function') {
      // Prevent restart if same video is already loaded
      let isSameVideo = false
      try {
        const currentData = ytPlayer.value.getVideoData()
        if (currentData && currentData.video_id === videoId) {
          isSameVideo = true
        }
      } catch (e) {}

      if (isSameVideo) {
        playerStatusLog.value = "Already playing same video. Ensuring playback."
        ytPlayer.value.playVideo()
      } else {
        playerStatusLog.value = "기존 플레이어에 비디오 로드 중...";
        ytPlayer.value.loadVideoById(videoId)
      }
      
      if (ytPlayer.value.setVolume) {
        ytPlayer.value.setVolume(activeMedia.value?.volume || 50)
      }
    } else {
      playerStatusLog.value = "새 YouTube 플레이어 생성 중...";
      isYTInitializing.value = true;
      ytPlayer.value = new window.YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          'autoplay': 1,
          'mute': 0,
          'playsinline': 1,
          'rel': 0,
          'modestbranding': 1,
          'origin': window.location.origin
        },
        events: {
          'onReady': (event) => {
            isYTInitializing.value = false;
            playerStatusLog.value = "YouTube 플레이어 준비 완료";
            event.target.setVolume(activeMedia.value?.volume || 50)
            event.target.playVideo()
          },
          'onError': (error) => {
            isYTInitializing.value = false;
            playerStatusLog.value = `YouTube 에러 발생: ${error.data}`;
            console.error('YT Error:', error);
          },
          'onStateChange': (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              playerStatusLog.value = "재생 중...";
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              playerStatusLog.value = "일시 정지됨";
            } else if (event.data === window.YT.PlayerState.ENDED) {
              playerStatusLog.value = "재생 완료";
              if (activeMedia.value) {
                closePlayer(activeMedia.value.id);
              }
            }
          }
        }
      })
    }
  })
}

const updateScheduler = async () => {
  if (!isSystemActive.value) return;

  const now = new Date()
  const days = ["일", "월", "화", "수", "목", "금", "토"]
  const today = days[now.getDay()]
  const h = now.getHours()
  const m = now.getMinutes()
  const nowScore = h * 60 + m
  
  let candidates = []

  for (const res of reservations.value) {
    if (res.playDays && res.playDays.includes(today)) {
      const startScore = res.startHour * 60 + res.startMinute
      const endScore = res.endHour * 60 + res.endMinute
      const rid = Number(res.id)

      if (nowScore >= startScore && nowScore < endScore) {
        if (!dismissedIds.value.has(rid)) {
          res.status = '플레이중'
          const type = (res.mediaContent.includes('youtube.com') || res.mediaContent.includes('youtu.be')) ? 'youtube' : 'audio'
          candidates.push({ rid, res, type, priority: type === 'audio' ? 2 : 1 })
        } else {
          res.status = '완료'
        }
      } else {
        dismissedIds.value.delete(rid)
        if (nowScore >= endScore) res.status = '완료'
        else res.status = '대기'
      }
    }
  }

  // --- Decision Logic ---
  let bestCandidate = null
  if (candidates.length > 0) {
    // Sort by priority (audio > youtube), then by start time (earliest wins)
    candidates.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      const aStart = a.res.startHour * 60 + a.res.startMinute
      const bStart = b.res.startHour * 60 + b.res.startMinute
      return aStart - bStart
    })
    bestCandidate = candidates[0]
  }

  if (bestCandidate) {
    const { rid, res, type } = bestCandidate
    
    // If it's a new media or we need to refresh
    if (!activeMedia.value || activeMedia.value.id !== rid) {
      // HANDLE INTERRUPTION: If current is YouTube and new is Audio, save the YouTube state
      if (activeMedia.value?.type === 'youtube' && type === 'audio') {
        isAudioInterrupted.value = true
        interruptedYTMedia.value = { ...activeMedia.value }
        if (ytPlayer.value?.pauseVideo) {
          ytPlayer.value.pauseVideo()
          playerStatusLog.value = "YouTube interrupted by Audio reservation..."
        }
      } else {
        // Normal switch: Stop existing players
        if (activeMedia.value?.type === 'audio' && audioPlayer.value) {
          audioPlayer.value.pause()
          audioPlayer.value.src = ""
        }
        if (activeMedia.value?.type === 'youtube' && ytPlayer.value?.pauseVideo) {
          ytPlayer.value.pauseVideo()
        }
        isAudioInterrupted.value = false
        interruptedYTMedia.value = null
      }

      let finalContent = res.mediaContent
      if (res.mediaContent.startsWith('db://')) {
        const fileName = res.mediaContent.replace('db://', '')
        const blob = await getMusicFile(fileName)
        if (blob) {
          revokeBlobUrl()
          currentBlobUrl.value = URL.createObjectURL(blob)
          finalContent = currentBlobUrl.value
        }
      }

      activeMedia.value = {
        id: rid,
        title: res.title,
        content: finalContent,
        volume: res.volume,
        type: type,
        originalContent: res.mediaContent
      }

      if (type === 'youtube') {
        const videoId = getYouTubeId(res.mediaContent)
        initYTPlayer(videoId)
      }
    }
  } else {
    // --- NO CANDIDATES: CHECK FOR RESUMPTION ---
    if (isAudioInterrupted.value && interruptedYTMedia.value) {
      const ytToResume = interruptedYTMedia.value
      const res = reservations.value.find(r => r.id === ytToResume.id)
      
      // Check if the original YouTube reservation is still valid for the current time
      if (res) {
        const startScore = res.startHour * 60 + res.startMinute
        const endScore = res.endHour * 60 + res.endMinute
        if (nowScore >= startScore && nowScore < endScore) {
          playerStatusLog.value = "Resuming interrupted YouTube..."
          activeMedia.value = ytToResume
          isAudioInterrupted.value = false
          interruptedYTMedia.value = null
          nextTick(() => {
            if (ytPlayer.value?.playVideo) {
              ytPlayer.value.playVideo()
            }
          })
          return // Exit early
        }
      }
    }

    // --- STOP ALL MEDIA IF NO RESUMPTION ---
    if (activeMedia.value) {
      if (activeMedia.value.type === 'audio' && audioPlayer.value) {
        audioPlayer.value.pause()
        audioPlayer.value.src = ""
      }
      if (activeMedia.value.type === 'youtube' && ytPlayer.value?.stopVideo) {
        ytPlayer.value.stopVideo()
      }
      revokeBlobUrl()
      activeMedia.value = null
    }
    isAudioInterrupted.value = false
    interruptedYTMedia.value = null
  }
}

const onAudioEnded = () => {
  const finishedId = activeMedia.value?.id;
  
  if (finishedId) {
    dismissedIds.value.add(finishedId);
    const index = reservations.value.findIndex(r => Number(r.id) === finishedId);
    if (index !== -1) {
      reservations.value[index].status = '완료';
      saveReservationsToStorage();
    }
  }

  // Handle immediate resumption if audio file ends during its scheduled time
  if (isAudioInterrupted.value && interruptedYTMedia.value) {
    const ytToResume = interruptedYTMedia.value
    const res = reservations.value.find(r => r.id === ytToResume.id)

    let shouldResume = false
    if (res) {
      const now = new Date()
      const h = now.getHours()
      const m = now.getMinutes()
      const nowScore = h * 60 + m
      const startScore = res.startHour * 60 + res.startMinute
      const endScore = res.endHour * 60 + res.endMinute
      if (nowScore >= startScore && nowScore < endScore) {
        shouldResume = true
      }
    }

    if (shouldResume) {
      playerStatusLog.value = "Audio ended. Resuming YouTube...";
      isAudioInterrupted.value = false
      activeMedia.value = ytToResume
      interruptedYTMedia.value = null
      
      nextTick(() => {
        if (ytPlayer.value && typeof ytPlayer.value.playVideo === 'function') {
          ytPlayer.value.setVolume(ytToResume.volume || 50)
          ytPlayer.value.playVideo()
        }
      })
    } else {
      playerStatusLog.value = "Interrupted YouTube is no longer valid. Stopping."
      isAudioInterrupted.value = false
      interruptedYTMedia.value = null
      activeMedia.value = null
      if (ytPlayer.value?.stopVideo) ytPlayer.value.stopVideo()
      revokeBlobUrl()
    }
  } else {
    activeMedia.value = null
    revokeBlobUrl()
  }
}

watch(activeMedia, (newMedia) => {
  if (newMedia && newMedia.type === 'audio' && audioPlayer.value) {
    audioPlayer.value.volume = (newMedia.volume || 50) / 100
  }
})

const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<style scoped>
.app-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* --- YouTube Cinema Player --- */
.yt-cinema {
  position: fixed;
  bottom: 25px;
  right: 25px;
  width: 420px;
  z-index: 1000;
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.yt-frame {
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 15px rgba(67, 97, 238, 0.3);
  border: 1px solid #333;
}

/* --- Music Mini Player --- */
.audio-mini-player {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.audio-card {
  display: flex;
  align-items: center;
  background: rgba(26, 26, 26, 0.85);
  backdrop-filter: blur(15px);
  padding: 12px 20px;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
  gap: 15px;
  min-width: 500px;
}

.audio-disc {
  width: 50px;
  height: 50px;
  background: #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: 2px solid #555;
  animation: spin 3s linear infinite;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.audio-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.audio-title {
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.audio-controls-row audio {
  height: 30px;
  width: 100%;
  filter: invert(100%) hue-rotate(180deg) brightness(1.5); /* Make default audio player look better on dark */
}

.audio-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: #aaa;
}

.audio-close-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
}

.audio-close-btn:hover {
  background: rgba(255,0,0,0.4);
}

.player-header {
  padding: 10px 16px;
  background: #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.player-title {
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
}

.btn-close-player {
  background: none;
  border: none;
  color: #777;
  font-size: 1.4rem;
  cursor: pointer;
  line-height: 1;
}

.btn-close-player:hover {
  color: #ff4d4d;
}

.video-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  background: #000;
}

.video-wrapper #yt-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.player-info {
  padding: 8px 12px;
  background: #111;
  color: #888;
  font-size: 0.7rem;
  display: flex;
  justify-content: space-between;
}

.activation-required {
  background: var(--bg-hover);
  border: 2px dashed var(--border-color);
  padding: 30px;
  border-radius: 12px;
  text-align: center;
}

.activation-required p {
  margin-top: 15px;
  color: var(--text-medium);
  font-size: 0.9rem;
}

.status-log {
  font-family: monospace;
  color: #4cc9f0;
  margin-bottom: 4px;
  font-size: 0.7rem;
}

.btn-lg {
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: bold;
}
</style>
