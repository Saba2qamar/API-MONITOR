// ============================================
// CIRCUIT BREAKER
// Teen states: CLOSED, OPEN, HALF_OPEN
// ============================================

const STATE = {
  CLOSED: 'CLOSED',       // sab theek — requests ja rahi hain
  OPEN: 'OPEN',           // kuch fail hua — requests BLOCK
  HALF_OPEN: 'HALF_OPEN', // test mode — ek request jaane do
}

class CircuitBreaker {
  constructor(options = {}) {
    this.state = STATE.CLOSED
    this.failureCount = 0
    this.successCount = 0
    this.lastFailureTime = null

    // Kitni failures ke baad OPEN ho jaaye
    this.failureThreshold = options.failureThreshold || 5

    // Kitne time baad HALF_OPEN try kare (ms)
    this.recoveryTimeout = options.recoveryTimeout || 10000

    // HALF_OPEN mein kitni success chahiye CLOSED hone ke liye
    this.successThreshold = options.successThreshold || 2
  }

  // Current state check karo
  getState() {
    // Agar OPEN hai aur recovery time aa gaya — HALF_OPEN karo
    if (
      this.state === STATE.OPEN &&
      Date.now() - this.lastFailureTime >= this.recoveryTimeout
    ) {
      console.log('[CircuitBreaker] OPEN → HALF_OPEN (recovery attempt)')
      this.state = STATE.HALF_OPEN
      this.successCount = 0
    }
    return this.state
  }

  // Request allow karo ya nahi
  allowRequest() {
    const state = this.getState()

    if (state === STATE.CLOSED) return true
    if (state === STATE.HALF_OPEN) return true
    if (state === STATE.OPEN) {
      console.log('[CircuitBreaker] ❌ Request BLOCKED — circuit is OPEN')
      return false
    }
  }

  // Jab request SUCCESS ho
  onSuccess() {
    if (this.state === STATE.HALF_OPEN) {
      this.successCount++
      console.log(`[CircuitBreaker] HALF_OPEN success ${this.successCount}/${this.successThreshold}`)

      if (this.successCount >= this.successThreshold) {
        this.state = STATE.CLOSED
        this.failureCount = 0
        this.successCount = 0
        console.log('[CircuitBreaker] ✅ HALF_OPEN → CLOSED (recovered!)')
      }
    } else {
      this.failureCount = 0
    }
  }

  
  onFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()
    console.log(`[CircuitBreaker] ⚠️ Failure ${this.failureCount}/${this.failureThreshold}`)

    if (this.failureCount >= this.failureThreshold) {
      this.state = STATE.OPEN
      console.log('[CircuitBreaker] 🔴 CLOSED → OPEN (too many failures!)')
    }

    if (this.state === STATE.HALF_OPEN) {
      this.state = STATE.OPEN
      this.lastFailureTime = Date.now()
      console.log('[CircuitBreaker] 🔴 HALF_OPEN → OPEN (still failing)')
    }
  }

  // Status 
  getStatus() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
    }
  }
}


const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  recoveryTimeout: 10000,
  successThreshold: 2,
})

module.exports = circuitBreaker