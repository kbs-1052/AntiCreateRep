<script setup>
defineProps({
  title: String,
  value: [String, Number],
  subtitle: String,
  type: {
    type: String,
    default: 'default'
  },
  trend: String // 'up', 'down', 'neutral'
})
</script>

<template>
  <div class="glass-card stat-card" :class="`card-${type}`">
    <div class="card-header">
      <span class="text-xs text-muted font-bold uppercase">{{ title }}</span>
      <div v-if="trend" class="trend-badge" :class="trend">
        <svg v-if="trend === 'up'" viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
        <svg v-if="trend === 'down'" viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
      </div>
    </div>
    
    <div class="card-body">
      <div class="stat-value">{{ value }}</div>
      <div class="stat-subtitle text-xs text-muted">{{ subtitle }}</div>
    </div>

    <!-- Decorative chart-like line (simplified) -->
    <div class="card-footer">
      <div class="mini-chart">
        <div class="chart-line" :style="{ background: type === 'primary' ? 'var(--primary)' : 'var(--secondary)' }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 180px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.25rem 0;
}

.trend-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.trend-badge.up { background: rgba(16, 185, 129, 0.1); color: var(--primary); }
.trend-badge.down { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.mini-chart {
  height: 4px;
  background: #f3f4f6;
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.chart-line {
  height: 100%;
  width: 60%;
  border-radius: 2px;
}
</style>
