export const formatTime = (duration: number) => {
  const pad = (num: number) => num.toString().padStart(2, '0')
  let totalSeconds = Math.floor(duration / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export const formatSize = (size: number) => {
  return (size / 1024 / 1024).toFixed(2)
}
