const isProd = process.env.NODE_ENV === 'production'

export default {
  baseURL: isProd ? 'https://picaapi.picable.top/pica-api' : 'http://localhost:3000/pica-api',
  diversionInitURL: isProd ? 'https://picaapi.picable.top/diversion-init-api/init' : 'http://localhost:3000/diversion-init-api/init',
  postBaseURL: 'https://post-api.wikawika.xyz/',
  accept: 'application/vnd.picacomic.com.v1+json',
  apiKey: 'C69BAF41DA5ABD1FFEDC6D2FEA56B',
  shaKey: '~d}$Q7$eIni=V)9\\RK/P.RM4;9[7|@/CA}b~OW!3?EV`:<>M7pddUBL5n|0/*Cn',
  'app-channel': '1',
  'app-version': '2.2.1.3.3.4',
  'app-uuid': 'defaultUuid',
  'image-quality': 'original',
  'app-platform': 'android',
  'app-build-version': '45',
  'Content-Type': 'application/json; charset=UTF-8'
}
