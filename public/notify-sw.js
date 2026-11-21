self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const open = list.find((client) => client.url.startsWith(self.location.origin))
      if (open) return open.focus()
      return self.clients.openWindow('/dashboard')
    })
  )
})
