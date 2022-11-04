import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { NearestFilter } from 'three'
import gsap from 'gsap'

//Load Textures
const textureLoader = new THREE.TextureLoader()
const toonGradientMap = textureLoader.load('/textures/gradient/3.jpg')

// Debug
const gui = new dat.GUI()
gui.hide()
const param = {
    color: 0x48fcf1,
    textColor: '#CF4404'
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Materials
const material = new THREE.MeshToonMaterial()
material.color.set(param.color)
material.gradientMap = toonGradientMap
material.gradientMap.magFilter = NearestFilter

// Mesh
const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(1, 0.4, 16, 60),
    material)

const cone = new THREE.Mesh(new THREE.ConeBufferGeometry(1, 2, 32),
    material)

const torusKnot = new THREE.Mesh(new THREE.TorusKnotBufferGeometry(0.8, 0.35, 100, 16),
    material)

torus.position.x = 2
cone.position.x = - 2
torusKnot.position.x = 2

const objectsDistance = 4

torus.position.y = - objectsDistance * 0
cone.position.y = - objectsDistance * 1
torusKnot.position.y = - objectsDistance * 2
scene.add(torus, cone, torusKnot)

const sectionMeshes = [torus, cone, torusKnot]

/**
 * Particles
 */
// Particle Geometry
const particleCount = 800
const particlesPostion = new Float32Array(particleCount * 3)

for (let i = 0; i < particleCount; i++) {
    particlesPostion[i * 3 + 0] = (Math.random() - 0.5) * 15
    particlesPostion[i * 3 + 1] = -(Math.random() * objectsDistance * (sectionMeshes.length + 1)) + objectsDistance
    particlesPostion[i * 3 + 2] = (Math.random() - 0.5) * 15
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPostion, 3))

// Particles Material
const particlesMaterial = new THREE.PointsMaterial({
    color: param.color,
    sizeAttenuation: true,
    size: 0.03
})

// Particles Mesh
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Lights

const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Camera Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    let newSection = Math.round(scrollY / sizes.height)

    if (currentSection != newSection) {
        currentSection = newSection
        gsap.to
            (
                sectionMeshes[currentSection].rotation,
                {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    x: '+=6',
                    y: '+=3',
                    z: '+=1.5'
                }
            )
    }


})

/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
})

/**
 * GUI
 */
const creativeDeveloper = document.querySelector('.creativeText')
gui.addColor(param, 'color').onChange((data) => {
    material.color.set(data)
    // particlesMaterial.color.set(data)
})
// gui.addColor(param, 'textColor').onChange((data) => {

//     param.textColor = '#' + data.toString(16)
//     creativeDeveloper.style.color = param.textColor

// })
// creativeDeveloper.style.color = '#100'
// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

/**
 * Animate colors
 */
const hexValues = '0123456789abcdef'
const changeColors = () => {
    let newColor = '#'
    for (let i = 0; i < 6; i++) {
        newColor += hexValues[Math.round(Math.random() * (hexValues.length - 1))]
    }
    // console.log(newColor)
    creativeDeveloper.style.color = newColor
}
setInterval(changeColors, 5000)

const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update objects
    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    cameraGroup.position.y = -(scrollY / sizes.height) * objectsDistance

    // Parallax
    const parallaxX = (cursor.x * 0.5 - camera.position.x) * 5 * deltaTime
    const parallaxY = (cursor.y * 0.5 - camera.position.y) * 5 * deltaTime

    camera.position.x += parallaxX
    camera.position.y += parallaxY

    // Change Colors
    // material.color.set(changeColors())

    // Update Orbital Controls
    // controls.update()
    // const timeHex = Math.round(elapsedTime * 20).toString(16)
    // const prefix = ''
    // switch (newTextColor.length) {
    //     case 1:
    //         prefix = '#00000'
    //         break;

    //     default:
    //         break;
    // }
    // const padCount = 6 - timeHex.length
    // const newC = '#' + timeHex.padStart(6, 'f')
    // // console.log(newC)
    // creativeDeveloper.style.color = newC

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()