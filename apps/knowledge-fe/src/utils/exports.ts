export function download_html(html: string, filename = 'document.html') {
  const blob = new Blob([html], { type: 'text/html' })

  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
}

export function open_html(html: string) {
  const new_window = window.open('', '_blank') as Window
  new_window?.focus()
  new_window.document.write(html)
}
