import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaCloudSun, 
  FaUser, 
  FaGlobe, 
  FaCalendarAlt,
  FaHeart,
  FaStar,
  FaMoon,
  FaCode
} from 'react-icons/fa'
import './App.css'

// 导入配置文件
import { 
  personalInfo, 
  socialLinks, 
  defaultBackground,
  hobbies,
  techStack,
  projects,
  footerConfig,
  apiConfig,
  effectsConfig
} from './config'

// 定义类型
interface QQMapIPInfo {
  status: number
  message: string
  result: {
    ip: string
    location: {
      lng: number
      lat: number
    }
    ad_info: {
      nation: string
      province: string
      city: string
      district: string
      adcode: string
    }
  }
}

interface WelcomeInfo {
  address: string
  welcomeText: string
  distance: number
  ip: string
  timeGreeting: string
}

interface WeatherInfo {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
}

// 本地存储工具
const saveToLocal = {
  get: (key: string) => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        const parsed = JSON.parse(value);
        if (parsed.expire && Date.now() > parsed.expire) {
          localStorage.removeItem(key);
          return null;
        }
        return parsed.data;
      }
      return null;
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return null;
    }
  },
  set: (key: string, value: any, hours: number = 24) => {
    try {
      const item = {
        data: value,
        expire: Date.now() + hours * 60 * 60 * 1000
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting to localStorage:', error);
    }
  }
};

