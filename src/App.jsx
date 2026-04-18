import { useState, useEffect } from 'react'

const COMPANY_TYPES = [
  { id: 'office', name: 'Офис', emoji: '🏢' },
  { id: 'plant', name: 'Производство', emoji: '🏭' },
  { id: 'quarter', name: 'Квартал', emoji: '📅' }
]

// ТИПЫ КЛИЕНТОВ
const CLIENT_TYPES = {
  contract: { id: 'contract', name: 'По договору', emoji: '📋' },
  daily: { id: 'daily', name: 'Ежедневный', emoji: '📅' }
}

// ТИПЫ РАЦИОНА
const RATION_TYPES = {
  breakfast: { id: 'breakfast', name: 'Завтрак', emoji: '🥐', time: '07:30-08:30' },
  lunch: { id: 'lunch', name: 'Обед', emoji: '🍱', time: '12:00-13:00' },
  dinner: { id: 'dinner', name: 'Ужин', emoji: '🍽️', time: '17:30-18:30' },
  night: { id: 'night', name: 'Ночной', emoji: '🌙', time: '23:00-00:00' }
}

// СТАТУСЫ ЗАКАЗА
const ORDER_STATUS = {
  created: '⏳ Создан',
  confirmed: '✓ Подтверждён',
  production: '🏭 На производстве',
  delivery: '🚚 В доставке',
  delivered: '✅ Получен клиентом',
  cancelled: '❌ Отменён',
  auto_confirmed: '🤖 Автоподтверждён'
}

const SPREADSHEET_ID = '1VRSHLi1eu7k5cT6lAYWvXbIToTpcMj1rx2saiWwENp4'

const DEFAULT_BOTS = [
  { id: 'bot1', name: 'Бот офиса', token: '6706048508:AAF-8INmBKwP1x7DA-_ET8D282c5pp0Rn2Y', chatId: '-1002583331823', active: true, type: 'office' },
  { id: 'bot2', name: 'Бот производства', token: '', chatId: '', active: false, type: 'production' },
  { id: 'bot3', name: 'Бот клиентов', token: '', chatId: '', active: false, type: 'clients' }
]

const DEFAULT_THREADS = { waiting: 360, newUser: 361, history: 362, orders: 359, production: 363, delivery: 364 }

// МЕНЮ С РАЦИОНАМИ
const DEFAULT_MENUS = [
  { 
    id: 1, 
    name: 'Стандартное', 
    description: 'Обычное питание', 
    rations: { 
      breakfast: { price: 280, items: 'Каша, чай, хлеб, фрукты' },
      lunch: { price: 420, items: 'Суп, второе, компот, хлеб' },
      dinner: { price: 380, items: 'Второе, салат, чай' },
      night: { price: 450, items: 'Перекус, чай' }
    },
    active: true, 
    approved: true 
  },
  { 
    id: 2, 
    name: 'Халяль', 
    description: 'Халяль питание', 
    rations: { 
      breakfast: { price: 320, items: 'Халяль каша, чай' },
      lunch: { price: 480, items: 'Халяль суп, мясо, компот' },
      dinner: { price: 440, items: 'Халяль блюда' },
      night: { price: 500, items: 'Халяль перекус' }
    },
    active: true, 
    approved: true 
  },
  { 
    id: 3, 
    name: 'ПП', 
    description: 'Правильное питание', 
    rations: { 
      breakfast: { price: 350, items: 'Омлет, овощи, сок' },
      lunch: { price: 520, items: 'Салат, курица, рис, чай' },
      dinner: { price: 460, items: 'Рыба, овощи' },
      night: { price: 380, items: 'Кефир, фрукты' }
    },
    active: true, 
    approved: true 
  },
  { 
    id: 4, 
    name: 'Директорат', 
    description: 'Премиум питание', 
    rations: { 
      breakfast: { price: 420, items: 'Фрукты, выпечка, сок, кофе' },
      lunch: { price: 620, items: 'Мясо, гарнир, десерт, компот' },
      dinner: { price: 560, items: 'Рыба, вино, фрукты' },
      night: { price: 600, items: 'Десерт, чай' }
    },
    active: true, 
    approved: true 
  }
]

