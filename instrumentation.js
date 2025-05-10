export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // This is a no-op for now, but satisfies the instrumentation requirement
    console.log('Instrumentation registered');
  }
} 