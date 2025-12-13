<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

const container = ref()
let scene
let camera
let renderer
let character
let animationId

onMounted(() => {
  if (!container.value) return

  // Scene setup
  scene = new THREE.Scene()

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    50,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    100,
  )
  camera.position.set(0, 1, 4)
  camera.lookAt(0, 1, 0)

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0x000000, 0) // Transparent background
  container.value.appendChild(renderer.domElement)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 7.5)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  const backLight = new THREE.DirectionalLight(0x6699ff, 0.3)
  backLight.position.set(-5, 5, -5)
  scene.add(backLight)

  // Create character
  createCharacter()

  // Animation loop
  let time = 0
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    time += 0.01

    if (character) {
      // Bouncing motion
      character.position.y = Math.sin(time * 2) * 0.15

      // Gentle rotation
      character.rotation.y = Math.sin(time * 0.5) * 0.2

      // Arm swinging
      const leftArm = character.getObjectByName('leftArm')
      const rightArm = character.getObjectByName('rightArm')
      if (leftArm) {
        leftArm.rotation.z = -Math.PI / 4 + Math.sin(time * 2) * 0.2
      }
      if (rightArm) {
        rightArm.rotation.z = Math.PI / 4 - Math.sin(time * 2) * 0.2
      }
    }

    renderer.render(scene, camera)
  }
  animate()

  // Handle resize
  const handleResize = () => {
    if (!container.value) return
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  }
  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    if (renderer) {
      renderer.dispose()
    }
  })
})

function createCharacter() {
  character = new THREE.Group()
  character.position.y = 1

  // Head
  const headGeometry = new THREE.SphereGeometry(0.4, 32, 32)
  const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.4,
    metalness: 0.1,
  })
  const head = new THREE.Mesh(headGeometry, headMaterial)
  head.position.y = 0.6
  head.castShadow = true
  character.add(head)

  // Eyes
  const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16)
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1,
  })

  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
  leftEye.position.set(-0.15, 0.7, 0.35)
  character.add(leftEye)

  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
  rightEye.position.set(0.15, 0.7, 0.35)
  character.add(rightEye)

  // Pupils
  const pupilGeometry = new THREE.SphereGeometry(0.04, 16, 16)
  const pupilMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.3,
  })

  const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
  leftPupil.position.set(-0.15, 0.7, 0.42)
  character.add(leftPupil)

  const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial)
  rightPupil.position.set(0.15, 0.7, 0.42)
  character.add(rightPupil)

  // Mouth (using torus for smile)
  const mouthGeometry = new THREE.TorusGeometry(0.12, 0.02, 8, 50, Math.PI)
  const mouthMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.5,
  })
  const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial)
  mouth.position.set(0, 0.5, 0.38)
  mouth.rotation.x = Math.PI
  character.add(mouth)

  // Body
  const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.6, 16, 32)
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a90e2,
    roughness: 0.4,
    metalness: 0.1,
  })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.y = -0.1
  body.castShadow = true
  character.add(body)

  // Arms
  const armGeometry = new THREE.CapsuleGeometry(0.08, 0.4, 8, 16)
  const armMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.4,
    metalness: 0.1,
  })

  const leftArm = new THREE.Mesh(armGeometry, armMaterial)
  leftArm.name = 'leftArm'
  leftArm.position.set(-0.4, 0.1, 0)
  leftArm.rotation.z = -Math.PI / 4
  leftArm.castShadow = true
  character.add(leftArm)

  const rightArm = new THREE.Mesh(armGeometry, armMaterial)
  rightArm.name = 'rightArm'
  rightArm.position.set(0.4, 0.1, 0)
  rightArm.rotation.z = Math.PI / 4
  rightArm.castShadow = true
  character.add(rightArm)

  // Legs
  const legGeometry = new THREE.CapsuleGeometry(0.1, 0.5, 8, 16)
  const legMaterial = new THREE.MeshStandardMaterial({
    color: 0xe74c3c,
    roughness: 0.4,
    metalness: 0.1,
  })

  const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
  leftLeg.position.set(-0.15, -0.65, 0)
  leftLeg.castShadow = true
  character.add(leftLeg)

  const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
  rightLeg.position.set(0.15, -0.65, 0)
  rightLeg.castShadow = true
  character.add(rightLeg)

  scene.add(character)
}
</script>

<template>
  <div ref="container" class="three-container"></div>
</template>

<style scoped>
.three-container {
  width: 100%;
  height: 250px;
  margin: 0 auto;
}
</style>
