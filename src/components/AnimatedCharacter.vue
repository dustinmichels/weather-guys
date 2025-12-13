<script setup></script>

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
  transform-style: preserve-3d;
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
  background: radial-gradient(
    circle at 30% 30%,
    #ffed4e,
    #ffd700 40%,
    #f4c430 70%,
    #daa520 100%
  );
  border-radius: 50%;
  border: 3px solid #333;
  margin: 0 auto;
  z-index: 2;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
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
  background: radial-gradient(circle at 35% 35%, #ffffff, #f5f5f5 50%, #d0d0d0 100%);
  border-radius: 50%;
  border: 2px solid #333;
  position: relative;
}

.pupil {
  width: 8px;
  height: 8px;
  background: radial-gradient(circle at 35% 35%, #4a4a4a, #2a2a2a 50%, #000000 100%);
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
  background: radial-gradient(ellipse at center, rgba(200, 0, 0, 0.3), transparent);
  box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.2);
}

/* Body */
.body {
  width: 60px;
  height: 70px;
  background: radial-gradient(
    ellipse at 30% 25%,
    #6db3ff,
    #5ba3f5 30%,
    #4a90e2 60%,
    #3574b8 100%
  );
  border-radius: 30px 30px 20px 20px;
  border: 3px solid #333;
  margin: -5px auto 0;
  position: relative;
  z-index: 1;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
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
  background: radial-gradient(
    ellipse at 30% 40%,
    #ffed4e,
    #ffd700 50%,
    #e6c200 100%
  );
  border: 2px solid #333;
  border-radius: 10px;
  position: absolute;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
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
  background: radial-gradient(
    ellipse at 35% 20%,
    #ff7b6a,
    #ff6b5a 40%,
    #e74c3c 70%,
    #c0392b 100%
  );
  border: 3px solid #333;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
}
</style>