function App() {
  // 状态管理
  const [welcomeInfo, setWelcomeInfo] = useState<WelcomeInfo | null>(null)
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sakuraElements, setSakuraElements] = useState<Array<{id: number, left: string, animationDelay: string, animationDuration: string}>>([])
  const [backgroundImage] = useState<string>(defaultBackground)
  const [showProjectsModal, setShowProjectsModal] = useState(false)

  // 根据图标名称获取对应的图标组件
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'heart':
        return <FaHeart />
      case 'star':
        return <FaStar />
      case 'moon':
        return <FaMoon />
      case 'globe':
        return <FaGlobe />
      case 'user':
        return <FaUser />
      case 'clock':
        return <FaClock />
      case 'code':
        return <FaCode />
      default:
        return <FaHeart />
    }
  }

  // 根据经纬度计算两点距离(点1经度,点1纬度,点2经度,点2纬度)
  const getDistance = (e1: number, n1: number, e2: number, n2: number) => {
    const R = 6371
    const { sin, cos, asin, PI, hypot } = Math
    let getPoint = (e: number, n: number) => {
      e *= PI / 180
      n *= PI / 180
      return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) }
    }
    let a = getPoint(e1, n1)
    let b = getPoint(e2, n2)
    let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z)
    let r = asin(c / 2) * 2 * R
    return Math.round(r)
  }

  // 根据国家、省份、城市信息自定义欢迎语
  const showWelcome = (ipStore: QQMapIPInfo) => {
    const IP = ipStore.result.ip || "未知"
    let dist = getDistance(114.531898, 25.777861, ipStore.result.location.lng, ipStore.result.location.lat)
    let address = ''
    let welcome_info = ''

    // 根据国家、省份、城市信息自定义欢迎语
    // 海外地区不支持省份及城市信息
    switch (ipStore.result.ad_info.nation) {
      case "日本":
        welcome_info = "こんにちは、日本から来た友達"
        break
      case "美国":
        welcome_info = "Hello, friend from the United States"
        break
      case "英国":
        welcome_info = "Hello, friend from the UK"
        break
      case "俄罗斯":
        welcome_info = "Здравствуйте, друзья из России."
        break
      case "法国":
        welcome_info = "Bonjour amis de France"
        break
      case "德国":
        welcome_info = "Hallo, Freund aus Deutschland"
        break
      case "澳大利亚":
        welcome_info = "Hello, friend from Australia"
        break
      case "加拿大":
        welcome_info = "Hello, friend from Canada"
        break
      case "中国":
        address = ipStore.result.ad_info.province + " " + ipStore.result.ad_info.city
        switch (ipStore.result.ad_info.province) {
          case "北京市":
            address = "北京市"
            welcome_info = "北——京——欢迎你"
            break
          case "天津市":
            address = "天津市"
            welcome_info = "讲段相声吧"
            break
          case "重庆市":
            address = "重庆市"
            welcome_info = "高德地图:已到达重庆，下面交给百度地图导航"
            break
          case "河北省":
            welcome_info = "山势巍巍成壁垒，天下雄关。铁马金戈由此向，无限江山"
            break
          case "山西省":
            welcome_info = "展开坐具长三尺，已占山河五百余"
            break
          case "内蒙古自治区":
            welcome_info = "天苍苍，野茫茫，风吹草低见牛羊"
            break
          case "辽宁省":
            welcome_info = "我想吃烤鸡架"
            break
          case "吉林省":
            welcome_info = "状元阁就是东北烧烤之王"
            break
          case "黑龙江省":
            welcome_info = "很喜欢哈尔滨大剧院"
            break
          case "上海市":
            address = "上海市"
            welcome_info = "众所周知，中国只有两个城市"
            break
          case "江苏省":
            switch (ipStore.result.ad_info.city) {
              case "南京市":
                welcome_info = "欢迎来自安徽省南京市的小伙伴"
                break
              case "苏州市":
                welcome_info = "上有天堂，下有苏杭"
                break
              case "泰州市":
                welcome_info = "这里也是我的故乡"
                break
              default:
                welcome_info = "散装是必须要散装的"
                break
            }
            break
          case "浙江省":
            welcome_info = "东风渐绿西湖柳，雁已还人未南归"
            break
          case "安徽省":
            welcome_info = "蚌埠住了，芜湖起飞"
            break
          case "福建省":
            welcome_info = "井邑白云间，岩城远带山"
            break
          case "江西省":
            welcome_info = "落霞与孤鹜齐飞，秋水共长天一色"
            break
          case "山东省":
            welcome_info = "遥望齐州九点烟，一泓海水杯中泻"
            break
          case "湖北省":
            welcome_info = "来碗热干面"
            break
          case "湖南省":
            welcome_info = "74751，长沙斯塔克"
            break
          case "广东省":
            welcome_info = "老板来两斤福建人"
            break
          case "广西壮族自治区":
            welcome_info = "桂林山水甲天下"
            break
          case "海南省":
            welcome_info = "朝观日出逐白浪，夕看云起收霞光"
            break
          case "四川省":
            welcome_info = "康康川妹子"
            break
          case "贵州省":
            switch (ipStore.result.ad_info.city) {
              case "六盘水市":
                welcome_info = "凉都六盘水，您好"
                break
              case "贵阳市":
                welcome_info = "爽爽贵阳，您好"
                break
              case "遵义市":
                welcome_info = "遵义红城，您好"
                break
              case "安顺市":
                welcome_info = "安顺福地，您好"
                break
              case "毕节市":
                welcome_info = "毕节山水，您好"
                break
              case "铜仁市":
                welcome_info = "铜仁梵净，您好"
                break
              case "黔西南布依族苗族自治州":
                welcome_info = "黔西南风情，您好"
                break
              case "黔东南苗族侗族自治州":
                welcome_info = "黔东南歌舞，您好"
                break
              case "黔南布依族苗族自治州":
                welcome_info = "黔南美景，您好"
                break
              default:
                welcome_info = "茅台，学生，再塞200"
                break
            }
            break
          case "云南省":
            welcome_info = "玉龙飞舞云缠绕，万仞冰川直耸天"
            break
          case "西藏自治区":
            welcome_info = "躺在茫茫草原上，仰望蓝天"
            break
          case "陕西省":
            welcome_info = "来份臊子面加馍"
            break
          case "甘肃省":
            welcome_info = "羌笛何须怨杨柳，春风不度玉门关"
            break
          case "青海省":
            welcome_info = "牛肉干和老酸奶都好好吃"
            break
          case "宁夏回族自治区":
            welcome_info = "大漠孤烟直，长河落日圆"
            break
          case "新疆维吾尔自治区":
            welcome_info = "驼铃古道丝绸路，胡马犹闻唐汉风"
            break
          case "台湾省":
            welcome_info = "我在这头，大陆在那头"
            break
          case "香港特别行政区":
            address = "香港特别行政区"
            welcome_info = "永定贼有残留地鬼嚎，迎击光非岁玉"
            break
          case "澳门特别行政区":
            address = "澳门特别行政区"
            welcome_info = "性感荷官，在线发牌"
            break
          default:
            welcome_info = "带我去你的城市逛逛吧"
            break
        }
        break
      default:
        welcome_info = "带我去你的国家看看吧"
        break
    }

    // 判断时间
    let timeChange = ''
    let date = new Date()
    if (date.getHours() >= 5 && date.getHours() < 11) timeChange = "🌤️上午好，一日之计在于晨"
    else if (date.getHours() >= 11 && date.getHours() < 13) timeChange = "☀️中午好，该摸鱼吃午饭了"
    else if (date.getHours() >= 13 && date.getHours() < 15) timeChange = "🕞下午好，懒懒地睡个午觉吧"
    else if (date.getHours() >= 15 && date.getHours() < 16) timeChange = "🍵三点几啦，饮茶先啦"
    else if (date.getHours() >= 16 && date.getHours() < 19) timeChange = "🌇夕阳无限好，只是近黄昏"
    else if (date.getHours() >= 19 && date.getHours() < 24) timeChange = "🌔晚上好，夜生活嗨起来"
    else timeChange = "🌌夜深了，早点休息，少熬夜"

    // 设置欢迎信息
    setWelcomeInfo({
      address,
      welcomeText: welcome_info,
      distance: dist,
      ip: IP,
      timeGreeting: timeChange
    })
  }

  // 获取IP信息 - 使用QQ地图API
  const fetchIPInfo = async () => {
    return new Promise<void>((resolve, reject) => {
      let ipLoacation = saveToLocal.get('welcome-info') as QQMapIPInfo | null

      try {
        if (!ipLoacation) {
          var script = document.createElement('script')
          var url = `https://apis.map.qq.com/ws/location/v1/ip?key=${apiConfig.qqMapKey}&output=jsonp`
          script.src = url

          const qqmapCallback = (data: QQMapIPInfo) => {
            if (data.status === 0) {
              ipLoacation = data
              saveToLocal.set('welcome-info', ipLoacation, 0.5)
              showWelcome(ipLoacation)
              resolve()
            } else {
              reject(new Error('Failed to fetch location data: ' + data.message))
            }
            document.body.removeChild(script)
            delete (window as any).QQmap
          }

          ;(window as any).QQmap = qqmapCallback
          document.body.appendChild(script)
        } else {
          showWelcome(ipLoacation)
          resolve()
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        reject(err)
      }
    })
  }

  // 获取天气信息
  const fetchWeatherInfo = async (city: string) => {
    try {
      // 使用配置文件中的WeatherAPI.com key
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiConfig.weatherApiKey}&q=${city}&aqi=no`
      )
      // 转换为我们需要的数据格式
      const weatherData: WeatherInfo = {
        name: response.data.location.name,
        main: {
          temp: response.data.current.temp_c,
          feels_like: response.data.current.feelslike_c,
          humidity: response.data.current.humidity
        },
        weather: [{
          main: response.data.current.condition.text,
          description: response.data.current.condition.text,
          icon: response.data.current.condition.icon
        }],
        wind: {
          speed: response.data.current.wind_kph
        }
      }
      setWeatherInfo(weatherData)
    } catch (err) {
      console.error('Error fetching weather info:', err)
      // 不设置全局错误，只在天气卡片显示
      setWeatherInfo(null)
    }
  }

  // 初始化数据 - 延迟3秒获取IP地址
  useEffect(() => {
    const initData = async () => {
      // 延迟3秒获取IP地址
      setTimeout(async () => {
        await fetchIPInfo()
        // 可以根据welcomeInfo中的城市信息获取天气
        if (welcomeInfo?.address) {
          await fetchWeatherInfo(welcomeInfo.address)
        }
      }, 3000)
      setLoading(false)
    }

    initData()
  }, [welcomeInfo?.address])

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 生成樱花元素
  useEffect(() => {
    if (effectsConfig.enableSakura) {
      // 生成10个樱花元素，优化性能
      const sakura = Array.from({length: 10}, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 10 + 10}s`
      }))
      setSakuraElements(sakura)
    }
  }, [])



  // 根据天气获取对应的图标
  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <FaCloudSun className="weather-icon" style={{ color: '#ffd700' }} />
      case 'clouds':
        return <FaCloudSun className="weather-icon" style={{ color: '#87ceeb' }} />
      case 'rain':
        return <FaCloudSun className="weather-icon" style={{ color: '#4682b4' }} />
      case 'snow':
        return <FaCloudSun className="weather-icon" style={{ color: '#e0ffff' }} />
      default:
        return <FaCloudSun className="weather-icon" style={{ color: '#87ceeb' }} />
    }
  }

  // 设置背景图
  useEffect(() => {
    document.body.style.background = backgroundImage
  }, [backgroundImage])

  if (loading) {
    return <div className="loading">加载中... 请稍候</div>
  }

  return (
    <div className="app-container">


      {/* 樱花飘落效果 */}
      {effectsConfig.enableSakura && sakuraElements.map((sakura) => (
        <div 
          key={sakura.id} 
          className="sakura"
          style={{
            left: sakura.left,
            animationDelay: sakura.animationDelay,
            animationDuration: sakura.animationDuration
          }}
        >
          🌸
        </div>
      ))}

      {/* 装饰元素 */}
      <div className="decorative-element">
        <FaHeart />
      </div>
      <div className="decorative-element">
        <FaStar />
      </div>
      <div className="decorative-element">
        <FaMoon />
      </div>
      <div className="decorative-element">
        <FaHeart />
      </div>



      {/* 主页布局 */}
      <div className="main-layout">
        {/* 左侧区域 */}
        <div className="left-section">
          {/* 头像卡片 */}
          <div className="avatar-card">
            <div className="avatar-container">
              <img 
                src={personalInfo.avatar} 
                alt="头像" 
                className="avatar"
              />
            </div>
            <h2 className="avatar-name">{personalInfo.name}</h2>
            <p className="avatar-title">{personalInfo.title}</p>
          </div>

          {/* 关于我卡片 */}
          <div className="about-card">
            <h3 className="about-title">
              <FaUser /> 关于我
            </h3>
            <div className="about-content">
              {personalInfo.about.map((item, index) => (
                <div key={index} className="about-item">
                  <div className="about-item-icon">
                    {getIconComponent(item.icon)}
                  </div>
                  <div className="about-item-text">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 我的项目卡片 */}
          <div className="projects-card">
            <h3 className="projects-title">
              <FaCode /> 我的项目
            </h3>
            <div className="projects-content">
              {projects.slice(0, 2).map((project, index) => (
                <a key={index} href={project.url} className="project-item-link" target="_blank" rel="noopener noreferrer">
                  <div className="project-item">
                    <div className="project-name">{project.name}</div>
                    <div className="project-description">{project.description}</div>
                  </div>
                </a>
              ))}
            </div>
            {projects.length > 2 && (
              <div className="show-more-container">
                <button 
                  className="show-more-btn"
                  onClick={() => {
                    // 回到页面顶部
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // 显示项目模态框
                    setShowProjectsModal(true);
                  }}
                >
                  显示更多
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 右侧区域 */}
        <div className="right-section">
          {/* 条件渲染：显示项目模态框或原始内容 */}
          {showProjectsModal ? (
            /* 项目模态框 */
            <div className="projects-modal">
              <div className="modal-header">
                <h3 className="modal-title">
                  <FaCode /> 我的项目
                </h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowProjectsModal(false)}
                >
                  返回
                </button>
              </div>
              <div className="modal-content">
                <div className="projects-grid">
                  {projects.map((project, index) => (
                    <a key={index} href={project.url} className="project-modal-link" target="_blank" rel="noopener noreferrer">
                      <div className="project-modal-item">
                        <div className="project-modal-name">{project.name}</div>
                        <div className="project-modal-description">{project.description}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* 原始右侧内容 */
            <>
              {/* IP问候面板 */}
              <div className="ip-greeting-panel">
                <h3 className="card-title">
                  <FaMapMarkerAlt /> 欢迎！
                </h3>
                <div className="card-content">
                  <div className="welcome-container">
                    {/* 左侧：自定义欢迎 */}
                    <div className="welcome-left">
                      {welcomeInfo ? (
                        <div className="welcome-text">
                          <div>🙋 欢迎来自 <strong>{welcomeInfo.address}</strong> 的小伙伴</div>
                          <div>😊 <strong>{welcomeInfo.welcomeText}！</strong></div>
                          <div>🗺️ 您距离 <strong>{personalInfo.name}</strong> 约有 <strong>{welcomeInfo.distance}</strong> 公里！</div>
                          <div className="ip-container">
                            <div className="ip-label">当前IP地址：</div>
                            <div className="ip-value">{welcomeInfo.ip}</div>
                          </div>
                          <div className="time-greeting">
                            {welcomeInfo.timeGreeting}！
                          </div>
                        </div>
                      ) : (
                        <div className="loading">
                          <p>正在获取您的位置信息...</p>
                        </div>
                      )}
                    </div>
                    
                    {/* 中间虚线分隔 */}
                    <div className="welcome-divider"></div>
                    
                    {/* 右侧：时间信息 */}
                    <div className="welcome-right">
                      <div className="time-info">
                        <div className="current-time">
                          {currentTime.toLocaleTimeString()}
                        </div>
                        <div className="current-date">
                          <FaCalendarAlt /> {currentTime.toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            weekday: 'long'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 天气信息 */}
                  {weatherInfo && (
                    <div className="weather-info" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
                      <div className="weather-main">
                        {getWeatherIcon(weatherInfo.weather[0].main)}
                        <div>
                          <div className="weather-temp">{Math.round(weatherInfo.main.temp)}°C</div>
                          <div className="weather-desc">{weatherInfo.weather[0].description}</div>
                        </div>
                      </div>
                      <div className="weather-details">
                        <div>湿度: {weatherInfo.main.humidity}%</div>
                        <div>体感温度: {Math.round(weatherInfo.main.feels_like)}°C</div>
                        <div>风速: {weatherInfo.wind.speed} km/h</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 社交链接卡片 */}
              <div className="social-card">
                <h3 className="social-title">
                  <FaHeart /> 社交链接
                </h3>
                <div className="social-links">
                  {socialLinks.map((link, index) => (
                    <a key={index} href={link.url} className="social-link-item">
                      <div className="social-link-icon">
                        {getIconComponent(link.icon)}
                      </div>
                      <div className="social-link-text">{link.name}</div>
                    </a>
                  ))}
                </div>
              </div>

              {/* 信息卡片 */}
              <div className="info-cards">
                {/* 技术栈卡片 */}
                <div className="card">
                  <h2 className="card-title">
                    <FaGlobe /> 技术栈
                  </h2>
                  <div className="card-content">
                    {techStack.map((item, index) => (
                      <div key={index} className="ip-info-item">
                        <span className="ip-info-label">{item.label}</span>
                        <span className="ip-info-value">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 兴趣爱好卡片 */}
                <div className="card">
                  <h2 className="card-title">
                    <FaHeart /> 兴趣爱好
                  </h2>
                  <div className="card-content">
                    {hobbies.map((item, index) => (
                      <div key={index} className="ip-info-item">
                        <span className="ip-info-label">{item.label}</span>
                        <span className="ip-info-value">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 页脚 */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>{footerConfig.copyright}</p>
            <p>{footerConfig.techStack}</p>
          </div>
          
          {/* 页脚标签 */}
          {footerConfig.tags && footerConfig.tags.length > 0 && (
            <div className="footer-tags">
              {footerConfig.tags.map((tag, index) => (
                <a key={index} href={tag.url} className="footer-tag" target="_blank" rel="noopener noreferrer">
                  {tag.name}
                </a>
              ))}
            </div>
          )}
          
          {footerConfig.showSocialLinks && (
            <div className="footer-social">
              {socialLinks.map((link, index) => (
                <a key={index} href={link.url} className="footer-social-link" target="_blank" rel="noopener noreferrer">
                  {getIconComponent(link.icon)}
                </a>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}

export default App