const DEFAULT_PRODUCTIONS = [
  { 
    id: 1, 
    name: 'Собственное производство', 
    type: 'own', 
    address: 'СПБ, ул. Промышленная, д. 10', 
    contact: '+7 (999) 111-22-33',
    delivery: true,
    deliveryPrice: 0,
    active: true 
  },
  { 
    id: 2, 
    name: 'Партнёр 1', 
    type: 'partner', 
    address: 'СПБ, ул. Партнёрская, д. 5', 
    contact: '+7 (999) 222-33-44',
    delivery: false,
    deliveryPrice: 50,
    active: true 
  },
  { 
    id: 3, 
    name: 'Партнёр 2', 
    type: 'partner', 
    address: 'СПБ, ул. Заводская, д. 15', 
    contact: '+7 (999) 333-44-55',
    delivery: true,
    deliveryPrice: 30,
    active: true 
  }
]

const DEFAULT_MANAGERS = [
  { id: 1, name: 'Анна', phone: '+7 (999) 000-11-22', telegram: '@anna_manager', login: 'ANNA', password: 'anna123', bonusPercent: 5, salary: 50000, totalSales: 0, totalRevenue: 0 },
  { id: 2, name: 'Мария', phone: '+7 (999) 000-33-44', telegram: '@maria_manager', login: 'MARIA', password: 'maria123', bonusPercent: 5, salary: 50000, totalSales: 0, totalRevenue: 0 },
  { id: 3, name: 'Иван', phone: '+7 (999) 000-55-66', telegram: '@ivan_manager', login: 'IVAN', password: 'ivan123', bonusPercent: 5, salary: 50000, totalSales: 0, totalRevenue: 0 }
]

const DEFAULT_CLIENTS = {
  'TEST-001': {
    id: 'TEST-001',
    company: 'ООО ТехноСтрой',
    inn: '7812345678',
    contact: 'Петров Сергей',
    phone: '+7 (999) 123-45-67',
    email: 'petrov@tehno.ru',
    address: 'г. Санкт-Петербург, ул. Новая, д. 10',
    companyType: 'office',
    clientType: 'contract',
    contractDate: '2025-01-15',
    paymentMethod: 'card',
    paymentPeriod: 'monthly',
    paymentDelay: 0,
    active: true,
    featured: true,
    discount: 10,
    staff: { regular: 45, halal: 12, pp: 8, director: 3 },
    rations: ['breakfast', 'lunch', 'dinner'],
    deliveryTime: { breakfast: '07:30-08:30', lunch: '12:00-13:00', dinner: '17:30-18:30' },
    managerId: 1,
    adminComment: '',
    menuIds: [1, 2],
    freeLogins: 3,
    usedLogins: 1,
    userLogins: [{ login: 'TECHNO1', password: 'tech123', name: 'Петров С.' }]
  }
}

// ПОЛЬЗОВАТЕЛИ
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

