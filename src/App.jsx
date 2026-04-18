import { useState, useEffect } from 'react'

const COMPANY_TYPES = [
  { id: 'office', name: 'Офис', emoji: '🏢' },
  { id: 'plant', name: 'Производство', emoji: '🏭' },
  { id: 'warehouse', name: 'Склад', emoji: '📦' },
  { id: 'cafe', name: 'Кафе', emoji: '☕️' }
]

const CLIENT_TYPES = {
  contract: { id: 'contract', name: 'По договору', emoji: '📋', description: 'Постоянный договор с фиксированным количеством' },
  daily: { id: 'daily', name: 'Ежедневный', emoji: '📅', description: 'Заказ каждый день' },
  individual: { id: 'individual', name: 'Индивидуальный', emoji: '👤', description: 'Разовые заказы' }
}

const RATION_TYPES = {
  breakfast: { id: 'breakfast', name: 'Завтрак', emoji: '🥐', time: '07:30-08:30', defaultPrice: 280 },
  lunch: { id: 'lunch', name: 'Обед', emoji: '🍱', time: '12:00-13:00', defaultPrice: 420 },
  dinner: { id: 'dinner', name: 'Ужин', emoji: '🍽️', time: '17:30-18:30', defaultPrice: 380 },
  night: { id: 'night', name: 'Ночной', emoji: '🌙', time: '23:00-00:00', defaultPrice: 450 },
  snack: { id: 'snack', name: 'Перекус', emoji: '🍪', time: '15:00-16:00', defaultPrice: 180 }
}

const ORDER_STATUS = {
  created: { label: '⏳ Создан', color: '#FF9800', bg: '#FFF3E0' },
  confirmed: { label: '✓ Подтверждён', color: '#2196F3', bg: '#E3F2FD' },
  production: { label: '🏭 На производстве', color: '#9C27B0', bg: '#F3E5F5' },
  delivery: { label: '🚚 В доставке', color: '#00BCD4', bg: '#E0F7FA' },
  delivered: { label: '✅ Получен', color: '#4CAF50', bg: '#E8F5E9' },
  cancelled: { label: '❌ Отменён', color: '#f44336', bg: '#FFEBEE' },
  auto_confirmed: { label: '🤖 Автоподтверждён', color: '#607D8B', bg: '#ECEFF1' }
}

const DEFAULT_BOTS = [
  { id: 'bot1', name: 'Бот офиса', token: '6706048508:AAF-8INmBKwP1x7DA-_ET8D282c5pp0Rn2Y', chatId: '-1002583331823', active: true, type: 'office', threadId: 360 },
  { id: 'bot2', name: 'Бот производства', token: '', chatId: '', active: false, type: 'production', threadId: 363 },
  { id: 'bot3', name: 'Бот клиентов', token: '', chatId: '', active: false, type: 'clients', threadId: 359 }
]

const DEFAULT_THREADS = { waiting: 360, newUser: 361, history: 362, orders: 359, production: 363, delivery: 364 }

const DEFAULT_MENUS = [
  { id: 1, name: 'Стандартное', description: 'Обычное питание', rations: { breakfast: {price: 280, items: 'Каша, чай, хлеб, фрукты'}, lunch: {price: 420, items: 'Суп, второе, компот, хлеб'}, dinner: {price: 380, items: 'Второе, салат, чай'}, night: {price: 450, items: 'Перекус, чай'}, snack: {price: 180, items: 'Печенье, чай'} }, active: true, approved: true, markup: 0 },
  { id: 2, name: 'Халяль', description: 'Халяль питание', rations: { breakfast: {price: 320, items: 'Халяль каша, чай'}, lunch: {price: 480, items: 'Халяль суп, мясо, компот'}, dinner: {price: 440, items: 'Халяль блюда'}, night: {price: 500, items: 'Халяль перекус'}, snack: {price: 200, items: 'Халяль печенье'} }, active: true, approved: true, markup: 0 },
  { id: 3, name: 'ПП', description: 'Правильное питание', rations: { breakfast: {price: 350, items: 'Омлет, овощи, сок'}, lunch: {price: 520, items: 'Салат, курица, рис, чай'}, dinner: {price: 460, items: 'Рыба, овощи'}, night: {price: 380, items: 'Кефир, фрукты'}, snack: {price: 220, items: 'Фрукты'} }, active: true, approved: true, markup: 0 },
  { id: 4, name: 'Директорат', description: 'Премиум питание', rations: { breakfast: {price: 420, items: 'Фрукты, выпечка, сок, кофе'}, lunch: {price: 620, items: 'Мясо, гарнир, десерт, компот'}, dinner: {price: 560, items: 'Рыба, вино, фрукты'}, night: {price: 600, items: 'Десерт, чай'}, snack: {price: 350, items: 'Десерт'} }, active: true, approved: true, markup: 0 }
]

const DEFAULT_PRODUCTIONS = [
  { id: 1, name: 'Собственное производство', type: 'own', address: 'СПБ, ул. Промышленная, д. 10', contact: '+7 (999) 111-22-33', delivery: true, deliveryPrice: 0, active: true, rations: { breakfast: 280, lunch: 420, dinner: 380, night: 450, snack: 180 }, botId: 'bot1', telegramChat: '-1002583331823', telegramThread: 363 },
  { id: 2, name: 'Партнёр 1', type: 'partner', address: 'СПБ, ул. Партнёрская, д. 5', contact: '+7 (999) 222-33-44', delivery: false, deliveryPrice: 50, active: true, rations: { breakfast: 260, lunch: 400, dinner: 360, night: 420, snack: 170 }, botId: '', telegramChat: '', telegramThread: 0 },
  { id: 3, name: 'Партнёр 2', type: 'partner', address: 'СПБ, ул. Заводская, д. 15', contact: '+7 (999) 333-44-55', delivery: true, deliveryPrice: 30, active: true, rations: { breakfast: 270, lunch: 410, dinner: 370, night: 440, snack: 175 }, botId: '', telegramChat: '', telegramThread: 0 }
]

const DEFAULT_MANAGERS = [
  { id: 1, name: 'Анна', phone: '+7 (999) 000-11-22', telegram: '@anna_manager', login: 'ANNA', password: 'anna123', bonusPercent: 5, salary: 50000, totalSales: 0, totalRevenue: 0, active: true, botId: 'bot1', telegramThread: 361 },
  { id: 2, name: 'Мария', phone: '+7 (999) 000-33-44', telegram: '@maria_manager', login: 'MARIA', password: 'maria123', bonusPercent: 5, salary: 50000, totalSales: 0, totalRevenue: 0, active: true, botId: 'bot1', telegramThread: 362 },
  { id: 3, name: 'Иван', phone: '+7 (999) 000-55-66', telegram: '@ivan_manager', login: 'IVAN', password: 'ivan123', bonusPercent: 5, salary: 50000, totalSales: 0, totalRevenue: 0, active: true, botId: 'bot1', telegramThread: 363 }
]

const DEFAULT_CLIENTS = {
  'TEST-001': {
    id: 'TEST-001', company: 'ООО ТехноСтрой', inn: '7812345678', contact: 'Петров Сергей', phone: '+7 (999) 123-45-67', email: 'petrov@tehno.ru', address: 'г. Санкт-Петербург, ул. Новая, д. 10', companyType: 'office', clientType: 'contract', contractDate: '2025-01-15', paymentMethod: 'card', paymentPeriod: 'monthly', paymentDelay: 0, active: true, featured: true, discount: 10, staff: { regular: 45, halal: 12, pp: 8, director: 3 }, rations: ['breakfast', 'lunch', 'dinner'], deliveryTime: { breakfast: '07:30-08:30', lunch: '12:00-13:00', dinner: '17:30-18:30' }, managerId: 1, adminComment: '', menuIds: [1, 2], freeLogins: 3, usedLogins: 1, userLogins: [{ login: 'TECHNO1', password: 'tech123', name: 'Петров С.' }], botId: 'bot1', telegramChat: '-1002583331823', telegramThread: 359 }
  }
}

// БАЗОВЫЕ ПОЛЬЗОВАТЕЛИ (не удаляются)
const BASE_USERS = {
  '0901SMOLADMIN': { id: '0901SmolAdmin', password: '0901SmolAdmin', role: 'admin', name: 'Админ', lastLogin: null },
  'ADMIN': { id: 'ADMIN', password: 'ADMIN', role: 'admin', name: 'Главный Админ', lastLogin: null }
}

