import { isArray } from 'lodash'

import config from '../configs'
import axios from 'axios'

async function getDiversionUrlList () {
  const requestData = (await axios.get(config.diversionInitURL)).data // this URL needn't to resolve protocol
  const otherDiversionList = isArray(requestData.addresses)
    ? requestData.addresses.map(ip => `http://${ip}/`)
    : []
  const fullList = [config.baseURL, ...otherDiversionList]
  return fullList
}

export {
  getDiversionUrlList
}
