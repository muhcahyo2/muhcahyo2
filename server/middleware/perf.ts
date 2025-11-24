export default defineEventHandler((event) => {
  const start = performance.now()
  
  event.node.res.on('finish', () => {
    const end = performance.now()
    const duration = (end - start).toFixed(2)
    console.log(`[Perf] Request ${event.path} took ${duration}ms`)
  })
})