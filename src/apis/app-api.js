const openBrowser = async function (url) {
  window.open(url)
}

const getRecentComic = async function () {
  try {
    const list = JSON.parse(localStorage.getItem('picable:recent-comic-id') || []) || []
    if (!Array.isArray(list)) {
      return []
    }
    return list
  } catch {
    return []
  }
}

const recordRecentComic = async function (comicId) {
  const currentRecentComicIdList = await getRecentComic()
  currentRecentComicIdList.reverse()
  const recentComicIdSet = new Set(currentRecentComicIdList)
  recentComicIdSet.delete(comicId)
  recentComicIdSet.add(comicId)
  const recentComicIdList = Array.from(recentComicIdSet).reverse()
  localStorage.setItem('picable:recent-comic-id', JSON.stringify(recentComicIdList))
}

const getRememberAccount = async function () {
  try {
    const list = JSON.parse(localStorage.getItem('picable:remember-account') || []) || []
    if (!Array.isArray(list)) {
      return []
    }
    return list.filter(item => item.username && item.password)
  } catch {
    return []
  }
}

const updateRememberAccount = async function (_nextList) {
  // ensure no repeat
  const nextList = Array.from(new Set(_nextList))
  localStorage.setItem('picable:remember-account', JSON.stringify(nextList))
}

export {
  openBrowser, getRecentComic,
  recordRecentComic,
  updateRememberAccount, getRememberAccount
}
