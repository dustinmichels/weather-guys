<script setup lang="ts"></script>

<template>
  <div class="character-container">
    <div class="character">
      <!-- Head -->
      <div class="head">
        <!-- Eyes -->
        <div class="eyes">
          <div class="eye left-eye">
            <div class="pupil"></div>
          </div>
          <div class="eye right-eye">
            <div class="pupil"></div>
          </div>
        </div>
        <!-- Mouth -->
        <div class="mouth"></div>
      </div>
      <!-- Body -->
      <div class="body"></div>
      <!-- Arms -->
      <div class="arms">
        <div class="arm left-arm"></div>
        <div class="arm right-arm"></div>
      </div>
      <!-- Legs -->
      <div class="legs">
        <div class="leg left-leg"></div>
        <div class="leg right-leg"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
}

.character {
  position: relative;
  animation: bounce 2s ease-in-out infinite;
}

/* Bounce animation */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* Head */
.head {
  position: relative;
  width: 80px;
  height: 80px;
  background-color: #ffd700;
  border-radius: 50%;
  border: 3px solid #333;
  margin: 0 auto;
  z-index: 2;
}

/* Eyes */
.eyes {
  display: flex;
  justify-content: space-around;
  padding: 20px 15px 0;
}

.eye {
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  border: 2px solid #333;
  position: relative;
}

.pupil {
  width: 8px;
  height: 8px;
  background-color: #333;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Mouth */
.mouth {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 15px;
  border: 2px solid #333;
  border-top: none;
  border-radius: 0 0 30px 30px;
}

/* Body */
.body {
  width: 60px;
  height: 70px;
  background-color: #4a90e2;
  border-radius: 30px 30px 20px 20px;
  border: 3px solid #333;
  margin: -5px auto 0;
  position: relative;
  z-index: 1;
}

/* Arms */
.arms {
  position: absolute;
  top: 85px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
}

.arm {
  width: 30px;
  height: 8px;
  background-color: #ffd700;
  border: 2px solid #333;
  border-radius: 10px;
  position: absolute;
}

.left-arm {
  left: -20px;
  top: 10px;
  transform: rotate(-30deg);
}

.right-arm {
  right: -20px;
  top: 10px;
  transform: rotate(30deg);
}

/* Legs */
.legs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: -5px;
}

.leg {
  width: 20px;
  height: 35px;
  background-color: #e74c3c;
  border: 3px solid #333;
  border-radius: 0 0 10px 10px;
}
</style>
