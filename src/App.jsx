import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom'

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

const BASE_USERS = {
  '0901SMOLADMIN': { id: '0901SmolAdmin', password: '0901SmolAdmin', role: 'admin', name: 'Админ', lastLogin: null },
  'ADMIN': { id: 'ADMIN', password: 'ADMIN', role: 'admin', name: 'Главный Админ', lastLogin: null },
  'OPERATOR1': { id: 'OPERATOR1', password: 'operator123', role: 'operator', name: 'Оператор 1 - Анна', managerId: 1, lastLogin: null },
  'OPERATOR2': { id: 'OPERATOR2', password: 'operator456', role: 'operator', name: 'Оператор 2 - Мария', managerId: 2, lastLogin: null },
  'OPERATOR3': { id: 'OPERATOR3', password: 'operator789', role: 'operator', name: 'Оператор 3 - Иван', managerId: 3, lastLogin: null },
  'PROD1': { id: 'PROD1', password: 'prod123', role: 'production', name: 'Производство СПБ', productionId: 1, lastLogin: null },
  'PROD2': { id: 'PROD2', password: 'prod456', role: 'production', name: 'Партнёр 1', productionId: 2, lastLogin: null },
  'TEST-001': { id: 'TEST-001', password: 'test', role: 'client', name: 'ООО ТехноСтрой', clientId: 'TEST-001', lastLogin: null },
  'TEST-002': { id: 'TEST-002', password: 'test', role: 'client', name: 'ИП Сидоров', clientId: 'TEST-002', lastLogin: null }
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

  useEffect(() => {
    const loadData = () => {
      const savedUsers = loadFromStorage('users')
      const mergedUsers = { ...BASE_USERS, ...(savedUsers || {}) }
      setUsers(mergedUsers)
      setClients(loadFromStorage('clients') || DEFAULT_CLIENTS)
      setOrders(loadFromStorage('orders') || [])
      setBots(loadFromStorage('bots') || DEFAULT_BOTS)
      setThreads(loadFromStorage('threads') || DEFAULT_THREADS)
      setManagers(loadFromStorage('managers') || DEFAULT_MANAGERS)
      setMenus(loadFromStorage('menus') || DEFAULT_MENUS)
      setProductions(loadFromStorage('productions') || DEFAULT_PRODUCTIONS)
      setLogs(loadFromStorage('logs') || [])
      setLoginHistory(loadFromStorage('loginHistory') || [])
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

  const finance = getFinanceStats()

  if (loading) return <div style={{ padding: 20, textAlign: 'center', fontFamily: 'system-ui' }}><div style={{ fontSize: 24 }}>⏳</div><div>Загрузка...</div></div>

  // === ВХОД ===
  if (!currentClient && view !== 'admin') {
    return (
      <div style={{ padding: 20, maxWidth: 420, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f0f2f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
            <h1 style={{ fontSize: 26, marginBottom: 6, color: '#1a1a1a', fontWeight: 700 }}>Питание СПБ</h1>
            <p style={{ color: '#666', fontSize: 14 }}>Личный кабинет клиента</p>
          </div>
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, marginBottom: 20, textAlign: 'center', fontSize: 18 }}>Вход в систему</h2>
            <form onSubmit={handleLogin}>
              <label style={labelStyle}>Логин</label>
              <input type="text" placeholder="Введите логин" value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} style={inputStyle} />
              <label style={labelStyle}>Пароль</label>
              <input type="password" placeholder="Введите пароль" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
              {loginError && <div style={{ color: '#f44336', marginBottom: 12, fontSize: 13 }}>{loginError}</div>}
              <button type="submit" style={{ ...buttonPrimaryStyle, width: '100%', padding: 14, fontSize: 15 }}>Войти</button>
            </form>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <button onClick={() => navigate('new')} style={{ background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer', fontSize: 13 }}>Оставить заявку</button>
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
        <div style={{ background: '#fff', padding: '12px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 28 }}>🍽️</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Питание СПБ</div>
              <div style={{ fontSize: 11, color: '#666' }}>Админ-панель</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#666' }}>{currentUser?.name}</span>
            <button onClick={() => { setCurrentUser(null); navigate('login') }} style={{ background: '#f5f5f5', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Выход</button>
          </div>
        </div>

        {/* TABS */}
        <div style={{ background: '#fff', padding: '8px 20px', borderBottom: '1px solid #eee', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {adminTabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '10px 16px', border: 'none', borderRadius: 8, background: tab === t.id ? '#1976D2' : 'transparent', color: tab === t.id ? '#fff' : '#333', cursor: 'pointer', fontSize: 14, fontWeight: '500', marginRight: 4 }}>
              {t.name} <span style={{ marginLeft: 4 }}>{t.title}</span>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
          
          {/* === ОБЗОР === */}
          {tab === 'dashboard' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20 }}>📊 Обзор системы</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#1976D2' }}>{Object.keys(clients).length}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>Клиентов</div>
                </div>
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#FF9800' }}>{orders.filter(o => o.status === 'created').length}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>Новых заказов</div>
                </div>
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#4CAF50' }}>{finance.today.count}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>Заказов сегодня</div>
                </div>
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#9C27B0' }}>{finance.month.sum.toLocaleString()}₽</div>
                  <div style={{ fontSize: 13, color: '#666' }}>За месяц</div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={sectionStyle}>
                  <h3 style={{ marginTop: 0, fontSize: 15 }}>📈 Последние заказы</h3>
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} style={{ padding: 10, background: '#f8f9fa', borderRadius: 6, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{order.orderNumber}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{order.company}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600 }}>{order.total.toLocaleString()}₽</div>
                        <div style={{ fontSize: 11, color: ORDER_STATUS[order.status]?.color }}>{ORDER_STATUS[order.status]?.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={sectionStyle}>
                  <h3 style={{ marginTop: 0, fontSize: 15 }}>📝 Журнал действий</h3>
                  {logs.slice(0, 5).map(log => (
                    <div key={log.id} style={{ padding: 8, borderBottom: '1px solid #eee', fontSize: 12 }}>
                      <div style={{ fontWeight: 500 }}>{log.action}</div>
                      <div style={{ color: '#666' }}>{log.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === КЛИЕНТЫ === */}
          {tab === 'clients' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>🏢 Клиенты</h2>
                <button onClick={() => setEditingClient({ id: 'NEW-' + Date.now().toString().slice(-4).toUpperCase(), company: '', contact: '', phone: '', address: '', clientType: 'contract', rations: ['lunch'], staff: { regular: 0 }, menuIds: [1], managerId: 1, active: true, featured: false, discount: 0, userLogins: [] })} style={buttonPrimaryStyle}>+ Добавить</button>
              </div>
              
              <input type="text" placeholder="Поиск клиентов..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle, marginBottom: 16, maxWidth: 300 }} />
              
              {Object.values(clients).filter(c => !searchQuery || c.company.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase())).map(c => {
                const mgr = getManager(c.managerId)
                return (
                  <div key={c.id} style={{ ...sectionStyle, borderLeft: c.featured ? '4px solid #FF9800' : '4px solid #1976D2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <h3 style={{ margin: 0, fontSize: 17 }}>{c.company}</h3>
                          <span style={{ background: c.clientType === 'contract' ? '#4CAF50' : c.clientType === 'daily' ? '#2196F3' : '#9C27B0', color: '#fff', padding: '3px 10px', borderRadius: 12, fontSize: 11 }}>{CLIENT_TYPES[c.clientType]?.emoji} {CLIENT_TYPES[c.clientType]?.name}</span>
                          {c.featured && <span style={{ background: '#FF9800', color: '#fff', padding: '3px 10px', borderRadius: 12, fontSize: 11 }}>VIP</span>}
                          {!c.active && <span style={{ background: '#f44336', color: '#fff', padding: '3px 10px', borderRadius: 12, fontSize: 11 }}>ОТКЛ</span>}
                        </div>
                        <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>ID: {c.id} • {c.contact} • {c.phone}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>📍 {c.address || '-'}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                        <div style={{ fontSize: 13 }}>👤 Менеджер: <b>{mgr?.name || '-'}</b></div>
                        <div style={{ fontSize: 13 }}>👥 <b>{c.staff?.regular || 0}</b> чел.</div>
                        <button onClick={() => setEditingClient({...c})} style={{ padding: '8px 16px', background: '#1976D2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Изменить</button>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>👥 Пользователи системы</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => exportToExcel(Object.values(clients).map(c => ({ ID: c.id, Компания: c.company, Тип: c.clientType, Контакт: c.contact, Телефон: c.phone, Адрес: c.address, Менеджер: getManager(c.managerId)?.name, Активен: c.active ? 'Да' : 'Нет' })), 'clients')} style={buttonSecondaryStyle}>📥 Экспорт</button>
                  <label style={buttonSecondaryStyle} style={{ ...buttonSecondaryStyle, display: 'flex', alignItems: 'center' }}>
                    📤 Импорт
                    <input type="file" accept=".tsv,.csv,.txt" onChange={(e) => importFromExcel(e, setClients, 'imported')} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
              
              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0, fontSize: 15 }}>🔑 Логины клиентов</h3>
                {Object.values(clients).map(c => (
                  <div key={c.id} style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <b>{c.company}</b>
                        <div style={{ fontSize: 12, color: '#666' }}>{c.id}</div>
                      </div>
                      <div style={{ fontSize: 12 }}>
                        Логинов: {c.userLogins?.length || 0} / {c.freeLogins || 1}
                      </div>
                    </div>
                    {c.userLogins?.map((u, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginTop: 8, padding: 8, background: '#f8f9fa', borderRadius: 6 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{u.login}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#666' }}>{u.password}</span>
                        <span style={{ fontSize: 12, color: '#888' }}>- {u.name}</span>
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
              <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20 }}>📋 Все заказы ({orders.length})</h2>
              
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
                  <option value="all">Все статусы</option>
                  {Object.entries(ORDER_STATUS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
                </select>
              </div>
              
              {orders.filter(o => filterStatus === 'all' || o.status === filterStatus).slice(0, 30).map(order => (
                <div key={order.id} style={{ ...sectionStyle, borderLeft: `4px solid ${ORDER_STATUS[order.status]?.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{order.orderNumber}</div>
                      <div style={{ fontSize: 13 }}>{order.company}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{order.date} • {order.menuName}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 18 }}>{order.total.toLocaleString()}₽</div>
                      <span style={{ padding: '4px 12px', background: ORDER_STATUS[order.status]?.bg, color: ORDER_STATUS[order.status]?.color, borderRadius: 12, fontSize: 12 }}>{ORDER_STATUS[order.status]?.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === ОЖИДАНИЕ === */}
          {tab === 'waiting' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20 }}>📥 Ожидают подтверждения ({orders.filter(o => o.status === 'created').length})</h2>
              {orders.filter(o => o.status === 'created').map(order => (
                <div key={order.id} style={{ ...sectionStyle, borderLeft: '4px solid #FF9800' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{order.orderNumber}</div>
                      <div style={{ fontSize: 14 }}>{order.company}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>📍 {order.address}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{order.rations?.map(r => RATION_TYPES[r]?.emoji).join(' ')}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 18, color: '#FF9800' }}>{order.total.toLocaleString()}₽</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={() => updateOrderStatus(order.id, 'confirmed')} style={{ flex: 1, padding: 12, background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>✓ Подтвердить</button>
                    <button onClick={() => updateOrderStatus(order.id, 'cancelled')} style={{ flex: 1, padding: 12, background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>✕ Отклонить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === ПРОИЗВОДСТВО === */}
          {tab === 'production' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20 }}>🏭 В работе ({orders.filter(o => ['confirmed', 'production', 'delivery'].includes(o.status)).length})</h2>
              {orders.filter(o => ['confirmed', 'production', 'delivery'].includes(o.status)).map(order => (
                <div key={order.id} style={{ ...sectionStyle, borderLeft: '4px solid #9C27B0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{order.orderNumber}</div>
                      <div style={{ fontSize: 14 }}>{order.company}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{order.menuName}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700 }}>{order.total.toLocaleString()}₽</div>
                      <span style={{ padding: '4px 12px', background: ORDER_STATUS[order.status]?.bg, color: ORDER_STATUS[order.status]?.color, borderRadius: 12, fontSize: 12 }}>{ORDER_STATUS[order.status]?.label}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {order.status === 'confirmed' && <button onClick={() => updateOrderStatus(order.id, 'production')} style={{ flex: 1, padding: 12, background: '#9C27B0', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>🏭 Принять</button>}
                    {order.status === 'production' && <button onClick={() => updateOrderStatus(order.id, 'delivery')} style={{ flex: 1, padding: 12, background: '#2196F3', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>🚚 Отправить</button>}
                    {order.status === 'delivery' && <button onClick={() => updateOrderStatus(order.id, 'delivered')} style={{ flex: 1, padding: 12, background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>✅ Доставлен</button>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === ПРОИЗВОДСТВА (КОНСТРУКТОР) === */}
          {tab === 'productions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>⚙️ Производства</h2>
                <button onClick={() => setEditingProduction({ id: Date.now(), name: 'Новое производство', type: 'partner', address: '', contact: '', delivery: false, deliveryPrice: 0, active: true, rations: { breakfast: 280, lunch: 420, dinner: 380, night: 450, snack: 180 }, botId: '', telegramChat: '', telegramThread: 0 })} style={buttonPrimaryStyle}>+ Добавить</button>
              </div>
              
              {productions.map(prod => (
                <div key={prod.id} style={{ ...sectionStyle, borderLeft: prod.type === 'own' ? '4px solid #4CAF50' : '4px solid #FF9800' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 17 }}>🏭 {prod.name}</h3>
                      <span style={{ background: prod.type === 'own' ? '#4CAF50' : '#FF9800', color: '#fff', padding: '3px 10px', borderRadius: 12, fontSize: 11 }}>{prod.type === 'own' ? 'Своё' : 'Партнёр'}</span>
                    </div>
                    <button onClick={() => setEditingProduction({...prod})} style={buttonSecondaryStyle}>Изменить</button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 12 }}>
                    {Object.entries(RATION_TYPES).map(([key, ration]) => (
                      <div key={key} style={{ padding: 10, background: '#f8f9fa', borderRadius: 6, textAlign: 'center' }}>
                        <div style={{ fontSize: 20 }}>{ration.emoji}</div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{ration.name}</div>
                        <div style={{ fontSize: 14, color: '#1976D2', fontWeight: 700 }}>{prod.rations?.[key] || 0}₽</div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#666' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>🍽️ Меню и шаблоны</h2>
                <button onClick={() => setEditingMenu({ id: Date.now(), name: 'Новое меню', description: '', rations: { breakfast: {price: 280, items: ''}, lunch: {price: 420, items: ''}, dinner: {price: 380, items: ''}, night: {price: 450, items: ''}, snack: {price: 180, items: ''} }, active: true, approved: false, markup: 0 })} style={buttonPrimaryStyle}>+ Добавить</button>
              </div>
              
              {menus.map(menu => (
                <div key={menu.id} style={{ ...sectionStyle, borderLeft: menu.approved ? '4px solid #4CAF50' : '4px solid #FF9800' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 17 }}>🍽️ {menu.name}</h3>
                      <div style={{ fontSize: 13, color: '#666' }}>{menu.description}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setMenus(prev => prev.map(m => m.id === menu.id ? {...m, approved: !m.approved} : m))} style={{ padding: '6px 12px', background: menu.approved ? '#FF9800' : '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>{menu.approved ? 'Выкл' : 'Вкл'}</button>
                      <button onClick={() => setEditingMenu({...menu})} style={buttonSecondaryStyle}>Изменить</button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                    {Object.entries(RATION_TYPES).map(([key, ration]) => (
                      <div key={key} style={{ padding: 10, background: '#f8f9fa', borderRadius: 6 }}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{ration.emoji} {ration.name}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#1976D2' }}>{menu.rations?.[key]?.price || 0}₽</div>
                        <div style={{ fontSize: 10, color: '#666' }}>{menu.rations?.[key]?.items || '-'}</div>
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
              <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20 }}>💰 Финансы</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 20 }}>
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#1976D2' }}>{finance.today.count}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>Заказов сегодня</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1976D2', marginTop: 8 }}>{finance.today.sum.toLocaleString()}₽</div>
                </div>
                <div style={{ ...sectionStyle, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#FF9800' }}>{finance.month.count}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>Заказов за месяц</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#FF9800', marginTop: 8 }}>{finance.month.sum.toLocaleString()}₽</div>
                </div>
              </div>
              
              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0, fontSize: 15 }}>👩‍💼 Менеджеры</h3>
                {managers.map(mgr => (
                  <div key={mgr.id} style={{ padding: 12, background: '#f8f9fa', borderRadius: 8, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <b>{mgr.name}</b>
                      <span style={{ fontSize: 13 }}>Продаж: {mgr.totalSales || 0}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>Выручка: {(mgr.totalRevenue || 0).toLocaleString()}₽</div>
                    <div style={{ fontSize: 12, color: '#4CAF50' }}>Премия: {Math.round((mgr.totalRevenue || 0) * (mgr.bonusPercent || 5) / 100)}₽ ({(mgr.bonusPercent || 5)}%)</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === МЕНЕДЖЕРЫ === */}
          {tab === 'managers' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 20 }}>👩‍💼 Менеджеры</h2>
                <button onClick={() => setEditingManager({ id: Date.now(), name: '', phone: '', telegram: '', login: '', password: '', bonusPercent: 5, salary: 50000, active: true, botId: 'bot1', telegramThread: 0 })} style={buttonPrimaryStyle}>+ Добавить</button>
              </div>
              
              {managers.map(mgr => (
                <div key={mgr.id} style={{ ...sectionStyle, borderLeft: '4px solid #9C27B0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 17 }}>{mgr.name}</h3>
                      <div style={{ fontSize: 13, color: '#666' }}>📞 {mgr.phone} • {mgr.telegram}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>🔑 Логин: {mgr.login}</div>
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
              <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20 }}>📱 Настройки Telegram</h2>
              
              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0, fontSize: 15 }}>🤖 Боты</h3>
                {bots.map(bot => (
                  <div key={bot.id} style={{ padding: 12, background: bot.active ? '#E8F5E9' : '#f8f9fa', borderRadius: 8, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <b>{bot.name}</b>
                        <span style={{ background: bot.type === 'office' ? '#9C27B0' : bot.type === 'production' ? '#FF9800' : '#4CAF50', color: '#fff', padding: '3px 10px', borderRadius: 12, fontSize: 11 }}>{bot.type}</span>
                      </div>
                      <button onClick={() => setBots(prev => prev.map(b => b.id === bot.id ? {...b, active: !b.active} : b))} style={{ padding: '6px 12px', background: bot.active ? '#f44336' : '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>{bot.active ? 'Выкл' : 'Вкл'}</button>
                    </div>
                    {bot.active && (
                      <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                        Chat ID: {bot.chatId} • Thread: {bot.threadId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0, fontSize: 15 }}>📨 Уведомления менеджеров</h3>
                {managers.map(mgr => (
                  <div key={mgr.id} style={{ padding: 12, background: '#f8f9fa', borderRadius: 8, marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <b>{mgr.name}</b>
                      <span style={{ fontSize: 12, color: '#666' }}>Thread: {mgr.telegramThread || 'по умолчанию'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === БАЗА ДАННЫХ === */}
          {tab === 'database' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20 }}>💾 База данных</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div style={sectionStyle}>
                  <h3 style={{ marginTop: 0, fontSize: 15 }}>📤 Экспорт</h3>
                  <button onClick={() => exportToExcel(Object.values(clients).map(c => ({ ID: c.id, Компания: c.company, Тип: c.clientType, Контакт: c.contact, Телефон: c.phone, Адрес: c.address, Менеджер: getManager(c.managerId)?.name })), 'clients')} style={{ ...buttonPrimaryStyle, width: '100%', marginBottom: 8 }}>Клиенты (.tsv)</button>
                  <button onClick={() => exportToExcel(orders.map(o => ({ Номер: o.orderNumber, Компания: o.company, Дата: o.date, Статус: o.status, Сумма: o.total })), 'orders')} style={{ ...buttonPrimaryStyle, width: '100%', marginBottom: 8, background: '#4CAF50' }}>Заказы (.tsv)</button>
                  <button onClick={() => exportToExcel(managers.map(m => ({ Имя: m.name, Телефон: m.phone, Telegram: m.telegram, Продажи: m.totalSales, Выручка: m.totalRevenue })), 'managers')} style={{ ...buttonPrimaryStyle, width: '100%', marginBottom: 8, background: '#9C27B0' }}>Менеджеры (.tsv)</button>
                  <button onClick={() => exportToExcel(productions.map(p => ({ Название: p.name, Тип: p.type, Адрес: p.address, Контакт: p.contact })), 'productions')} style={{ ...buttonPrimaryStyle, width: '100%', background: '#FF9800' }}>Производства (.tsv)</button>
                </div>
                
                <div style={sectionStyle}>
                  <h3 style={{ marginTop: 0, fontSize: 15 }}>📥 Импорт</h3>
                  <label style={{ ...buttonSecondaryStyle, width: '100%', display: 'block', textAlign: 'center', marginBottom: 8, boxSizing: 'border-box' }}>
                    📥 Клиенты
                    <input type="file" accept=".tsv,.csv,.txt" onChange={(e) => importFromExcel(e, setClients, 'imported')} style={{ display: 'none' }} />
                  </label>
                  <label style={{ ...buttonSecondaryStyle, width: '100%', display: 'block', textAlign: 'center', marginBottom: 8, boxSizing: 'border-box', background: '#4CAF50', color: '#fff' }}>
                    📥 Заказы
                    <input type="file" accept=".tsv,.csv,.txt" onChange={(e) => importFromExcel(e, setOrders, 'imported')} style={{ display: 'none' }} />
                  </label>
                  <label style={{ ...buttonSecondaryStyle, width: '100%', display: 'block', textAlign: 'center', boxSizing: 'border-box', background: '#9C27B0', color: '#fff' }}>
                    📥 Менеджеры
                    <input type="file" accept=".tsv,.csv,.txt" onChange={(e) => importFromExcel(e, setManagers, 'imported')} style={{ display: 'none' }} />
                  </label>
                </div>
                
                <div style={sectionStyle}>
                  <h3 style={{ marginTop: 0, fontSize: 15 }}>⚙️ Действия</h3>
                  <button onClick={() => { if(confirm('Очистить все заказы?')) setOrders([]) }} style={{ ...buttonPrimaryStyle, width: '100%', marginBottom: 8, background: '#f44336' }}>🗑 Очистить заказы</button>
                  <button onClick={() => { if(confirm('Очистить логи?')) setLogs([]) }} style={{ ...buttonPrimaryStyle, width: '100%', marginBottom: 8, background: '#FF9800' }}>🗑 Очистить логи</button>
                  <button onClick={() => { localStorage.clear(); window.location.reload() }} style={{ ...buttonPrimaryStyle, width: '100%', background: '#333' }}>🔄 Сбросить всё</button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* === МОДАЛКИ === */}
        
        {/* РЕДАКТИРОВАНИЕ КЛИЕНТА */}
        {editingClient && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 16, maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>Редактирование клиента</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button onClick={() => { setClients(prev => ({...prev, [editingClient.id]: editingClient})); setEditingClient(null); alert('Сохранено!') }} style={{ ...buttonPrimaryStyle, background: '#4CAF50' }}>💾 Сохранить</button>
                <button onClick={() => setEditingClient(null)} style={{ ...buttonPrimaryStyle, background: '#f44336' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {/* РЕДАКТИРОВАНИЕ ПРОИЗВОДСТВА */}
        {editingProduction && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 16, maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>Редактирование производства</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Название:</label><input type="text" value={editingProduction.name} onChange={(e) => setEditingProduction({...editingProduction, name: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Тип:</label><select value={editingProduction.type} onChange={(e) => setEditingProduction({...editingProduction, type: e.target.value})} style={inputStyle}><option value="own">Своё</option><option value="partner">Партнёр</option></select></div>
                <div><label style={labelStyle}>Адрес:</label><input type="text" value={editingProduction.address} onChange={(e) => setEditingProduction({...editingProduction, address: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Контакт:</label><input type="text" value={editingProduction.contact} onChange={(e) => setEditingProduction({...editingProduction, contact: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Доставка:</label><input type="checkbox" checked={editingProduction.delivery} onChange={(e) => setEditingProduction({...editingProduction, delivery: e.target.checked})} /><span style={{ marginLeft: 8 }}>{editingProduction.delivery ? `Цена: ${editingProduction.deliveryPrice}₽` : 'Самовывоз'}</span></div>
                {editingProduction.delivery && <div><label style={labelStyle}>Цена доставки:</label><input type="number" value={editingProduction.deliveryPrice} onChange={(e) => setEditingProduction({...editingProduction, deliveryPrice: parseInt(e.target.value)})} style={inputStyle} /></div>}
              </div>
              <h4 style={{ marginTop: 16 }}>💰 Стоимость рационов:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {Object.entries(RATION_TYPES).map(([key, ration]) => (
                  <div key={key}><label style={labelStyle}>{ration.emoji} {ration.name}:</label><input type="number" value={editingProduction.rations?.[key] || 0} onChange={(e) => setEditingProduction({...editingProduction, rations: { ...editingProduction.rations, [key]: parseInt(e.target.value) }})} style={inputStyle} /></div>
                ))}
              </div>
              <h4 style={{ marginTop: 16 }}>📱 Telegram:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Бот:</label><select value={editingProduction.botId || ''} onChange={(e) => setEditingProduction({...editingProduction, botId: e.target.value})} style={inputStyle}>{bots.filter(b => b.active).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
                <div><label style={labelStyle}>Chat ID:</label><input type="text" value={editingProduction.telegramChat || ''} onChange={(e) => setEditingProduction({...editingProduction, telegramChat: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Thread ID:</label><input type="number" value={editingProduction.telegramThread || 0} onChange={(e) => setEditingProduction({...editingProduction, telegramThread: parseInt(e.target.value)})} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button onClick={() => { setProductions(prev => prev.map(p => p.id === editingProduction.id ? editingProduction : [...prev, editingProduction])); setEditingProduction(null); alert('Сохранено!') }} style={{ ...buttonPrimaryStyle, background: '#4CAF50' }}>💾 Сохранить</button>
                <button onClick={() => setEditingProduction(null)} style={{ ...buttonPrimaryStyle, background: '#f44336' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {/* РЕДАКТИРОВАНИЕ МЕНЮ */}
        {editingMenu && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 16, maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>Редактирование меню</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Название:</label><input type="text" value={editingMenu.name} onChange={(e) => setEditingMenu({...editingMenu, name: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Описание:</label><input type="text" value={editingMenu.description || ''} onChange={(e) => setEditingMenu({...editingMenu, description: e.target.value})} style={inputStyle} /></div>
              </div>
              <h4 style={{ marginTop: 16 }}>💰 Цены и состав:</h4>
              {Object.entries(RATION_TYPES).map(([key, ration]) => (
                <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontWeight: 500 }}>{ration.emoji} {ration.name}</div>
                  <input type="number" placeholder="Цена" value={editingMenu.rations?.[key]?.price || 0} onChange={(e) => setEditingMenu({...editingMenu, rations: { ...editingMenu.rations, [key]: { ...editingMenu.rations?.[key], price: parseInt(e.target.value) }}})} style={inputStyle} />
                  <input type="text" placeholder="Состав" value={editingMenu.rations?.[key]?.items || ''} onChange={(e) => setEditingMenu({...editingMenu, rations: { ...editingMenu.rations, [key]: { ...editingMenu.rations?.[key], items: e.target.value }}})} style={inputStyle} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button onClick={() => { setMenus(prev => prev.map(m => m.id === editingMenu.id ? editingMenu : [...prev, editingMenu])); setEditingMenu(null); alert('Сохранено!') }} style={{ ...buttonPrimaryStyle, background: '#4CAF50' }}>💾 Сохранить</button>
                <button onClick={() => setEditingMenu(null)} style={{ ...buttonPrimaryStyle, background: '#f44336' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {/* РЕДАКТИРОВАНИЕ МЕНЕДЖЕРА */}
        {editingManager && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 16, maxWidth: 600, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>Редактирование менеджера</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Имя:</label><input type="text" value={editingManager.name} onChange={(e) => setEditingManager({...editingManager, name: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Телефон:</label><input type="text" value={editingManager.phone} onChange={(e) => setEditingManager({...editingManager, phone: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Telegram:</label><input type="text" value={editingManager.telegram} onChange={(e) => setEditingManager({...editingManager, telegram: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Логин:</label><input type="text" value={editingManager.login} onChange={(e) => setEditingManager({...editingManager, login: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Пароль:</label><input type="text" value={editingManager.password} onChange={(e) => setEditingManager({...editingManager, password: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Оклад:</label><input type="number" value={editingManager.salary || 0} onChange={(e) => setEditingManager({...editingManager, salary: parseInt(e.target.value)})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Премия (%):</label><input type="number" value={editingManager.bonusPercent || 5} onChange={(e) => setEditingManager({...editingManager, bonusPercent: parseInt(e.target.value)})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Telegram Thread:</label><input type="number" value={editingManager.telegramThread || 0} onChange={(e) => setEditingManager({...editingManager, telegramThread: parseInt(e.target.value)})} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button onClick={() => { setManagers(prev => prev.map(m => m.id === editingManager.id ? editingManager : [...prev, editingManager])); setEditingManager(null); alert('Сохранено!') }} style={{ ...buttonPrimaryStyle, background: '#4CAF50' }}>💾 Сохранить</button>
                <button onClick={() => setEditingManager(null)} style={{ ...buttonPrimaryStyle, background: '#f44336' }}>Отмена</button>
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
      <div style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 20, margin: 0, color: '#1976D2' }}>🍽️ Питание СПБ</h1>
          <div style={{ fontSize: 12, color: '#666' }}>Личный кабинет</div>
        </div>
        <button onClick={() => { setCurrentClient(null); navigate('login') }} style={{ background: '#f5f5f5', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Выход</button>
      </div>

      <div style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 17 }}>{currentClient.company}</h2>
            <div style={{ fontSize: 12, color: '#666' }}>{currentClient.contact} • {currentClient.phone}</div>
            <div style={{ fontSize: 11, color: '#888' }}>📍 {currentClient.address}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ background: currentClient.clientType === 'contract' ? '#4CAF50' : '#2196F3', color: '#fff', padding: '4px 10px', borderRadius: 12, fontSize: 11 }}>{CLIENT_TYPES[currentClient.clientType]?.name}</span>
            {currentClient.discount > 0 && <div style={{ marginTop: 4, background: '#FF9800', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>-{currentClient.discount}%</div>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto' }}>
        {[{ id: 'dashboard', name: '📊' }, { id: 'menu', name: '🍽️' }, { id: 'orders', name: '📋' }, { id: 'settings', name: '⚙️' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '10px 14px', border: 'none', borderRadius: 8, background: tab === t.id ? '#1976D2' : '#fff', color: tab === t.id ? '#fff' : '#333', cursor: 'pointer', fontSize: 14 }}>{t.name}</button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <>
          <div style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 14, background: '#E3F2FD', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1976D2' }}>{orders.filter(o => o.clientId === currentClient.id && o.status === 'created').length}</div>
                <div style={{ fontSize: 12, color: '#666' }}>ожидают</div>
              </div>
              <div style={{ padding: 14, background: '#E8F5E9', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4CAF50' }}>{orders.filter(o => o.clientId === currentClient.id).reduce((s, o) => s + o.total, 0).toLocaleString()}₽</div>
                <div style={{ fontSize: 12, color: '#666' }}>всего заказов</div>
              </div>
            </div>
          </div>
          <div style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginTop: 0, fontSize: 14 }}>📞 Менеджер</h3>
            {(() => { const mgr = getManager(currentClient.managerId); return <div style={{ fontSize: 14 }}>{mgr?.name || 'Не назначен'} • {mgr?.phone || '-'}</div> })()}
          </div>
        </>
      )}

      {tab === 'menu' && (
        <div style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>🍽️ Выберите меню</h3>
          {menus.filter(m => m.approved).map(menu => (
            <button key={menu.id} onClick={() => setSelectedMenuId(menu.id)} style={{ width: '100%', padding: '12px', marginBottom: 8, border: selectedMenuId === menu.id ? '2px solid #1976D2' : '2px solid #e0e0e0', borderRadius: 8, background: selectedMenuId === menu.id ? '#E3F2FD' : '#fff', cursor: 'pointer', textAlign: 'left' }}>
              <b>{menu.name}</b>
              <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                {Object.entries(RATION_TYPES).map(([k, r]) => `${r.emoji} ${menu.rations?.[k]?.price || 0}₽`).join(' • ')}
              </div>
            </button>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>📋 Новый заказ</h3>
          
          <label style={labelStyle}>Выберите рационы:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 12 }}>
            {Object.entries(RATION_TYPES).map(([key, ration]) => (
              <button key={key} onClick={() => setSelectedRations(prev => prev.includes(key) ? prev.filter(r => r !== key) : [...prev, key])} style={{ padding: 10, border: selectedRations.includes(key) ? '2px solid #1976D2' : '2px solid #e0e0e0', borderRadius: 8, background: selectedRations.includes(key) ? '#E3F2FD' : '#fff', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 18 }}>{ration.emoji}</div>
                <div style={{ fontSize: 10 }}>{ration.name}</div>
              </button>
            ))}
          </div>

          <label style={labelStyle}>Количество человек:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {selectedRations.map(r => (
              <div key={r}><label style={{ fontSize: 11 }}>{RATION_TYPES[r]?.emoji} {RATION_TYPES[r]?.name}:</label><input type="number" value={orderQuantity[r] || 0} onChange={(e) => setOrderQuantity({...orderQuantity, [r]: parseInt(e.target.value) || 0})} style={inputStyle} /></div>
            ))}
          </div>

          <button onClick={createOrder} disabled={selectedRations.length === 0} style={{ ...buttonPrimaryStyle, width: '100%', background: selectedRations.length > 0 ? '#4CAF50' : '#ccc' }}>📤 Создать заказ</button>

          <h4 style={{ marginTop: 16 }}>Мои заказы:</h4>
          {orders.filter(o => o.clientId === currentClient.id).slice(0, 5).map(order => (
            <div key={order.id} style={{ padding: 10, background: '#f5f5f5', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>{order.orderNumber}</b>
                <span style={{ fontSize: 11, color: '#666' }}>{order.date}</span>
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>{order.menuName} • {order.total.toLocaleString()}₽</div>
              <div style={{ fontSize: 11, color: ORDER_STATUS[order.status]?.color }}>{ORDER_STATUS[order.status]?.label}</div>
              {order.status === 'delivery' && <button onClick={() => confirmDelivery(order.id)} style={{ marginTop: 8, padding: '8px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', width: '100%' }}>✅ Подтвердить получение</button>}
            </div>
          ))}
        </div>
      )}

      {tab === 'settings' && (
        <div style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0, fontSize: 14 }}>💬 Сообщение менеджеру</h3>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Сообщение..." style={{ ...inputStyle, height: 80 }} />
          <button onClick={() => { alert('Отправлено!'); setComment('') }} disabled={!comment.trim()} style={{ ...buttonPrimaryStyle, width: '100%', background: comment.trim() ? '#4CAF50' : '#ccc' }}>📤 Отправить</button>
        </div>
      )}
    </div>
  )
}

export default App