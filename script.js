const buttonGetSignal = document.getElementById("get-signal")
const loadingSignal = document.getElementById("loading")
const screenStart = document.getElementById("screenStart")
const signal = document.getElementById("canvas")
const buttonChoseTraps = document.getElementById("chose-traps")
const selectIndex = document.getElementById("select-index")
const percentChance = document.getElementById("percent-chance")
const mainScreen = document.getElementById("main-screen")
const trapsScreen = document.getElementById("traps-screen")

// Free signals counter logic - Changed from 15 to 8
let freeSignalsCount = Number.parseInt(localStorage.getItem("free_signals_count")) || 8

function updateSignalsCounter() {
  const counterElement = document.getElementById("signals-count")
  if (counterElement) {
    counterElement.textContent = freeSignalsCount

    // Change color when low (changed threshold to 3)
    if (freeSignalsCount <= 3) {
      counterElement.style.color = "#ff4757"
    } else {
      counterElement.style.color = "#00ff88"
    }
  }

  // Save to localStorage
  localStorage.setItem("free_signals_count", freeSignalsCount.toString())
}

function decreaseSignalsCounter() {
  const botUpgraded = localStorage.getItem("bot_upgraded")

  // Don't decrease if bot is upgraded
  if (botUpgraded === "true") {
    return true
  }

  if (freeSignalsCount > 0) {
    freeSignalsCount--
    updateSignalsCounter()
    return true
  } else {
    // Show upgrade modal when signals are finished
    document.getElementById("upgrade-modal").style.display = "flex"
    return false
  }
}

function showInsufficientFundsScreen() {
  document.getElementById("insufficient-funds-modal").style.display = "flex"
}

function hideInsufficientFundsModal() {
  document.getElementById("insufficient-funds-modal").style.display = "none"
}

// Make sure the button click handler is properly set
document.addEventListener("DOMContentLoaded", () => {
  const getSignalButton = document.getElementById("get-signal")
  if (getSignalButton) {
    getSignalButton.onclick = getSignal
  }

  // Initialize counter
  const botUpgraded = localStorage.getItem("bot_upgraded")
  if (botUpgraded === "true") {
    freeSignalsCount = 999
  }
  updateSignalsCounter()
})

function getSignal() {
  if (
    !signal ||
    !screenStart ||
    !loadingSignal ||
    !buttonGetSignal ||
    !percentChance ||
    !selectIndex ||
    !mainScreen ||
    !trapsScreen
  ) {
    return
  }

  // Check if user has free signals left - THIS IS THE KEY FIX
  if (!decreaseSignalsCounter()) {
    return // Stop if no signals left
  }

  signal.classList.add("deactive")
  screenStart.classList.add("deactive")
  loadingSignal.classList.remove("deactive")
  buttonGetSignal.disabled = true

  mainScreen.style.display = ""
  trapsScreen.style.display = "none"

  percentChance.textContent = "CHANCE: " + getRandomNumber() + "%"
  percentChance.style.display = ""

  setTimeout(() => {
    if (!loadingSignal || !signal || !buttonGetSignal || !selectIndex) return
    loadingSignal.classList.add("deactive")
    signal.classList.remove("deactive")
    buttonGetSignal.disabled = false

    // Вызываем handleScenario из CanvasMines.js
    if (window.handleScenario) {
      window.handleScenario(Number(selectIndex.textContent))
    }
  }, 3000)
}

function handleClick(element) {
  if (!selectIndex) return
  const value = element.querySelector("a").innerText
  selectIndex.textContent = value
  getSignal()
}

function getRandomNumber() {
  return (Math.random() * (95 - 80) + 80).toFixed(2)
}

function activeTrapsScreen() {
  if (!mainScreen || !trapsScreen) return

  if (mainScreen.style.display === "none") {
    mainScreen.style.display = ""
    trapsScreen.style.display = "none"
  } else {
    mainScreen.style.display = "none"
    trapsScreen.style.display = ""
  }
}

// Initialize counter on page load and when main game starts
window.addEventListener("load", () => {
  const botUnlocked = localStorage.getItem("bot_unlocked")
  const accountVerified = localStorage.getItem("account_verified")
  const botUpgraded = localStorage.getItem("bot_upgraded")

  // If bot is upgraded, set unlimited signals
  if (botUpgraded === "true") {
    freeSignalsCount = 999
  }

  updateSignalsCounter()
})