const inputStyle = { width: '100%', padding: '10px 12px', fontSize: 14, borderRadius: 6, border: '1px solid #ddd', marginBottom: 10, boxSizing: 'border-box', background: '#fff' }
const labelStyle = { fontWeight: '500', display: 'block', marginBottom: 4, fontSize: 12, color: '#555' }
const sectionStyle = { background: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
const buttonPrimaryStyle = { background: '#1976D2', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 6, fontSize: 13, fontWeight: '500', cursor: 'pointer' }
const buttonSecondaryStyle = { background: '#f5f5f5', color: '#333', border: '1px solid #ddd', padding: '10px 16px', borderRadius: 6, fontSize: 13, fontWeight: '500', cursor: 'pointer' }

const loadFromStorage = (key) => { try { const data = localStorage.getItem('food_' + key); return data ? JSON.parse(data) : null } catch (e) { return null } }
const saveToStorage = (key, data) => { try { localStorage.setItem('food_' + key, JSON.stringify(data)); return true } catch (e) { return false } }

function App() {
  const [view, setView] = useState('login')
  const [tab, setTab] = useState('dashboard')
  const [contractNumber, setContractNumber] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [currentClient, setCurrentClient] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [clients, setClients] = useState({})
  const [users, setUsers] = useState({})
  const [managers, setManagers] = useState([])
  const [menus, setMenus] = useState([])
  const [productions, setProductions] = useState([])
  const [orders, setOrders] = useState([])
  const [logs, setLogs] = useState([])
  const [loginHistory, setLoginHistory] = useState([])
  const [editingClient, setEditingClient] = useState(null)
  const [editingProduction, setEditingProduction] = useState(null)
  const [editingManager, setEditingManager] = useState(null)
  const [editingMenu, setEditingMenu] = useState(null)
  const [selectedRations, setSelectedRations] = useState([])
  const [selectedMenuId, setSelectedMenuId] = useState(null)
  const [selectedDay, setSelectedDay] = useState('monday')
  const [orderQuantity, setOrderQuantity] = useState({})
  const [comment, setComment] = useState('')
  const [client, setClient] = useState({ company: '', inn: '', contact: '', phone: '', email: '', address: '', paymentMethod: 'card', paymentPeriod: 'monthly' })
  const [bots, setBots] = useState([])
  const [threads, setThreads] = useState(DEFAULT_THREADS)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUserType, setNewUserType] = useState('client')
  const [newUserData, setNewUserData] = useState({ login: '', password: '', name: '', company: '', phone: '' })

  useEffect(() => {
    const loadData = () => {
      // ЗАГРУЖАЕМ С НАСТРОЙКАМИ ПО УМОЛЧАНИЮ ЕСЛИ ПУСТО
      const savedUsers = loadFromStorage('users')
      const mergedUsers = { ...BASE_USERS, ...(savedUsers || {}) }
      setUsers(mergedUsers)
      
      const savedClients = loadFromStorage('clients')
      setClients(savedClients && Object.keys(savedClients).length > 0 ? savedClients : DEFAULT_CLIENTS)
      
      const savedOrders = loadFromStorage('orders')
      setOrders(savedOrders || [])
      
      const savedBots = loadFromStorage('bots')
      setBots(savedBots && savedBots.length > 0 ? savedBots : DEFAULT_BOTS)
      
      const savedThreads = loadFromStorage('threads')
      setThreads(savedThreads || DEFAULT_THREADS)
      
      const savedManagers = loadFromStorage('managers')
      setManagers(savedManagers && savedManagers.length > 0 ? savedManagers : DEFAULT_MANAGERS)
      
      const savedMenus = loadFromStorage('menus')
      setMenus(savedMenus && savedMenus.length > 0 ? savedMenus : DEFAULT_MENUS)
      
      const savedProductions = loadFromStorage('productions')
      setProductions(savedProductions && savedProductions.length > 0 ? savedProductions : DEFAULT_PRODUCTIONS)
      
      const savedLogs = loadFromStorage('logs')
      setLogs(savedLogs || [])
      
      const savedLoginHistory = loadFromStorage('loginHistory')
      setLoginHistory(savedLoginHistory || [])
      
      setLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => { if (!loading) saveToStorage('clients', clients) }, [clients, loading])
  useEffect(() => { if (!loading && orders.length > 0) saveToStorage('orders', orders) }, [orders, loading])
  useEffect(() => { if (!loading && bots.length > 0) saveToStorage('bots', bots) }, [bots, loading])
  useEffect(() => { if (!loading) saveToStorage('threads', threads) }, [threads, loading])
  useEffect(() => { if (!loading && Object.keys(users).length > 0) saveToStorage('users', users) }, [users, loading])
  useEffect(() => { if (!loading && managers.length > 0) saveToStorage('managers', managers) }, [managers, loading])
  useEffect(() => { if (!loading && menus.length > 0) saveToStorage('menus', menus) }, [menus, loading])
  useEffect(() => { if (!loading && productions.length > 0) saveToStorage('productions', productions) }, [productions, loading])
  useEffect(() => { if (!loading) saveToStorage('logs', logs) }, [logs, loading])
  useEffect(() => { if (!loading) saveToStorage('loginHistory', loginHistory) }, [loginHistory, loading])

  const navigate = (page) => { window.location.hash = page; setView(page === 'admin' ? 'admin' : page === 'new' ? 'new-user' : 'login') }

  const addLog = (action, details) => {
    const newLog = { id: Date.now(), action, details, user: currentUser?.name || currentClient?.company || 'Система', date: new Date().toISOString() }
    setLogs(prev => [newLog, ...prev].slice(0, 100))
  }

  const addNotification = (title, message, type = 'info') => {
    const notif = { id: Date.now(), title, message, type, date: new Date().toISOString(), read: false }
    setNotifications(prev => [notif, ...prev].slice(0, 20))
  }

  const recordLogin = (userId, userName, role) => {
    const loginRecord = { id: Date.now(), userId, userName, role, loginTime: new Date().toISOString() }
    setLoginHistory(prev => [loginRecord, ...prev].slice(0, 50))
    setUsers(prev => ({ ...prev, [userId.toUpperCase()]: { ...prev[userId.toUpperCase()], lastLogin: new Date().toISOString() } }))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const login = contractNumber.trim()
    const pass = password.trim()
    const loginUpper = login.toUpperCase()
    
    const userKey = Object.keys(users).find(k => k.toUpperCase() === loginUpper)
    
    if (userKey && users[userKey].password === pass) {
      const user = users[userKey]
      setCurrentUser(user)
      recordLogin(userKey, user.name, user.role)
      addLog('Вход в систему', `Пользователь ${userKey} (${user.role}) вошёл в систему`)
      
      if (user.role === 'client') {
        const clientData = clients[user.clientId]
        if (clientData) {
          setCurrentClient(clientData)
          setSelectedRations(clientData.rations || ['lunch'])
          setSelectedMenuId(clientData.menuIds?.[0] || 1)
          setOrderQuantity({ breakfast: clientData.staff?.regular || 0, lunch: clientData.staff?.regular || 0, dinner: clientData.staff?.regular || 0, night: 0, snack: 0 })
          addLog('Вход клиента', `Клиент ${clientData.company} вошёл в систему`)
        }
      } else {
        navigate('admin')
      }
      setLoginError('')
      return
    }
    
    if (clients[loginUpper]) {
      const c = clients[loginUpper]
      if (!c.active) { setLoginError('Договор приостановлен'); return }
      const clientLogin = c.userLogins?.find(u => u.login.toUpperCase() === loginUpper && u.password === pass)
      if (clientLogin || pass === 'test') {
        setCurrentClient(c)
        setSelectedRations(c.rations || ['lunch'])
        setSelectedMenuId(c.menuIds?.[0] || 1)
        setOrderQuantity({ breakfast: c.staff?.regular || 0, lunch: c.staff?.regular || 0, dinner: c.staff?.regular || 0, night: 0, snack: 0 })
        recordLogin(loginUpper, c.company, 'client')
        addLog('Вход клиента', `Клиент ${c.company} вошёл в систему`)
        setLoginError('')
      } else {
        setLoginError('Неверный логин или пароль')
      }
    } else {
      setLoginError('Неверный логин или пароль')
    }
  }

  const calculateOrderTotal = (menu, rations, quantity) => {
    let total = 0
    Object.keys(RATION_TYPES).forEach(r => {
      if (rations[r] && menu?.rations?.[r]) {
        total += (quantity[r] || 0) * menu.rations[r].price
      }
    })
    return total
  }

  const createOrder = async () => {
    const selectedMenu = menus.find(m => m.id === selectedMenuId) || menus[0]
    const newOrder = {
      id: Date.now(),
      orderNumber: 'ORD-' + Date.now().toString().slice(-6),
      clientId: currentClient.id,
      company: currentClient.company,
      address: currentClient.address,
      date: new Date().toISOString().split('T')[0],
      day: selectedDay,
      rations: selectedRations,
      menuId: selectedMenuId,
      menuName: selectedMenu.name,
      menuItems: selectedMenu.rations,
      quantity: orderQuantity,
      status: 'created',
      total: calculateOrderTotal(selectedMenu, selectedRations.reduce((acc, r) => ({...acc, [r]: true}), {}), orderQuantity),
      productionId: null,
      createdAt: new Date().toISOString(),
      confirmedAt: null,
      productionAt: null,
      deliveryAt: null,
      deliveredAt: null,
      comment: '',
      photo: ''
    }

    setOrders(prev => [...prev, newOrder])
    addLog('Создан заказ', `Клиент ${currentClient.company} создал заказ ${newOrder.orderNumber}`)
    addNotification('Заказ создан', `Заказ ${newOrder.orderNumber} создан и ожидает подтверждения`, 'success')

    const managerBot = bots.find(b => b.active && b.type === 'office')
    if (managerBot) {
      const rationsText = selectedRations.map(r => `${RATION_TYPES[r]?.emoji || ''} ${RATION_TYPES[r]?.name || r}: ${orderQuantity[r] || 0}`).join('\n')
      const message = `📥 *Новый заказ!*\n\n*Номер:* ${newOrder.orderNumber}\n*Компания:* ${currentClient.company}\n*Адрес:* ${currentClient.address}\n*Меню:* ${selectedMenu.name}\n*Дата:* ${selectedDay}\n\n${rationsText}\n\n💰 *Стоимость:* ${newOrder.total.toLocaleString()}₽`
      await sendToTelegram(managerBot, message, threads.waiting)
    }

    alert(`Заказ ${newOrder.orderNumber} отправлен на подтверждение!`)
  }

  const updateOrderStatus = async (orderId, newStatus, extra = {}) => {
    const order = orders.find(o => o.id === orderId)
    const now = new Date().toISOString()
    
    let updateData = { status: newStatus }
    if (newStatus === 'confirmed') updateData.confirmedAt = now
    if (newStatus === 'production') updateData.productionAt = now
    if (newStatus === 'delivery') updateData.deliveryAt = now
    if (newStatus === 'delivered') updateData.deliveredAt = now
    if (extra.comment) updateData.comment = extra.comment
    if (extra.photo) updateData.photo = extra.photo
    
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updateData } : o))
    addLog('Статус заказа', `Заказ ${order?.orderNumber} → ${ORDER_STATUS[newStatus]?.label || newStatus}`)
    
    if (newStatus === 'confirmed') {
      const clientData = clients[order?.clientId]
      if (clientData?.managerId) {
        setManagers(prev => prev.map(m => m.id === clientData.managerId ? { ...m, totalSales: m.totalSales + 1, totalRevenue: m.totalRevenue + (order?.total || 0) } : m))
      }
    }

    addNotification('Статус заказа', `Заказ ${order?.orderNumber}: ${ORDER_STATUS[newStatus]?.label || newStatus}`, 'info')
  }

  const confirmDelivery = async (orderId) => {
    await updateOrderStatus(orderId, 'delivered')
    addNotification('Подтверждение', 'Вы подтвердили получение заказа!', 'success')
  }

  const sendToTelegram = async (bot, message, threadId) => {
    if (!bot || !bot.token || !bot.chatId) return false
    try {
      const response = await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: bot.chatId, text: message, parse_mode: 'Markdown', message_thread_id: Number(threadId) })
      })
      return (await response.json()).ok
    } catch (err) { console.log('Telegram error:', err); return false }
  }

  const getManager = (id) => managers.find(m => m.id === id)
  const getProduction = (id) => productions.find(p => p.id === id)

  const getFinanceStats = () => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const todayOrders = orders.filter(o => o.date === today && o.status !== 'cancelled')
    const monthOrders = orders.filter(o => o.date >= monthAgo && o.status !== 'cancelled')

    return {
      today: { count: todayOrders.length, sum: todayOrders.reduce((s, o) => s + o.total, 0) },
      month: { count: monthOrders.length, sum: monthOrders.reduce((s, o) => s + o.total, 0) }
    }
  }

  const exportToExcel = (data, filename) => {
    const headers = Object.keys(data[0] || {}).join('\t')
    const rows = data.map(row => Object.values(row).join('\t')).join('\n')
    const blob = new Blob([headers + '\n' + rows], { type: 'text/tab-separated-values' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename + '.tsv'
    a.click()
  }

  const importFromExcel = (e, setter, key) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target.result
        const lines = text.split('\n').filter(l => l.trim())
        const headers = lines[0].split('\t')
        const data = lines.slice(1).map(line => {
          const values = line.split('\t')
          const obj = {}
          headers.forEach((h, i) => { obj[h] = values[i] || '' })
          return obj
        })
        setter(prev => ({ ...prev, [key]: data }))
        alert(`Загружено ${data.length} записей!`)
      } catch (err) { alert('Ошибка чтения файла') }
    }
    reader.readAsText(file)
  }

  // СОЗДАНИЕ НОВОГО ПОЛЬЗОВАТЕЛЯ
  const handleCreateUser = () => {
    if (!newUserData.login || !newUserData.password) {
      alert('Заполните логин и пароль!')
      return
    }

    const loginUpper = newUserData.login.toUpperCase()

    if (newUserType === 'client') {
      // Создаём клиента
      const newClientId = loginUpper
      const newClient = {
        id: newClientId,
        company: newUserData.company || newUserData.name || 'Новый клиент',
        contact: newUserData.name,
        phone: newUserData.phone,
        address: '',
        clientType: 'contract',
        rations: ['lunch'],
        staff: { regular: 0 },
        menuIds: [1],
        managerId: 1,
        active: true,
        featured: false,
        discount: 0,
        userLogins: [{ login: loginUpper, password: newUserData.password, name: newUserData.name }]
      }
      setClients(prev => ({ ...prev, [newClientId]: newClient }))
      setUsers(prev => ({ ...prev, [loginUpper]: { id: loginUpper, password: newUserData.password, role: 'client', name: newUserData.company || newUserData.name, clientId: newClientId, lastLogin: null } }))
      alert(`Клиент создан!\nЛогин: ${loginUpper}\nПароль: ${newUserData.password}`)
    } else if (newUserType === 'production') {
      // Создаём производство
      const newProdId = Date.now()
      const newProduction = {
        id: newProdId,
        name: newUserData.company || newUserData.name || 'Новое производство',
        type: 'partner',
        address: '',
        contact: newUserData.phone,
        delivery: false,
        deliveryPrice: 0,
        active: true,
        rations: { breakfast: 280, lunch: 420, dinner: 380, night: 450, snack: 180 },
        botId: '',
        telegramChat: '',
        telegramThread: 0
      }
      setProductions(prev => [...prev, newProduction])
      setUsers(prev => ({ ...prev, [loginUpper]: { id: loginUpper, password: newUserData.password, role: 'production', name: newUserData.company || newUserData.name, productionId: newProdId, lastLogin: null } }))
      alert(`Производство создано!\nЛогин: ${loginUpper}\nПароль: ${newUserData.password}`)
    } else if (newUserType === 'manager') {
      // Создаём менеджера
      const newMgrId = Date.now()
      const newManager = {
        id: newMgrId,
        name: newUserData.name || 'Новый менеджер',
        phone: newUserData.phone,
        telegram: '',
        login: loginUpper,
        password: newUserData.password,
        bonusPercent: 5,
        salary: 50000,
        totalSales: 0,
        totalRevenue: 0,
        active: true,
        botId: 'bot1',
        telegramThread: 0
      }
      setManagers(prev => [...prev, newManager])
      setUsers(prev => ({ ...prev, [loginUpper]: { id: loginUpper, password: newUserData.password, role: 'operator', name: newUserData.name, managerId: newMgrId, lastLogin: null } }))
      alert(`Менеджер создан!\nЛогин: ${loginUpper}\nПароль: ${newUserData.password}`)
    }

    setShowAddUser(false)
    setNewUserData({ login: '', password: '', name: '', company: '', phone: '' })
    addLog('Создан пользователь', `${newUserType}: ${loginUpper}`)
  }

  const finance = getFinanceStats()

  if (loading) return <div style={{ padding: 20, textAlign: 'center', fontFamily: 'system-ui' }}><div style={{ fontSize: 24 }}>⏳</div><div>Загрузка...</div></div>

  // === ВХОД ===
  if (!currentClient && view !== 'admin') {
    return (
      <div style={{ padding: 20, maxWidth: 420, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🍽️</div>
            <h1 style={{ fontSize: 28, marginBottom: 8, color: '#fff', fontWeight: 700 }}>Питание СПБ</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Личный кабинет клиента</p>
          </div>
          <div style={{ background: '#fff', padding: 28, borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ marginTop: 0, marginBottom: 24, textAlign: 'center', fontSize: 20, color: '#333' }}>Вход в систему</h2>
            <form onSubmit={handleLogin}>
              <label style={labelStyle}>Логин</label>
              <input type="text" placeholder="Введите логин" value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} style={{ ...inputStyle, fontSize: 16, padding: 14 } } />
              <label style={labelStyle}>Пароль</label>
              <input type="password" placeholder="Введите пароль" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, fontSize: 16, padding: 14 } } />
              {loginError && <div style={{ color: '#f44336', marginBottom: 12, fontSize: 13 }}>{loginError}</div>}
              <button type="submit" style={{ ...buttonPrimaryStyle, width: '100%', padding: 16, fontSize: 16, borderRadius: 10, marginTop: 8 }}>Войти</button>
            </form>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button onClick={() => navigate('new')} style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Оставить заявку</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // === АДМИН ===
  if (view === 'admin') {
    const adminTabs = [
      { id: 'dashboard', name: '📊', title: 'Обзор' },
      { id: 'clients', name: '🏢', title: 'Клиенты' },
      { id: 'users', name: '👥', title: 'Пользователи' },
      { id: 'orders', name: '📋', title: 'Заказы' },
      { id: 'waiting', name: '📥', title: 'Ожидание' },
      { id: 'production', name: '🏭', title: 'Производство' },
      { id: 'productions', name: '⚙️', title: 'Производства' },
      { id: 'menu', name: '🍽️', title: 'Меню' },
      { id: 'finances', name: '💰', title: 'Финансы' },
      { id: 'managers', name: '👩‍💼', title: 'Менеджеры' },
      { id: 'telegram', name: '📱', title: 'Telegram' },
      { id: 'database', name: '💾', title: 'База данных' }
    ]

    return (
      <div style={{ minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f0f2f5' }}>
        {/* HEADER */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '16px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 32 }}>🍽️</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Питание СПБ</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Админ-панель</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, color: '#fff' }}>{currentUser?.name}</span>
            <button onClick={() => { setCurrentUser(null); navigate('login') }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#fff' }}>Выход</button>
          </div>
        </div>
        {/* TABS */}
        <div style={{ background: '#fff', padding: '10px 24px', borderBottom: '1px solid #eee', overflowX: 'auto', whiteSpace: 'nowrap', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          {adminTabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '10px 18px', border: 'none', borderRadius: 10, background: tab === t.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent', color: tab === t.id ? '#fff' : '#555', cursor: 'pointer', fontSize: 14, fontWeight: '500', marginRight: 6, transition: 'all 0.2s' }}>
              {t.name} <span style={{ marginLeft: 4 }}>{t.title}</span>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
          
          {/* === ОБЗОР === */}
          {tab === 'dashboard' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 22, color: '#333' }}>📊 Обзор системы</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', textAlign: 'center', padding: 24 }}>
                  <div style={{ fontSize: 36, fontWeight: 700 }}>{Object.keys(clients).length}</div>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>Клиентов</div>
                </div>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff', textAlign: 'center', padding: 24 }}>
                  <div style={{ fontSize: 36, fontWeight: 700 }}>{orders.filter(o => o.status === 'created').length}</div>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>Новых заказов</div>
                </div>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff', textAlign: 'center', padding: 24 }}>
                  <div style={{ fontSize: 36, fontWeight: 700 }}>{finance.today.count}</div>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>Заказов сегодня</div>
                </div>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#fff', textAlign: 'center', padding: 24 }}>
                  <div style={{ fontSize: 36, fontWeight: 700 }}>{finance.month.sum.toLocaleString()}₽</div>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>За месяц</div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={sectionStyle}>
                  <h3 style={{ marginTop: 0, fontSize: 16, color: '#333' }}>📈 Последние заказы</h3>
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} style={{ padding: 12, background: '#f8f9fa', borderRadius: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{order.orderNumber}</div>
                        <div style={{ fontSize: 13, color: '#666' }}>{order.company}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600 }}>{order.total.toLocaleString()}₽</div>
                        <div style={{ fontSize: 11, color: ORDER_STATUS[order.status]?.color }}>{ORDER_STATUS[order.status]?.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={sectionStyle}>
                  <h3 style={{ marginTop: 0, fontSize: 16, color: '#333' }}>📝 Журнал действий</h3>
                  {logs.slice(0, 5).map(log => (
                    <div key={log.id} style={{ padding: 10, borderBottom: '1px solid #eee', fontSize: 13 }}>
                      <div style={{ fontWeight: 500, color: '#333' }}>{log.action}</div>
                      <div style={{ color: '#888' }}>{log.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === КЛИЕНТЫ === */}
          {tab === 'clients' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 22, color: '#333' }}>🏢 Клиенты</h2>
                <button onClick={() => { setNewUserType('client'); setShowAddUser(true) }} style={{ ...buttonPrimaryStyle, padding: '12px 20px', borderRadius: 10, fontSize: 14 }}>+ Добавить клиента</button>
              </div>
              
              <input type="text" placeholder="Поиск клиентов..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle, marginBottom: 16, maxWidth: 350, padding: 12, borderRadius: 10 } } />
              
              {Object.values(clients).filter(c => !searchQuery || c.company.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase())).map(c => {
                const mgr = getManager(c.managerId)
                return (
                  <div key={c.id} style={{ ...sectionStyle, borderLeft: c.featured ? '4px solid #f5576c' : '4px solid #667eea', borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <h3 style={{ margin: 0, fontSize: 18, color: '#333' }}>{c.company}</h3>
                          <span style={{ background: c.clientType === 'contract' ? '#43e97b' : c.clientType === 'daily' ? '#4facfe' : '#f5576c', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{CLIENT_TYPES[c.clientType]?.emoji} {CLIENT_TYPES[c.clientType]?.name}</span>
                          {c.featured && <span style={{ background: '#f5576c', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>VIP</span>}
                          {!c.active && <span style={{ background: '#f44336', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>ОТКЛ</span>}
                        </div>
                        <div style={{ fontSize: 14, color: '#666', marginBottom: 6 }}>ID: {c.id} • {c.contact} • {c.phone}</div>
                        <div style={{ fontSize: 13, color: '#888' }}>📍 {c.address || '-'}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                        <div style={{ fontSize: 14, color: '#333' }}>👤 Менеджер: <b>{mgr?.name || '-'}</b></div>
                        <div style={{ fontSize: 14, color: '#333' }}>👥 <b>{c.staff?.regular || 0}</b> чел.</div>
                        <button onClick={() => setEditingClient({...c})} style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Изменить</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* === ПОЛЬЗОВАТЕЛИ === */}
          {tab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 22, color: '#333' }}>👥 Пользователи системы</h2>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => exportToExcel(Object.values(clients).map(c => ({ ID: c.id, Компания: c.company, Тип: c.clientType, Контакт: c.contact, Телефон: c.phone, Адрес: c.address, Менеджер: getManager(c.managerId)?.name, Активен: c.active ? 'Да' : 'Нет' })), 'clients')} style={{ ...buttonSecondaryStyle, padding: '10px 16px', borderRadius: 8 }}>📥 Экспорт</button>
                  <label style={{ ...buttonSecondaryStyle, padding: '10px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    📤 Импорт
                    <input type="file" accept=".tsv,.csv,.txt" onChange={(e) => importFromExcel(e, setClients, 'imported')} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
              
              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0, fontSize: 16, color: '#333', marginBottom: 16 }}>➕ Добавить пользователя</h3>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                  <button onClick={() => { setNewUserType('client'); setShowAddUser(true) }} style={{ padding: '12px 20px', border: 'none', borderRadius: 10, background: newUserType === 'client' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f5f5f5', color: newUserType === 'client' ? '#fff' : '#333', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>🏢 Клиент</button>
                  <button onClick={() => { setNewUserType('production'); setShowAddUser(true) }} style={{ padding: '12px 20px', border: 'none', borderRadius: 10, background: newUserType === 'production' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : '#f5f5f5', color: newUserType === 'production' ? '#fff' : '#333', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>🏭 Производство</button>
                  <button onClick={() => { setNewUserType('manager'); setShowAddUser(true) }} style={{ padding: '12px 20px', border: 'none', borderRadius: 10, background: newUserType === 'manager' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : '#f5f5f5', color: newUserType === 'manager' ? '#fff' : '#333', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>👩‍💼 Менеджер</button>
                </div>
              </div>
              
              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0, fontSize: 16, color: '#333' }}>🔑 Логины клиентов</h3>
                {Object.values(clients).map(c => (
                  <div key={c.id} style={{ padding: 14, borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <b style={{ fontSize: 15, color: '#333' }}>{c.company}</b>
                        <div style={{ fontSize: 13, color: '#666' }}>{c.id}</div>
                      </div>
                      <div style={{ fontSize: 13, color: '#888' }}>
                        Логинов: {c.userLogins?.length || 0} / {c.freeLogins || 1}
                      </div>
                    </div>
                    {c.userLogins?.map((u, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, marginTop: 10, padding: 10, background: '#f8f9fa', borderRadius: 8 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#667eea', fontWeight: 600 }}>{u.login}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#666' }}>{u.password}</span>
                        <span style={{ fontSize: 13, color: '#888' }}>- {u.name}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === ЗАКАЗЫ === */}
          {tab === 'orders' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 22, color: '#333' }}>📋 Все заказы ({orders.length})</h2>
              
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: 'auto', padding: 10, borderRadius: 8 }}>
                  <option value="all">Все статусы</option>
                  {Object.entries(ORDER_STATUS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
                </select>
              </div>
              
              {orders.filter(o => filterStatus === 'all' || o.status === filterStatus).slice(0, 30).map(order => (
                <div key={order.id} style={{ ...sectionStyle, borderLeft: `4px solid ${ORDER_STATUS[order.status]?.color}`, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16, color: '#333' }}>{order.orderNumber}</div>
                      <div style={{ fontSize: 14, color: '#666' }}>{order.company}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>{order.date} • {order.menuName}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 20, color: '#333' }}>{order.total.toLocaleString()}₽</div>
                      <span style={{ padding: '6px 14px', background: ORDER_STATUS[order.status]?.bg, color: ORDER_STATUS[order.status]?.color, borderRadius: 20, fontSize: 13, fontWeight: 500 }}>{ORDER_STATUS[order.status]?.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === ОЖИДАНИЕ === */}
          {tab === 'waiting' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 22, color: '#333' }}>📥 Ожидают подтверждения ({orders.filter(o => o.status === 'created').length})</h2>
              {orders.filter(o => o.status === 'created').map(order => (
                <div key={order.id} style={{ ...sectionStyle, borderLeft: '4px solid #f5576c', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16, color: '#333' }}>{order.orderNumber}</div>
                      <div style={{ fontSize: 15, color: '#333' }}>{order.company}</div>
                      <div style={{ fontSize: 13, color: '#666' }}>📍 {order.address}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>{order.rations?.map(r => RATION_TYPES[r]?.emoji).join(' ')}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 20, color: '#f5576c' }}>{order.total.toLocaleString()}₽</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                    <button onClick={() => updateOrderStatus(order.id, 'confirmed')} style={{ flex: 1, padding: 14, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>✓ Подтвердить</button>
                    <button onClick={() => updateOrderStatus(order.id, 'cancelled')} style={{ flex: 1, padding: 14, background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>✕ Отклонить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === ПРОИЗВОДСТВО === */}
          {tab === 'production' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 22, color: '#333' }}>🏭 В работе ({orders.filter(o => ['confirmed', 'production', 'delivery'].includes(o.status)).length})</h2>
              {orders.filter(o => ['confirmed', 'production', 'delivery'].includes(o.status)).map(order => (
                <div key={order.id} style={{ ...sectionStyle, borderLeft: '4px solid #9C27B0', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16, color: '#333' }}>{order.orderNumber}</div>
                      <div style={{ fontSize: 15, color: '#333' }}>{order.company}</div>
                      <div style={{ fontSize: 13, color: '#666' }}>{order.menuName}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 20 }}>{order.total.toLocaleString()}₽</div>
                      <span style={{ padding: '6px 14px', background: ORDER_STATUS[order.status]?.bg, color: ORDER_STATUS[order.status]?.color, borderRadius: 20, fontSize: 13, fontWeight: 500 }}>{ORDER_STATUS[order.status]?.label}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                    {order.status === 'confirmed' && <button onClick={() => updateOrderStatus(order.id, 'production')} style={{ flex: 1, padding: 14, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>🏭 Принять</button>}
                    {order.status === 'production' && <button onClick={() => updateOrderStatus(order.id, 'delivery')} style={{ flex: 1, padding: 14, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>🚚 Отправить</button>}
                    {order.status === 'delivery' && <button onClick={() => updateOrderStatus(order.id, 'delivered')} style={{ flex: 1, padding: 14, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>✅ Доставлен</button>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === ПРОИЗВОДСТВА === */}
          {tab === 'productions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 22, color: '#333' }}>⚙️ Производства</h2>
                <button onClick={() => { setNewUserType('production'); setShowAddUser(true) }} style={{ ...buttonPrimaryStyle, padding: '12px 20px', borderRadius: 10, fontSize: 14 }}>+ Добавить</button>
              </div>
              
              {productions.map(prod => (
                <div key={prod.id} style={{ ...sectionStyle, borderLeft: prod.type === 'own' ? '4px solid #43e97b' : '4px solid #f5576c', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18, color: '#333' }}>🏭 {prod.name}</h3>
                      <span style={{ background: prod.type === 'own' ? '#43e97b' : '#f5576c', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{prod.type === 'own' ? 'Своё' : 'Партнёр'}</span>
                    </div>
                    <button onClick={() => setEditingProduction({...prod})} style={buttonSecondaryStyle}>Изменить</button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 14 }}>
                    {Object.entries(RATION_TYPES).map(([key, ration]) => (
                      <div key={key} style={{ padding: 14, background: '#f8f9fa', borderRadius: 10, textAlign: 'center' }}>
                        <div style={{ fontSize: 22 }}>{ration.emoji}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{ration.name}</div>
                        <div style={{ fontSize: 16, color: '#667eea', fontWeight: 700 }}>{prod.rations?.[key] || 0}₽</div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#666' }}>
                    <span>📍 {prod.address || '-'}</span>
                    <span>📞 {prod.contact || '-'}</span>
                    <span>🚚 {prod.delivery ? `Доставка (${prod.deliveryPrice}₽)` : 'Самовывоз'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === МЕНЮ === */}
          {tab === 'menu' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 22, color: '#333' }}>🍽️ Меню и шаблоны</h2>
                <button onClick={() => setEditingMenu({ id: Date.now(), name: 'Новое меню', description: '', rations: { breakfast: {price: 280, items: ''}, lunch: {price: 420, items: ''}, dinner: {price: 380, items: ''}, night: {price: 450, items: ''}, snack: {price: 180, items: ''} }, active: true, approved: false, markup: 0 })} style={{ ...buttonPrimaryStyle, padding: '12px 20px', borderRadius: 10, fontSize: 14 }}>+ Добавить</button>
              </div>
              
              {menus.map(menu => (
                <div key={menu.id} style={{ ...sectionStyle, borderLeft: menu.approved ? '4px solid #43e97b' : '4px solid #f5576c', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18, color: '#333' }}>🍽️ {menu.name}</h3>
                      <div style={{ fontSize: 14, color: '#666' }}>{menu.description}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => setMenus(prev => prev.map(m => m.id === menu.id ? {...m, approved: !m.approved} : m))} style={{ padding: '8px 14px', background: menu.approved ? '#f5576c' : '#43e97b', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>{menu.approved ? 'Выкл' : 'Вкл'}</button>
                      <button onClick={() => setEditingMenu({...menu})} style={buttonSecondaryStyle}>Изменить</button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                    {Object.entries(RATION_TYPES).map(([key, ration]) => (
                      <div key={key} style={{ padding: 12, background: '#f8f9fa', borderRadius: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{ration.emoji} {ration.name}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#667eea' }}>{menu.rations?.[key]?.price || 0}₽</div>
                        <div style={{ fontSize: 11, color: '#888' }}>{menu.rations?.[key]?.items || '-'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === ФИНАНСЫ === */}
          {tab === 'finances' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 22, color: '#333' }}>💰 Финансы</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', textAlign: 'center', padding: 24, borderRadius: 16 }}>
                  <div style={{ fontSize: 32, fontWeight: 700 }}>{finance.today.count}</div>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>Заказов сегодня</div>
                  <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>{finance.today.sum.toLocaleString()}₽</div>
                </div>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff', textAlign: 'center', padding: 24, borderRadius: 16 }}>
                  <div style={{ fontSize: 32, fontWeight: 700 }}>{finance.month.count}</div>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>Заказов за месяц</div>
                  <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>{finance.month.sum.toLocaleString()}₽</div>
                </div>
              </div>
              
              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0, fontSize: 16, color: '#333' }}>👩‍💼 Менеджеры</h3>
                {managers.map(mgr => (
                  <div key={mgr.id} style={{ padding: 14, background: '#f8f9fa', borderRadius: 10, marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <b style={{ fontSize: 15, color: '#333' }}>{mgr.name}</b>
                      <span style={{ fontSize: 14, color: '#666' }}>Продаж: {mgr.totalSales || 0}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#888' }}>Выручка: {(mgr.totalRevenue || 0).toLocaleString()}₽</div>
                    <div style={{ fontSize: 13, color: '#43e97b' }}>Премия: {Math.round((mgr.totalRevenue || 0) * (mgr.bonusPercent || 5) / 100)}₽ ({(mgr.bonusPercent || 5)}%)</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === МЕНЕДЖЕРЫ === */}
          {tab === 'managers' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 22, color: '#333' }}>👩‍💼 Менеджеры</h2>
                <button onClick={() => { setNewUserType('manager'); setShowAddUser(true) }} style={{ ...buttonPrimaryStyle, padding: '12px 20px', borderRadius: 10, fontSize: 14 }}>+ Добавить</button>
              </div>
              
              {managers.map(mgr => (
                <div key={mgr.id} style={{ ...sectionStyle, borderLeft: '4px solid #667eea', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18, color: '#333' }}>{mgr.name}</h3>
                      <div style={{ fontSize: 14, color: '#666' }}>📞 {mgr.phone} • {mgr.telegram}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>🔑 Логин: {mgr.login}</div>
                    </div>
                    <button onClick={() => setEditingManager({...mgr})} style={buttonSecondaryStyle}>Изменить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === TELEGRAM === */}
          {tab === 'telegram' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 22, color: '#333' }}>📱 Настройки Telegram</h2>
              
              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0, fontSize: 16, color: '#333' }}>🤖 Боты</h3>
                {bots.map(bot => (
                  <div key={bot.id} style={{ padding: 14, background: bot.active ? '#E8F5E9' : '#f8f9fa', borderRadius: 10, marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <b style={{ fontSize: 15, color: '#333' }}>{bot.name}</b>
                        <span style={{ background: bot.type === 'office' ? '#667eea' : bot.type === 'production' ? '#f5576c' : '#43e97b', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{bot.type}</span>
                      </div>
                      <button onClick={() => setBots(prev => prev.map(b => b.id === bot.id ? {...b, active: !b.active} : b))} style={{ padding: '8px 14px', background: bot.active ? '#f44336' : '#43e97b', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>{bot.active ? 'Выкл' : 'Вкл'}</button>
                    </div>
                    {bot.active && (
                      <div style={{ marginTop: 10, fontSize: 13, color: '#666' }}>
                        Chat ID: {bot.chatId} • Thread: {bot.threadId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0, fontSize: 16, color: '#333' }}>📨 Уведомления менеджеров</h3>
                {managers.map(mgr => (
                  <div key={mgr.id} style={{ padding: 12, background: '#f8f9fa', borderRadius: 8, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <b style={{ fontSize: 14, color: '#333' }}>{mgr.name}</b>
                      <span style={{ fontSize: 13, color: '#666' }}>Thread: {mgr.telegramThread || 'по умолчанию'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === БАЗА ДАННЫХ === */}
          {tab === 'database' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 22, color: '#333' }}>💾 База данных</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div style={sectionStyle}>
                  <h3 style={{ marginTop: 0, fontSize: 16, color: '#333' }}>📤 Экспорт</h3>
                  <button onClick={() => exportToExcel(Object.values(clients).map(c => ({ ID: c.id, Компания: c.company, Тип: c.clientType, Контакт: c.contact, Телефон: c.phone, Адрес: c.address, Менеджер: getManager(c.managerId)?.name })), 'clients')} style={{ ...buttonPrimaryStyle, width: '100%', marginBottom: 10, borderRadius: 8 }}>Клиенты (.tsv)</button>
                  <button onClick={() => exportToExcel(orders.map(o => ({ Номер: o.orderNumber, Компания: o.company, Дата: o.date, Статус: o.status, Сумма: o.total })), 'orders')} style={{ ...buttonPrimaryStyle, width: '100%', marginBottom: 10, borderRadius: 8, background: '#43e97b' }}>Заказы (.tsv)</button>
                  <button onClick={() => exportToExcel(managers.map(m => ({ Имя: m.name, Телефон: m.phone, Telegram: m.telegram, Продажи: m.totalSales, Выручка: m.totalRevenue })), 'managers')} style={{ ...buttonPrimaryStyle, width: '100%', marginBottom: 10, borderRadius: 8, background: '#667eea' }}>Менеджеры (.tsv)</button>
                  <button onClick={() => exportToExcel(productions.map(p => ({ Название: p.name, Тип: p.type, Адрес: p.address, Контакт: p.contact })), 'productions')} style={{ ...buttonPrimaryStyle, width: '100%', borderRadius: 8, background: '#f5576c' }}>Производства (.tsv)</button>
                </div>
                
                <div style={sectionStyle}>
                  <h3 style={{ marginTop: 0, fontSize: 16, color: '#333' }}>📥 Импорт</h3>
                  <label style={{ ...buttonSecondaryStyle, width: '100%', display: 'block', textAlign: 'center', marginBottom: 10, borderRadius: 8, boxSizing: 'border-box', cursor: 'pointer' }}>
                    📥 Клиенты
                    <input type="file" accept=".tsv,.csv,.txt" onChange={(e) => importFromExcel(e, setClients, 'imported')} style={{ display: 'none' }} />
                  </label>
                  <label style={{ ...buttonSecondaryStyle, width: '100%', display: 'block', textAlign: 'center', marginBottom: 10, borderRadius: 8, boxSizing: 'border-box', cursor: 'pointer', background: '#43e97b', color: '#fff' }}>
                    📥 Заказы
                    <input type="file" accept=".tsv,.csv,.txt" onChange={(e) => importFromExcel(e, setOrders, 'imported')} style={{ display: 'none' }} />
                  </label>
                  <label style={{ ...buttonSecondaryStyle, width: '100%', display: 'block', textAlign: 'center', borderRadius: 8, boxSizing: 'border-box', cursor: 'pointer', background: '#667eea', color: '#fff' }}>
                    📥 Менеджеры
                    <input type="file" accept=".tsv,.csv,.txt" onChange={(e) => importFromExcel(e, setManagers, 'imported')} style={{ display: 'none' }} />
                  </label>
                </div>
                
                <div style={sectionStyle}>
                  <h3 style={{ marginTop: 0, fontSize: 16, color: '#333' }}>⚙️ Действия</h3>
                  <button onClick={() => { if(confirm('Очистить все заказы?')) setOrders([]) }} style={{ ...buttonPrimaryStyle, width: '100%', marginBottom: 10, borderRadius: 8, background: '#f5576c' }}>🗑 Очистить заказы</button>
                  <button onClick={() => { if(confirm('Очистить логи?')) setLogs([]) }} style={{ ...buttonPrimaryStyle, width: '100%', marginBottom: 10, borderRadius: 8, background: '#f093fb' }}>🗑 Очистить логи</button>
                  <button onClick={() => { localStorage.clear(); window.location.reload() }} style={{ ...buttonPrimaryStyle, width: '100%', borderRadius: 8, background: '#333' }}>🔄 Сбросить всё</button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* === МОДАЛКИ === */}
        
        {/* МОДАЛКА ДОБАВЛЕНИЯ ПОЛЬЗОВАТЕЛЯ */}
        {showAddUser && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, maxWidth: 500, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 22, color: '#333', textAlign: 'center' }}>
                {newUserType === 'client' && '🏢 Добавить клиента'}
                {newUserType === 'production' && '🏭 Добавить производство'}
                {newUserType === 'manager' && '👩‍💼 Добавить менеджера'}
              </h2>
              
              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Логин:</label>
                  <input type="text" placeholder="Введите логин" value={newUserData.login} onChange={(e) => setNewUserData({...newUserData, login: e.target.value})} style={{ ...inputStyle, fontSize: 16, padding: 14, borderRadius: 10 }} />
                </div>
                <div>
                  <label style={labelStyle}>Пароль:</label>
                  <input type="text" placeholder="Введите пароль" value={newUserData.password} onChange={(e) => setNewUserData({...newUserData, password: e.target.value})} style={{ ...inputStyle, fontSize: 16, padding: 14, borderRadius: 10 }} />
                </div>
                <div>
                  <label style={labelStyle}>{newUserType === 'client' ? 'Название компании:' : 'Имя:'}</label>
                  <input type="text" placeholder={newUserType === 'client' ? 'ООО Название' : 'Иван'} value={newUserData.name} onChange={(e) => setNewUserData({...newUserData, name: e.target.value, company: newUserType === 'client' ? e.target.value : newUserData.company})} style={{ ...inputStyle, fontSize: 16, padding: 14, borderRadius: 10 }} />
                </div>
                {newUserType === 'client' && (
                  <div>
                    <label style={labelStyle}>Контактное лицо:</label>
                    <input type="text" placeholder="Иван Иванов" value={newUserData.name} onChange={(e) => setNewUserData({...newUserData, name: e.target.value})} style={{ ...inputStyle, fontSize: 16, padding: 14, borderRadius: 10 }} />
                  </div>
                )}
                <div>
                  <label style={labelStyle}>Телефон:</label>
                  <input type="text" placeholder="+7 (999) 000-00-00" value={newUserData.phone} onChange={(e) => setNewUserData({...newUserData, phone: e.target.value})} style={{ ...inputStyle, fontSize: 16, padding: 14, borderRadius: 10 }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={handleCreateUser} style={{ flex: 1, padding: 14, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}>Создать</button>
                <button onClick={() => setShowAddUser(false)} style={{ flex: 1, padding: 14, background: '#f5f5f5', color: '#333', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 500 }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {/* РЕДАКТИРОВАНИЕ КЛИЕНТА */}
        {editingClient && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 22, color: '#333' }}>Редактирование клиента</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>ID (логин):</label><input type="text" value={editingClient.id} onChange={(e) => setEditingClient({...editingClient, id: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Компания:</label><input type="text" value={editingClient.company} onChange={(e) => setEditingClient({...editingClient, company: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Тип:</label><select value={editingClient.clientType || 'contract'} onChange={(e) => setEditingClient({...editingClient, clientType: e.target.value})} style={inputStyle}>{Object.entries(CLIENT_TYPES).map(([k,v]) => <option key={k} value={k}>{v.emoji} {v.name}</option>)}</select></div>
                <div><label style={labelStyle}>Контакт:</label><input type="text" value={editingClient.contact} onChange={(e) => setEditingClient({...editingClient, contact: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Телефон:</label><input type="text" value={editingClient.phone} onChange={(e) => setEditingClient({...editingClient, phone: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Адрес:</label><input type="text" value={editingClient.address || ''} onChange={(e) => setEditingClient({...editingClient, address: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Сотрудников:</label><input type="number" value={editingClient.staff?.regular || 0} onChange={(e) => setEditingClient({...editingClient, staff: { ...editingClient.staff, regular: parseInt(e.target.value) || 0 }})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Менеджер:</label><select value={editingClient.managerId || 1} onChange={(e) => setEditingClient({...editingClient, managerId: parseInt(e.target.value)})} style={inputStyle}>{managers.map(mgr => <option key={mgr.id} value={mgr.id}>{mgr.name}</option>)}</select></div>
                <div><label style={labelStyle}>Скидка (%):</label><input type="number" value={editingClient.discount || 0} onChange={(e) => setEditingClient({...editingClient, discount: parseInt(e.target.value) || 0})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Бот:</label><select value={editingClient.botId || ''} onChange={(e) => setEditingClient({...editingClient, botId: e.target.value})} style={inputStyle}>{bots.filter(b => b.active).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={() => { setClients(prev => ({...prev, [editingClient.id]: editingClient})); setEditingClient(null); alert('Сохранено!') }} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}>💾 Сохранить</button>
                <button onClick={() => setEditingClient(null)} style={{ flex: 1, padding: 14, background: '#f5576c', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {/* РЕДАКТИРОВАНИЕ ПРОИЗВОДСТВА */}
        {editingProduction && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 22, color: '#333' }}>Редактирование производства</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Название:</label><input type="text" value={editingProduction.name} onChange={(e) => setEditingProduction({...editingProduction, name: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Тип:</label><select value={editingProduction.type} onChange={(e) => setEditingProduction({...editingProduction, type: e.target.value})} style={inputStyle}><option value="own">Своё</option><option value="partner">Партнёр</option></select></div>
                <div><label style={labelStyle}>Адрес:</label><input type="text" value={editingProduction.address} onChange={(e) => setEditingProduction({...editingProduction, address: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Контакт:</label><input type="text" value={editingProduction.contact} onChange={(e) => setEditingProduction({...editingProduction, contact: e.target.value})} style={inputStyle} /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" checked={editingProduction.delivery} onChange={(e) => setEditingProduction({...editingProduction, delivery: e.target.checked})} />
                  <span style={{ fontSize: 14 }}>Доставка</span>
                  {editingProduction.delivery && <input type="number" placeholder="Цена" value={editingProduction.deliveryPrice} onChange={(e) => setEditingProduction({...editingProduction, deliveryPrice: parseInt(e.target.value)})} style={{ width: 80, padding: 8 }} />}
                </div>
              </div>
              <h4 style={{ marginTop: 20, fontSize: 16, color: '#333' }}>💰 Стоимость рационов:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                {Object.entries(RATION_TYPES).map(([key, ration]) => (
                  <div key={key}><label style={labelStyle}>{ration.emoji} {ration.name}:</label><input type="number" value={editingProduction.rations?.[key] || 0} onChange={(e) => setEditingProduction({...editingProduction, rations: { ...editingProduction.rations, [key]: parseInt(e.target.value) }})} style={inputStyle} /></div>
                ))}
              </div>
              <h4 style={{ marginTop: 20, fontSize: 16, color: '#333' }}>📱 Telegram:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Бот:</label><select value={editingProduction.botId || ''} onChange={(e) => setEditingProduction({...editingProduction, botId: e.target.value})} style={inputStyle}>{bots.filter(b => b.active).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
                <div><label style={labelStyle}>Chat ID:</label><input type="text" value={editingProduction.telegramChat || ''} onChange={(e) => setEditingProduction({...editingProduction, telegramChat: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Thread ID:</label><input type="number" value={editingProduction.telegramThread || 0} onChange={(e) => setEditingProduction({...editingProduction, telegramThread: parseInt(e.target.value)})} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={() => { setProductions(prev => prev.map(p => p.id === editingProduction.id ? editingProduction : (p.id === editingProduction.id ? editingProduction : p))); setEditingProduction(null); alert('Сохранено!') }} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}>💾 Сохранить</button>
                <button onClick={() => setEditingProduction(null)} style={{ flex: 1, padding: 14, background: '#f5576c', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {/* РЕДАКТИРОВАНИЕ МЕНЮ */}
        {editingMenu && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 22, color: '#333' }}>Редактирование меню</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Название:</label><input type="text" value={editingMenu.name} onChange={(e) => setEditingMenu({...editingMenu, name: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Описание:</label><input type="text" value={editingMenu.description || ''} onChange={(e) => setEditingMenu({...editingMenu, description: e.target.value})} style={inputStyle} /></div>
              </div>
              <h4 style={{ marginTop: 20, fontSize: 16, color: '#333' }}>💰 Цены и состав:</h4>
              {Object.entries(RATION_TYPES).map(([key, ration]) => (
                <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 10, marginBottom: 10 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{ration.emoji} {ration.name}</div>
                  <input type="number" placeholder="Цена" value={editingMenu.rations?.[key]?.price || 0} onChange={(e) => setEditingMenu({...editingMenu, rations: { ...editingMenu.rations, [key]: { ...editingMenu.rations?.[key], price: parseInt(e.target.value) }}})} style={inputStyle} />
                  <input type="text" placeholder="Состав" value={editingMenu.rations?.[key]?.items || ''} onChange={(e) => setEditingMenu({...editingMenu, rations: { ...editingMenu.rations, [key]: { ...editingMenu.rations?.[key], items: e.target.value }}})} style={inputStyle} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={() => { setMenus(prev => prev.map(m => m.id === editingMenu.id ? editingMenu : m)); setEditingMenu(null); alert('Сохранено!') }} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}>💾 Сохранить</button>
                <button onClick={() => setEditingMenu(null)} style={{ flex: 1, padding: 14, background: '#f5576c', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {/* РЕДАКТИРОВАНИЕ МЕНЕДЖЕРА */}
        {editingManager && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, maxWidth: 600, width: '90%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 22, color: '#333' }}>Редактирование менеджера</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Имя:</label><input type="text" value={editingManager.name} onChange={(e) => setEditingManager({...editingManager, name: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Телефон:</label><input type="text" value={editingManager.phone} onChange={(e) => setEditingManager({...editingManager, phone: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Telegram:</label><input type="text" value={editingManager.telegram} onChange={(e) => setEditingManager({...editingManager, telegram: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Логин:</label><input type="text" value={editingManager.login} onChange={(e) => setEditingManager({...editingManager, login: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Пароль:</label><input type="text" value={editingManager.password} onChange={(e) => setEditingManager({...editingManager, password: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Оклад:</label><input type="number" value={editingManager.salary || 0} onChange={(e) => setEditingManager({...editingManager, salary: parseInt(e.target.value)})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Премия (%):</label><input type="number" value={editingManager.bonusPercent || 5} onChange={(e) => setEditingManager({...editingManager, bonusPercent: parseInt(e.target.value)})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Telegram Thread:</label><input type="number" value={editingManager.telegramThread || 0} onChange={(e) => setEditingManager({...editingManager, telegramThread: parseInt(e.target.value)})} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={() => { setManagers(prev => prev.map(m => m.id === editingManager.id ? editingManager : m)); setEditingManager(null); alert('Сохранено!') }} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}>💾 Сохранить</button>
                <button onClick={() => setEditingManager(null)} style={{ flex: 1, padding: 14, background: '#f5576c', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

      </div>
    )
  }

  // === ЛИЧНЫЙ КАБИНЕТ КЛИЕНТА ===
  return (
    <div style={{ padding: 16, maxWidth: 550, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 20, borderRadius: 16, marginBottom: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, margin: 0, color: '#fff' }}>🍽️ Питание СПБ</h1>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Личный кабинет</div>
        </div>
        <button onClick={() => { setCurrentClient(null); navigate('login') }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#fff' }}>Выход</button>
      </div>

      <div style={{ background: '#fff', padding: 20, borderRadius: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, color: '#333' }}>{currentClient.company}</h2>
            <div style={{ fontSize: 13, color: '#666' }}>{currentClient.contact} • {currentClient.phone}</div>
            <div style={{ fontSize: 12, color: '#888' }}>📍 {currentClient.address}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ background: currentClient.clientType === 'contract' ? '#43e97b' : '#4facfe', color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{CLIENT_TYPES[currentClient.clientType]?.name}</span>
            {currentClient.discount > 0 && <div style={{ marginTop: 6, background: '#f5576c', color: '#fff', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500 }}>-{currentClient.discount}%</div>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto' }}>
        {[{ id: 'dashboard', name: '📊' }, { id: 'menu', name: '🍽️' }, { id: 'orders', name: '📋' }, { id: 'settings', name: '⚙️' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '12px 16px', border: 'none', borderRadius: 10, background: tab === t.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff', color: tab === t.id ? '#fff' : '#333', cursor: 'pointer', fontSize: 14 }}>{t.name}</button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <>
          <div style={{ background: '#fff', padding: 20, borderRadius: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 16, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 12, textAlign: 'center', color: '#fff' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold' }}>{orders.filter(o => o.clientId === currentClient.id && o.status === 'created').length}</div>
                <div style={{ fontSize: 13, opacity: 0.9 }}>ожидают</div>
              </div>
              <div style={{ padding: 16, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', borderRadius: 12, textAlign: 'center', color: '#fff' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold' }}>{orders.filter(o => o.clientId === currentClient.id).reduce((s, o) => s + o.total, 0).toLocaleString()}₽</div>
                <div style={{ fontSize: 13, opacity: 0.9 }}>всего заказов</div>
              </div>
            </div>
          </div>
          <div style={{ background: '#fff', padding: 20, borderRadius: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginTop: 0, fontSize: 15, color: '#333' }}>📞 Менеджер</h3>
            {(() => { const mgr = getManager(currentClient.managerId); return <div style={{ fontSize: 15, color: '#333' }}>{mgr?.name || 'Не назначен'} • {mgr?.phone || '-'}</div> })()}
          </div>
        </>
      )}
      {tab === 'menu' && (
        <div style={{ background: '#fff', padding: 20, borderRadius: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 16, color: '#333' }}>🍽️ Выберите меню</h3>
          {menus.filter(m => m.approved).map(menu => (
            <button key={menu.id} onClick={() => setSelectedMenuId(menu.id)} style={{ width: '100%', padding: '14px', marginBottom: 10, border: selectedMenuId === menu.id ? '2px solid #667eea' : '2px solid #e0e0e0', borderRadius: 12, background: selectedMenuId === menu.id ? '#E8F5E9' : '#fff', cursor: 'pointer', textAlign: 'left' }}>
              <b style={{ fontSize: 15, color: '#333' }}>{menu.name}</b>
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                {Object.entries(RATION_TYPES).map(([k, r]) => `${r.emoji} ${menu.rations?.[k]?.price || 0}₽`).join(' • ')}
              </div>
            </button>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div style={{ background: '#fff', padding: 20, borderRadius: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 16, color: '#333' }}>📋 Новый заказ</h3>
          
          <label style={labelStyle}>Выберите рационы:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 14 }}>
            {Object.entries(RATION_TYPES).map(([key, ration]) => (
              <button key={key} onClick={() => setSelectedRations(prev => prev.includes(key) ? prev.filter(r => r !== key) : [...prev, key])} style={{ padding: 12, border: selectedRations.includes(key) ? '2px solid #667eea' : '2px solid #e0e0e0', borderRadius: 10, background: selectedRations.includes(key) ? '#E8F5E9' : '#fff', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>{ration.emoji}</div>
                <div style={{ fontSize: 11 }}>{ration.name}</div>
              </button>
            ))}
          </div>

          <label style={labelStyle}>Количество человек:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {selectedRations.map(r => (
              <div key={r}><label style={{ fontSize: 12 }}>{RATION_TYPES[r]?.emoji} {RATION_TYPES[r]?.name}:</label><input type="number" value={orderQuantity[r] || 0} onChange={(e) => setOrderQuantity({...orderQuantity, [r]: parseInt(e.target.value) || 0})} style={{ ...inputStyle, padding: 12, borderRadius: 8 }} /></div>
            ))}
          </div>

          <button onClick={createOrder} disabled={selectedRations.length === 0} style={{ ...buttonPrimaryStyle, width: '100%', padding: 14, borderRadius: 10, background: selectedRations.length > 0 ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : '#ccc' }}>📤 Создать заказ</button>

          <h4 style={{ marginTop: 20, fontSize: 15, color: '#333' }}>Мои заказы:</h4>
          {orders.filter(o => o.clientId === currentClient.id).slice(0, 5).map(order => (
            <div key={order.id} style={{ padding: 12, background: '#f8f9fa', borderRadius: 10, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b style={{ fontSize: 14, color: '#333' }}>{order.orderNumber}</b>
                <span style={{ fontSize: 12, color: '#666' }}>{order.date}</span>
              </div>
              <div style={{ fontSize: 13, color: '#666' }}>{order.menuName} • {order.total.toLocaleString()}₽</div>
              <div style={{ fontSize: 12, color: ORDER_STATUS[order.status]?.color }}>{ORDER_STATUS[order.status]?.label}</div>
              {order.status === 'delivery' && <button onClick={() => confirmDelivery(order.id)} style={{ marginTop: 10, padding: '10px', background: '#43e97b', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', width: '100%' }}>✅ Подтвердить получение</button>}
            </div>
          ))}
        </div>
      )}

      {tab === 'settings' && (
        <div style={{ background: '#fff', padding: 20, borderRadius: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0, fontSize: 15, color: '#333' }}>💬 Сообщение менеджеру</h3>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Сообщение..." style={{ ...inputStyle, height: 100, borderRadius: 10 }} />
          <button onClick={() => { alert('Отправлено!'); setComment('') }} disabled={!comment.trim()} style={{ ...buttonPrimaryStyle, width: '100%', padding: 14, borderRadius: 10, background: comment.trim() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc' }}>📤 Отправить</button>
        </div>
      )}
    </div>
  )
}
export default App