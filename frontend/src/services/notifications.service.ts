type NotificationType = 'success' | 'error' | 'info'

export const notify = (message: string, type: NotificationType = 'info') => {
  const bgColor =
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    'bg-blue-500'

  const notification = document.createElement('div')
  notification.className = `${bgColor} text-white px-4 py-2 rounded fixed top-4 right-4 z-50 shadow-lg`
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    document.body.removeChild(notification)
  }, 4000)
}
