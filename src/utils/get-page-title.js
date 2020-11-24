import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Gold Digger'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
