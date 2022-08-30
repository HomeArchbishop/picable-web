import * as uuid from 'uuid'
import CryptoJS from 'crypto-js'
import config from '../../configs'

const apiKey = config.apiKey
const shaKey = config.shaKey

class Header {
  createSignature (url, time, nonce, method) {
    const tmp = url + time + nonce + method + apiKey
    const tmpLower = tmp.toLowerCase()
    try {
      return CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, shaKey).update(tmpLower).finalize().toString()
      // return crypto.createHmac('SHA256', shaKey).update(tmpLower).digest('hex')
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  // url: request url without https://picaapi.picacomic.com/
  // method: choose one from methods[] array
  constructor (url, method, auth) {
    const time = (Date.now() / 1000).toFixed(0)
    const nonce = uuid.v4().replace(/-/g, '')
    this.headers = {
      time,
      nonce,
      accept: config.accept,
      signature: this.createSignature(url, time, nonce, method),
      // host: 'picaapi.picacomic.com',  // TODO solve ths HOST safety problem
      authorization: auth,
      token: auth,
      'app-channel': config['app-channel'],
      'api-key': apiKey,
      'app-version': config['app-version'],
      'app-uuid': config['app-uuid'],
      'image-quality': config['image-quality'],
      'app-platform': config['app-platform'],
      'app-build-version': config['app-build-version'],
      // 'User-Agent': 'okhttp/3.8.1',
      'Content-Type': config['Content-Type']
    }
  }
}

export default Header