const inputStyle = { width: '100%', padding: '12px', fontSize: 15, borderRadius: 8, border: '2px solid #e0e0e0', marginBottom: 12, boxSizing: 'border-box', background: '#fff' }
const labelStyle = { fontWeight: '600', display: 'block', marginBottom: 6, fontSize: 13, color: '#333' }
const sectionStyle = { background: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
const buttonPrimaryStyle = { width: '100%', background: '#1976D2', color: '#fff', border: 'none', padding: '14px', borderRadius: 8, fontSize: 15, fontWeight: '600', cursor: 'pointer' }

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
  const [companyType, setCompanyType] = useState('office')
  const [clientType, setClientType] = useState('contract')
  const [selectedRations, setSelectedRations] = useState([])
  const [selectedMenuId, setSelectedMenuId] = useState(null)
  const [selectedDay, setSelectedDay] = useState('monday')
  const [orderQuantity, setOrderQuantity] = useState({})
  const [comment, setComment] = useState('')
  const [commentSent, setCommentSent] = useState(false)
  const [client, setClient] = useState({ company: '', inn: '', contact: '', phone: '', email: '', address: '', paymentMethod: 'card', paymentPeriod: 'monthly' })
  const [bots, setBots] = useState([])
  const [threads, setThreads] = useState(DEFAULT_THREADS)
  const [editingBot, setEditingBot] = useState(null)
  const [recoveryMode, setRecoveryMode] = useState(false)
  const [recoveryContract, setRecoveryContract] = useState('')
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])

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

  useEffect(() => { const hash = window.location.hash.slice(1); if (hash === 'admin') setView('admin'); else if (hash === 'new') setView('new-user') }, [])

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
          setOrderQuantity({ breakfast: clientData.staff?.regular || 0, lunch: clientData.staff?.regular || 0, dinner: clientData.staff?.regular || 0, night: 0 })
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
        setOrderQuantity({ breakfast: c.staff?.regular || 0, lunch: c.staff?.regular || 0, dinner: c.staff?.regular || 0, night: 0 })
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
    Object.keys(rations).forEach(r => {
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

    // Уведомление менеджеру
    const managerBot = bots.find(b => b.type === 'office' && b.active)
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
    addLog('Статус заказа', `Заказ ${order?.orderNumber} → ${ORDER_STATUS[newStatus]}`)
    
    // Обновляем статистику менеджера
    if (newStatus === 'confirmed') {
      const clientData = clients[order?.clientId]
      if (clientData?.managerId) {
        setManagers(prev => prev.map(m => m.id === clientData.managerId ? { ...m, totalSales: m.totalSales + 1, totalRevenue: m.totalRevenue + (order?.total || 0) } : m))
      }
    }

    // Уведомления
    const officeBot = bots.find(b => b.type === 'office' && b.active)
    const prodBot = bots.find(b => b.type === 'production' && b.active)
    const clientBot = bots.find(b => b.type === 'clients' && b.active)

    if (officeBot) {
      const msg = `📦 *Заказ ${order?.orderNumber}*\nСтатус: ${ORDER_STATUS[newStatus]}`
      await sendToTelegram(officeBot, msg, threads.orders)
    }
    
    if (prodBot && (newStatus === 'confirmed' || newStatus === 'production')) {
      const rationsText = order?.rations?.map(r => `${RATION_TYPES[r]?.emoji || ''} ${order.quantity[r] || 0}`).join(', ') || ''
      const msg = `🏭 *Заказ ${order?.orderNumber}*\n*Компания:* ${order?.company}\n*Адрес:* ${order?.address}\n*Меню:* ${order?.menuName}\n*Рационы:* ${rationsText}`
      await sendToTelegram(prodBot, msg, threads.production)
    }
    
    if (clientBot && (newStatus === 'delivery' || newStatus === 'delivered')) {
      const msg = `📦 *Заказ ${order?.orderNumber}*\nСтатус: ${ORDER_STATUS[newStatus]}`
      await sendToTelegram(clientBot, msg, threads.orders)
    }

    addNotification('Статус заказа', `Заказ ${order?.orderNumber}: ${ORDER_STATUS[newStatus]}`, 'info')
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

  const finance = getFinanceStats()
  const isAdmin = currentUser?.role === 'admin'
  const isOperator = currentUser?.role === 'operator'
  const isProduction = currentUser?.role === 'production'

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}><div style={{ fontSize: 24 }}>⏳</div><div>Загрузка...</div></div>

  // === ВХОД ===
  if (!currentClient && view !== 'admin') {
    return (
      <div style={{ padding: 16, maxWidth: 450, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <h1 style={{ fontSize: 28, marginBottom: 4, color: '#1976D2' }}>🍽️ Питание СПБ</h1>
          <p style={{ color: '#666' }}>Личный кабинет</p>
        </div>
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 16, textAlign: 'center' }}>🔐 Вход</h2>
          {recoveryMode ? (
            <>
              <label style={labelStyle}>Номер договора</label>
              <input type="text" placeholder="TEST-001" value={recoveryContract} onChange={(e) => setRecoveryContract(e.target.value)} style={inputStyle} />
              <button onClick={() => alert('Запрос отправлен!')} style={buttonPrimaryStyle}>🔐 Восстановить пароль</button>
              <button onClick={() => { setRecoveryMode(false); setRecoveryContract('') }} style={{ ...buttonPrimaryStyle, background: '#fff', color: '#666', border: '1px solid #ccc', marginTop: 12 }}>← Назад</button>
            </>
          ) : (
            <form onSubmit={handleLogin}>
              <label style={labelStyle}>Логин</label>
              <input type="text" placeholder="0901SmolAdmin" value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} style={inputStyle} />
              <label style={labelStyle}>Пароль</label>
              <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
              {loginError && <div style={{ color: '#f44336', marginBottom: 12, fontSize: 13 }}>{loginError}</div>}
              <button type="submit" style={buttonPrimaryStyle}>Войти</button>
            </form>
          )}
          {!recoveryMode && (
            <>
              <button onClick={() => navigate('new')} style={{ ...buttonPrimaryStyle, background: '#fff', color: '#1976D2', border: '2px solid #1976D2', marginTop: 12 }}>📝 Оставить заявку</button>
              <button onClick={() => setRecoveryMode(true)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginTop: 12, fontSize: 13 }}>🔐 Забыли пароль?</button>
            </>
          )}
        </div>
      </div>
    )
  }

  // === АДМИН ===
  if (view === 'admin') {
    const adminTabs = [
      { id: 'dashboard', name: '📊 Обзор' },
      { id: 'clients', name: '🏢 Клиенты' },
      { id: 'orders', name: '📋 Заказы' },
      { id: 'waiting', name: '📥 Ожидание' },
      { id: 'production', name: '🏭 Производство' },
      { id: 'menu', name: '🍽️ Меню' },
      { id: 'finances', name: '💰 Финансы' },
      { id: 'managers', name: '👩‍💼 Менеджеры' },
      { id: 'productions', name: '🏭 Производства' },
      { id: 'telegram', name: '📱 Telegram' }
    ]

    return (
      <div style={{ padding: 16, maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, margin: 0, color: '#1976D2' }}>⚙️ Админ-панель</h1>
          <button onClick={() => { setCurrentUser(null); navigate('login') }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Выход</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
          {adminTabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '10px 14px', border: 'none', borderRadius: 8, background: tab === t.id ? '#1976D2' : '#fff', color: tab === t.id ? '#fff' : '#333', cursor: 'pointer', fontSize: 14, fontWeight: '600' }}>{t.name}</button>
          ))}
        </div>

        {/* ОБЗОР */}
        {tab === 'dashboard' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>📊 Обзор системы</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <div style={{ padding: 16, background: '#E3F2FD', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1976D2' }}>{Object.keys(clients).length}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Клиентов</div>
              </div>
              <div style={{ padding: 16, background: '#FFF3E0', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#FF9800' }}>{orders.filter(o => o.status === 'created').length}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Новых заказов</div>
              </div>
              <div style={{ padding: 16, background: '#E8F5E9', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4CAF50' }}>{finance.today.count}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Заказов сегодня</div>
              </div>
              <div style={{ padding: 16, background: '#F3E5F5', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#9C27B0' }}>{finance.month.sum.toLocaleString()}₽</div>
                <div style={{ fontSize: 12, color: '#666' }}>За месяц</div>
              </div>
            </div>
          </div>
        )}

        {/* КЛИЕНТЫ */}
        {tab === 'clients' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Всего: {Object.keys(clients).length} клиентов</span>
              <button onClick={() => setEditingClient({ id: 'NEW-' + Date.now().toString().slice(-4).toUpperCase(), company: '', contact: '', phone: '', address: '', clientType: 'contract', rations: ['lunch'], staff: { regular: 0 }, menuIds: [1], managerId: 1, active: true, featured: false, discount: 0 })} style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>+ Добавить клиента</button>
            </div>
            {Object.values(clients).map(c => {
              const mgr = getManager(c.managerId)
              return (
                <div key={c.id} style={{ ...sectionStyle, borderLeft: c.featured ? '4px solid #FF9800' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h3 style={{ margin: 0, fontSize: 18 }}>{c.company}</h3>
                        <span style={{ background: c.clientType === 'contract' ? '#4CAF50' : '#2196F3', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 10 }}>{c.clientType === 'contract' ? 'Договор' : 'Ежедневный'}</span>
                        {c.featured && <span style={{ background: '#FF9800', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>VIP</span>}
                        {!c.active && <span style={{ background: '#f44336', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>ОТКЛ</span>}
                      </div>
                      <div style={{ fontSize: 13, color: '#666' }}>{c.id} • {c.contact} • {c.phone}</div>
                    </div>
                    <button onClick={() => setEditingClient({...c})} style={{ padding: '8px 16px', background: '#1976D2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Изменить</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: 12 }}>
                    <div>📍 <b>{c.address || '-'}</b></div>
                    <div>👤 Менеджер: <b>{mgr?.name || '-'}</b></div>
                    <div>👥: <b>{c.staff?.regular || 0}</b></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ЗАКАЗЫ */}
        {tab === 'orders' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>📋 Все заказы ({orders.length})</h3>
            {orders.length === 0 ? <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>Нет заказов</div> : orders.slice(0, 20).map(order => (
              <div key={order.id} style={{ padding: 12, background: '#fafafa', borderRadius: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{order.orderNumber} - {order.company}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{order.date} • {order.menuName}</div>
                    <div style={{ fontSize: 11, color: '#666' }}>{order.rations?.map(r => RATION_TYPES[r]?.emoji).join(' ')}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>{order.total.toLocaleString()}₽</div>
                    <span style={{ padding: '2px 8px', background: order.status === 'created' ? '#FFF3E0' : order.status === 'confirmed' ? '#E3F2FD' : order.status === 'production' ? '#F3E5F5' : order.status === 'delivery' ? '#E1F5FE' : order.status === 'delivered' ? '#E8F5E9' : '#ffebee', borderRadius: 10, fontSize: 10 }}>{ORDER_STATUS[order.status]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ОЖИДАНИЕ */}
        {tab === 'waiting' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>📥 Ожидают подтверждения ({orders.filter(o => o.status === 'created').length})</h3>
            {orders.filter(o => o.status === 'created').map(order => (
              <div key={order.id} style={{ padding: 12, background: '#FFF3E0', borderRadius: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{order.orderNumber}</div>
                    <div style={{ fontSize: 13 }}>{order.company}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>📍 {order.address}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: '#FF9800' }}>{order.total.toLocaleString()}₽</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => updateOrderStatus(order.id, 'confirmed')} style={{ flex: 1, padding: '8px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>✓ Подтвердить</button>
                  <button onClick={() => updateOrderStatus(order.id, 'cancelled')} style={{ flex: 1, padding: '8px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>✕ Отклонить</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ПРОИЗВОДСТВО */}
        {tab === 'production' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>🏭 В работе ({orders.filter(o => o.status === 'confirmed' || o.status === 'production' || o.status === 'delivery').length})</h3>
            {orders.filter(o => ['confirmed', 'production', 'delivery'].includes(o.status)).map(order => (
              <div key={order.id} style={{ padding: 12, background: '#F3E5F5', borderRadius: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{order.orderNumber}</div>
                    <div style={{ fontSize: 13 }}>{order.company}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{order.menuName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>{order.total.toLocaleString()}₽</div>
                    <span style={{ padding: '2px 8px', background: '#9C27B0', color: '#fff', borderRadius: 10, fontSize: 10 }}>{ORDER_STATUS[order.status]}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  {order.status === 'confirmed' && <button onClick={() => updateOrderStatus(order.id, 'production')} style={{ flex: 1, padding: '8px', background: '#9C27B0', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>🏭 Принять</button>}
                  {order.status === 'production' && <button onClick={() => updateOrderStatus(order.id, 'delivery')} style={{ flex: 1, padding: '8px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>🚚 Отправить</button>}
                  {order.status === 'delivery' && <button onClick={() => updateOrderStatus(order.id, 'delivered')} style={{ flex: 1, padding: '8px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>✅ Доставлен</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* МЕНЮ */}
        {tab === 'menu' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Меню: {menus.length}</span>
              <button onClick={() => setMenus(prev => [...prev, { id: Date.now(), name: 'Новое меню', rations: { breakfast: {price: 280, items: ''}, lunch: {price: 420, items: ''}, dinner: {price: 380, items: ''}, night: {price: 450, items: ''}, active: true, approved: false }])} style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>+ Добавить меню</button>
            </div>
            {menus.map(menu => (
              <div key={menu.id} style={{ ...sectionStyle, borderLeft: menu.approved ? '4px solid #4CAF50' : '4px solid #FF9800' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18 }}>🍽️ {menu.name}</h3>
                    <div style={{ fontSize: 13, color: '#666' }}>{menu.description}</div>
                  </div>
                  <button onClick={() => setMenus(prev => prev.map(m => m.id === menu.id ? {...m, approved: !m.approved} : m))} style={{ padding: '8px 16px', background: menu.approved ? '#FF9800' : '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>{menu.approved ? 'Выкл' : 'Вкл'}</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontSize: 12 }}>
                  {Object.entries(RATION_TYPES).map(([key, ration]) => (
                    <div key={key} style={{ padding: 8, background: '#f5f5f5', borderRadius: 6 }}>
                      <div>{ration.emoji} {ration.name}</div>
                      <div style={{ fontWeight: 'bold' }}>{menu.rations?.[key]?.price || 0}₽</div>
                      <div style={{ fontSize: 10, color: '#666' }}>{menu.rations?.[key]?.items || '-'}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}


        {/* ФИНАНСЫ */}
        {tab === 'finances' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>💰 Финансы</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 16, background: '#E3F2FD', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1976D2' }}>{finance.today.count}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Заказов сегодня</div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1976D2', marginTop: 8 }}>{finance.today.sum.toLocaleString()}₽</div>
              </div>
              <div style={{ padding: 16, background: '#FFF3E0', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#FF9800' }}>{finance.month.count}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Заказов за месяц</div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#FF9800', marginTop: 8 }}>{finance.month.sum.toLocaleString()}₽</div>
              </div>
            </div>
            
            <h4 style={{ marginTop: 16 }}>👩‍💼 Менеджеры</h4>
            {managers.map(mgr => (
              <div key={mgr.id} style={{ padding: 12, background: '#f5f5f5', borderRadius: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>{mgr.name}</b>
                  <span>Продаж: {mgr.totalSales || 0}</span>
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>Выручка: {(mgr.totalRevenue || 0).toLocaleString()}₽</div>
                <div style={{ fontSize: 12, color: '#4CAF50' }}>Премия: {Math.round((mgr.totalRevenue || 0) * (mgr.bonusPercent || 5) / 100)}₽ ({(mgr.bonusPercent || 5)}%)</div>
              </div>
            ))}
          </div>
        )}

        {/* МЕНЕДЖЕРЫ */}
        {tab === 'managers' && (
          <div>
            {managers.map(mgr => (
              <div key={mgr.id} style={{ ...sectionStyle, borderLeft: '4px solid #9C27B0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><label style={labelStyle}>Имя:</label><input type="text" value={mgr.name} onChange={(e) => setManagers(prev => prev.map(m => m.id === mgr.id ? {...m, name: e.target.value} : m))} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Оклад:</label><input type="number" value={mgr.salary || 0} onChange={(e) => setManagers(prev => prev.map(m => m.id === mgr.id ? {...m, salary: parseInt(e.target.value)} : m))} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Премия (%):</label><input type="number" value={mgr.bonusPercent || 5} onChange={(e) => setManagers(prev => prev.map(m => m.id === mgr.id ? {...m, bonusPercent: parseInt(e.target.value)} : m))} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Telegram:</label><input type="text" value={mgr.telegram || ''} onChange={(e) => setManagers(prev => prev.map(m => m.id === mgr.id ? {...m, telegram: e.target.value} : m))} style={inputStyle} /></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ПРОИЗВОДСТВА */}
        {tab === 'productions' && (
          <div>
            {productions.map(prod => (
              <div key={prod.id} style={{ ...sectionStyle, borderLeft: prod.type === 'own' ? '4px solid #4CAF50' : '4px solid #FF9800' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18 }}>🏭 {prod.name}</h3>
                    <span style={{ background: prod.type === 'own' ? '#4CAF50' : '#FF9800', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>{prod.type === 'own' ? 'Своё' : 'Партнёр'}</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><label style={labelStyle}>Адрес:</label><input type="text" value={prod.address} onChange={(e) => setProductions(prev => prev.map(p => p.id === prod.id ? {...p, address: e.target.value} : p))} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Контакт:</label><input type="text" value={prod.contact} onChange={(e) => setProductions(prev => prev.map(p => p.id === prod.id ? {...p, contact: e.target.value} : p))} style={inputStyle} /></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={prod.delivery} onChange={(e) => setProductions(prev => prev.map(p => p.id === prod.id ? {...p, delivery: e.target.checked} : p))} />
                    Доставка
                  </label>
                  {prod.delivery && <span style={{ fontSize: 12, color: '#666' }}>({prod.deliveryPrice}₽/заказ)</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TELEGRAM */}
        {tab === 'telegram' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>📱 Настройки Telegram</h3>
            {bots.map(bot => (
              <div key={bot.id} style={{ padding: 12, background: bot.active ? '#E8F5E9' : '#fafafa', borderRadius: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <b>{bot.name}</b>
                    <span style={{ background: bot.type === 'office' ? '#9C27B0' : bot.type === 'production' ? '#FF9800' : '#4CAF50', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 10 }}>{bot.type}</span>
                  </div>
                  <button onClick={() => setBots(prev => prev.map(b => b.id === bot.id ? {...b, active: !b.active} : b))} style={{ padding: '4px 12px', background: bot.active ? '#f44336' : '#4CAF50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>{bot.active ? 'Выкл' : 'Вкл'}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* РЕДАКТИРОВАНИЕ КЛИЕНТА */}
        {editingClient && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 16, maxWidth: 600, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>Редактирование: {editingClient.id}</h2>
              <label style={labelStyle}>Компания:</label><input type="text" value={editingClient.company} onChange={(e) => setEditingClient({...editingClient, company: e.target.value})} style={inputStyle} />
              <label style={labelStyle}>Тип клиента:</label>
              <select value={editingClient.clientType || 'contract'} onChange={(e) => setEditingClient({...editingClient, clientType: e.target.value})} style={inputStyle}>
                <option value="contract">По договору</option>
                <option value="daily">Ежедневный</option>
              </select>
              <label style={labelStyle}>Контакт:</label><input type="text" value={editingClient.contact} onChange={(e) => setEditingClient({...editingClient, contact: e.target.value})} style={inputStyle} />
              <label style={labelStyle}>Телефон:</label><input type="text" value={editingClient.phone} onChange={(e) => setEditingClient({...editingClient, phone: e.target.value})} style={inputStyle} />
              <label style={labelStyle}>Адрес:</label><input type="text" value={editingClient.address || ''} onChange={(e) => setEditingClient({...editingClient, address: e.target.value})} style={inputStyle} />
              <label style={labelStyle}>Сотрудников:</label><input type="number" value={editingClient.staff?.regular || 0} onChange={(e) => setEditingClient({...editingClient, staff: { ...editingClient.staff, regular: parseInt(e.target.value) || 0 }})} style={inputStyle} />
              <label style={labelStyle}>Менеджер:</label>
              <select value={editingClient.managerId || 1} onChange={(e) => setEditingClient({...editingClient, managerId: parseInt(e.target.value)})} style={inputStyle}>
                {managers.map(mgr => <option key={mgr.id} value={mgr.id}>{mgr.name}</option>)}
              </select>
              <label style={labelStyle}>Скидка (%):</label><input type="number" value={editingClient.discount || 0} onChange={(e) => setEditingClient({...editingClient, discount: parseInt(e.target.value) || 0})} style={inputStyle} />
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => { setClients(prev => ({...prev, [editingClient.id]: editingClient})); setEditingClient(null); alert('Сохранено!') }} style={{ ...buttonPrimaryStyle, background: '#4CAF50' }}>💾 Сохранить</button>
                <button onClick={() => setEditingClient(null)} style={{ ...buttonPrimaryStyle, background: '#f44336' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // === ЛИЧНЫЙ КАБИНЕТ КЛИЕНТА ===
  return (
    <div style={{ padding: 16, maxWidth: 550, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, margin: 0, color: '#1976D2' }}>🍽️ Питание СПБ</h1>
        <button onClick={() => { setCurrentClient(null); navigate('login') }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Выход</button>
      </div>

      {notifications.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {notifications.slice(0, 2).map(n => (
            <div key={n.id} style={{ padding: 10, background: n.type === 'success' ? '#E8F5E9' : '#E3F2FD', borderRadius: 8, marginBottom: 4, fontSize: 12 }}>
              <b>{n.title}</b>: {n.message}
            </div>
          ))}
        </div>
      )}

      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>{currentClient.company}</h2>
            <div style={{ fontSize: 12, color: '#666' }}>{currentClient.contact} • {currentClient.phone}</div>
            <div style={{ fontSize: 11, color: '#666' }}>📍 {currentClient.address}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ background: currentClient.clientType === 'contract' ? '#4CAF50' : '#2196F3', color: '#fff', padding: '4px 10px', borderRadius: 16, fontSize: 10 }}>{currentClient.clientType === 'contract' ? 'Договор' : 'Ежедневный'}</span>
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
          <div style={sectionStyle}>
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
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, fontSize: 14 }}>📞 Менеджер</h3>
            {(() => { const mgr = getManager(currentClient.managerId); return <div style={{ fontSize: 14 }}>{mgr?.name || 'Не назначен'} • {mgr?.phone || '-'}</div> })()}
          </div>
        </>
      )}


      {tab === 'menu' && (
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>🍽️ Выберите меню</h3>
          {menus.filter(m => m.approved).map(menu => (
            <button key={menu.id} onClick={() => setSelectedMenuId(menu.id)} style={{ width: '100%', padding: '12px', marginBottom: 8, border: selectedMenuId === menu.id ? '2px solid #1976D2' : '2px solid #e0e0e0', borderRadius: 8, background: selectedMenuId === menu.id ? '#E3F2FD' : '#fff', cursor: 'pointer', textAlign: 'left' }}>
              <b>{menu.name}</b>
              <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                🥐 {menu.rations?.breakfast?.price}₽ • 🍱 {menu.rations?.lunch?.price}₽ • 🍽️ {menu.rations?.dinner?.price}₽ • 🌙 {menu.rations?.night?.price}₽
              </div>
            </button>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>📋 Новый заказ</h3>
          
          <label style={labelStyle}>Выберите рационы:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            {Object.entries(RATION_TYPES).map(([key, ration]) => (
              <button key={key} onClick={() => setSelectedRations(prev => prev.includes(key) ? prev.filter(r => r !== key) : [...prev, key])} style={{ padding: 12, border: selectedRations.includes(key) ? '2px solid #1976D2' : '2px solid #e0e0e0', borderRadius: 8, background: selectedRations.includes(key) ? '#E3F2FD' : '#fff', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>{ration.emoji}</div>
                <div style={{ fontSize: 11 }}>{ration.name}</div>
              </button>
            ))}
          </div>

          <label style={labelStyle}>Количество человек на каждый рацион:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {selectedRations.map(r => (
              <div key={r}><label style={{ fontSize: 11 }}>{RATION_TYPES[r]?.emoji} {RATION_TYPES[r]?.name}:</label><input type="number" value={orderQuantity[r] || 0} onChange={(e) => setOrderQuantity({...orderQuantity, [r]: parseInt(e.target.value) || 0})} style={inputStyle} /></div>
            ))}
          </div>

          <button onClick={createOrder} disabled={selectedRations.length === 0} style={{ ...buttonPrimaryStyle, background: selectedRations.length > 0 ? '#4CAF50' : '#ccc' }}>📤 Создать заказ</button>

          <h4 style={{ marginTop: 16 }}>Мои заказы:</h4>
          {orders.filter(o => o.clientId === currentClient.id).slice(0, 5).map(order => (
            <div key={order.id} style={{ padding: 10, background: '#f5f5f5', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>{order.orderNumber}</b>
                <span style={{ fontSize: 11, color: '#666' }}>{order.date}</span>
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>{order.menuName} • {order.total.toLocaleString()}₽</div>
              <div style={{ fontSize: 11, color: order.status === 'delivered' ? '#4CAF50' : '#FF9800' }}>{ORDER_STATUS[order.status]}</div>
              {order.status === 'delivery' && <button onClick={() => confirmDelivery(order.id)} style={{ marginTop: 8, padding: '8px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', width: '100%' }}>✅ Подтвердить получение</button>}
            </div>
          ))}
        </div>
      )}


      {tab === 'settings' && (
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0, fontSize: 14 }}>💬 Сообщение менеджеру</h3>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Сообщение..." style={{ ...inputStyle, height: 80 }} />
          <button onClick={() => { alert('Отправлено!'); setComment(''); setCommentSent(true) }} disabled={!comment.trim()} style={{ ...buttonPrimaryStyle, background: comment.trim() ? '#4CAF50' : '#ccc' }}>📤 Отправить</button>
        </div>
      )}
    </div>
  )
}

export default App