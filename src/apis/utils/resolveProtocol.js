// const isProd = process.env.NODE_ENV === 'production'
export const resolveProtocol = function (host) {
  const result = new URL(host)
  // result.protocol = isProd ? 'https' : 'http'
  return result.href
}
