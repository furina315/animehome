// 配置文件

// 个人信息配置
export const personalInfo = {
  name: '喜多',
  title: '前端开发者 | 动漫迷 | 游戏玩家',
  avatar: 'https://image.xd520.us.kg/file/1754036601466_avatar.jpg',
  about: [
    {
      icon: 'heart',
      text: '热爱二次元文化，喜欢看动漫、玩游戏，尤其是日系风格的作品'
    },
    {
      icon: 'code',
      text: '前端开发者，熟悉 React、TypeScript、Vite 等技术栈'
    },
    {
      icon: 'globe',
      text: '喜欢探索新技术，不断学习和提升自己的技能'
    },
    {
      icon: 'star',
      text: '业余时间喜欢画画、写代码、听音乐，享受独处的时光'
    }
  ]
}

// 社交链接配置
export const socialLinks = [
  {
    name: 'QQ',
    icon: 'heart',
    url: 'https://res.abeim.cn/api/qq/?qq=3243304152'
  },
  {
    name: '微信',
    icon: 'star',
    url: 'weixin://contacts/profile/wxid_ys_kitaikuyo520'
  },
  {
    name: 'Telegram',
    icon: 'moon',
    url: 'https://t.me/furina315'
  },
  {
    name: 'GitHub',
    icon: 'globe',
    url: 'https://github.com/furina315'
  },
  {
    name: '个人博客',
    icon: 'user',
    url: 'https://xiduo.qzz.io'
  }
]

// 默认背景图 - 自定义背景
export const defaultBackground = 'url(https://image.xd520.us.kg/file/1754032425366_bg.jpg) center/cover no-repeat fixed'

// 兴趣爱好配置
export const hobbies = [
  {
    label: '动漫',
    value: '《孤独摇滚》《魔女之旅》'
  },
  {
    label: '游戏',
    value: '原神、蔚蓝档案'
  },
  {
    label: '音乐',
    value: 'English、Japanese'
  },
  {
    label: '运动',
    value: '散步、跑步'
  },
  {
    label: '生活',
    value: '摄影、旅行'
  }
]

// 技术栈配置
export const techStack = [
  {
    label: '前端框架',
    value: 'React 18'
  },
  {
    label: '构建工具',
    value: 'Vite'
  },
  {
    label: '语言',
    value: 'TypeScript'
  },
  {
    label: '样式',
    value: 'CSS3'
  },
  {
    label: 'API',
    value: 'Axios'
  }
]

// 项目配置
export const projects = [
  {
    name: '二次元个人主页',
    description: '使用 Vite + React + TypeScript 开发的个性化二次元风格主页',
    url: 'https://example.com/anime-homepage'
  },
  {
    name: '个人博客系统',
    description: '基于 Next.js 开发的个人博客，支持 Markdown 写作和标签分类',
    url: 'https://example.com/blog'
  },
  {
    name: 'API 文档工具',
    description: '用于生成和管理 API 文档的工具，支持 Swagger 和 OpenAPI',
    url: 'https://example.com/api-docs'
  },
  {
    name: '在线代码编辑器',
    description: '基于 Monaco Editor 开发的在线代码编辑器，支持多种语言',
    url: 'https://example.com/code-editor'
  },
  {
    name: '电商管理后台',
    description: '基于 React + Ant Design 开发的电商管理后台系统',
    url: 'https://example.com/ecommerce'
  },
  {
    name: '聊天应用',
    description: '使用 Socket.io 实现的实时聊天应用',
    url: 'https://example.com/chat'
  },
  {
    name: '任务管理系统',
    description: '基于 React + Redux 开发的任务管理系统',
    url: 'https://example.com/task-manager'
  },
  {
    name: '数据可视化仪表板',
    description: '使用 ECharts 实现的数据可视化仪表板',
    url: 'https://example.com/dashboard'
  }
]

// 页脚配置
export const footerConfig = {
  copyright: `© ${new Date().getFullYear()} ${personalInfo.name} 的主页`,
  techStack: '使用 Vite + React + TypeScript 开发',
  showSocialLinks: false,
  tags: [
    { name: '二次元', url: 'https://example.com/tag/anime' },
    { name: '前端开发', url: 'https://example.com/tag/frontend' },
    { name: 'React', url: 'https://example.com/tag/react' },
    { name: 'TypeScript', url: 'https://example.com/tag/typescript' },
    { name: 'Vite', url: 'https://example.com/tag/vite' },
    { name: '动漫', url: 'https://example.com/tag/anime' },
    { name: '游戏', url: 'https://example.com/tag/games' }
  ]
}

// API配置
export const apiConfig = {
  // 高德地图API key
  amapKey: '388d0f45cc3098bf4dabc281ce0e46a9',
  // WeatherAPI.com key
  weatherApiKey: 'e8d91c79d0d7400d9c2143651252911'
}
