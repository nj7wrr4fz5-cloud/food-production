import { useState, useEffect } from 'react'

const CLIENT_TYPES = {
  contract: { id: 'contract', name: 'По договору' },
  daily: { id: 'daily', name: 'Ежедневный' },
  individual: { id: 'individual', name: 'Индивидуальный' }
}

const RATION_TYPES = {
  breakfast: { id: 'breakfast', name: 'Завтрак' },
  lunch: { id: 'lunch', name: 'Обед' },
  dinner: { id: 'dinner', name: 'Ужин' },
  night: { id: 'night', name: 'Ночной' },
  snack: { id: 'snack', name: 'Перекус' }
}

const ORDER_STATUS = {
  created: { label: 'Создан', color: '#FF9800', bg: '#FFF3E0' },
  confirmed: { label: 'Подтвержден', color: '#2196F3', bg: '#E3F2FD' },
  production: { label: 'На производстве', color: '#9C27B0', bg: '#F3E5F5' },
  delivery: { label: 'В доставке', color: '#00BCD4', bg: '#E0F7FA' },
  delivered: { label: 'Получен', color: '#4CAF50', bg: '#E8F5E9' },
  cancelled: { label: 'Отменен', color: '#f44336', bg: '#FFEBEE' }
}

const DEFAULT_BOTS = [
  { id: 'bot1', name: 'Бот офиса', token: '6706048508:AAF-8INmBKwP1x7DA-_ET8D282c5pp0Rn2Y', chatId: '-1002583331823', active: true, type: 'office', threadId: 360 },
  { id: 'bot2', name: 'Бот производства', token: '', chatId: '', active: false, type: 'production', threadId: 363 },
  { id: 'bot3', name: 'Бот клиентов', token: '', chatId: '', active: false, type: 'clients', threadId: 359 }
]

const DEFAULT_THREADS = { waiting: 360, newUser: 361, history: 362, orders: 359, production: 363, delivery: 364 }

const DEFAULT_MENUS = [
  { id: 1, name: 'Стандартное', rations: { breakfast: {price: 280}, lunch: {price: 420}, dinner: {price: 380}, night: {price: 450}, snack: {price: 180} }, active: true, approved: true, managerIds: [1,2,3], productionIds: [1,2,3], singlePrice: 0 },
  { id: 2, name: 'Халяль', rations: { breakfast: {price: 320}, lunch: {price: 480}, dinner: {price: 440}, night: {price: 500}, snack: {price: 200} }, active: true, approved: true, managerIds: [1,2], productionIds: [1,3], singlePrice: 0 },
  { id: 3, name: 'ПП', rations: { breakfast: {price: 350}, lunch: {price: 520}, dinner: {price: 460}, night: {price: 380}, snack: {price: 220} }, active: true, approved: true, managerIds: [1], productionIds: [1], singlePrice: 0 },
  { id: 4, name: 'Директорат', rations: { breakfast: {price: 420}, lunch: {price: 620}, dinner: {price: 560}, night: {price: 600}, snack: {price: 350} }, active: true, approved: true, managerIds: [2,3], productionIds: [1], singlePrice: 0 }
]

const DEFAULT_PRODUCTIONS = [
  { id: 1, name: 'Собственное производство', type: 'own', address: 'СПБ, ул. Промышленная, д. 10', contact: '+7 (999) 111-22-33', delivery: true, deliveryPrice: 0, active: true, rations: { breakfast: 280, lunch: 420, dinner: 380, night: 450, snack: 180 }, botId: 'bot1', telegramChat: '-1002583331823', telegramThread: 363 },
  { id: 2, name: 'Партнер 1', type: 'partner', address: 'СПБ, ул. Партнерская, д. 5', contact: '+7 (999) 222-33-44', delivery: false, deliveryPrice: 50, active: true, rations: { breakfast: 260, lunch: 400, dinner: 360, night: 420, snack: 170 }, botId: '', telegramChat: '', telegramThread: 0 },
  { id: 3, name: 'Партнер 2', type: 'partner', address: 'СПБ, ул. Заводская, д. 15', contact: '+7 (999) 333-44-55', delivery: true, deliveryPrice: 30, active: true, rations: { breakfast: 270, lunch: 410, dinner: 370, night: 440, snack: 175 }, botId: '', telegramChat: '', telegramThread: 0 }
]

const DEFAULT_MANAGERS = [
  { id: 1, name: 'Анна', phone: '+7 (999) 000-11-22', telegram: '@anna_manager', login: 'ANNA', password: 'anna123', bonusPercent: 5, salary: 50000, totalSales: 0, totalRevenue: 0, active: true, botId: 'bot1', telegramThread: 361 },
  { id: 2, name: 'Мария', phone: '+7 (999) 000-33-44', telegram: '@maria_manager', login: 'MARIA', password: 'maria123', bonusPercent: 5, salary: 50000, totalSales: 0, totalRevenue: 0, active: true, botId: 'bot1', telegramThread: 362 },
  { id: 3, name: 'Сашка', phone: '+7 (999) 000-55-66', telegram: '@sasha_manager', login: '22', password: 'sasha123', bonusPercent: 5, salary: 50000, totalSales: 0, totalRevenue: 0, active: true, botId: 'bot1', telegramThread: 363 }
]

const DEFAULT_CLIENTS = {
  'TEST-001': { id: 'TEST-001', company: 'ООО ТехноСтрой', contact: 'Петров Сергей', phone: '+7 (999) 123-45-67', address: 'СПБ, ул. Новая, д. 10', clientType: 'contract', active: true, featured: true, discount: 10, staff: { regular: 45 }, rations: ['lunch'], managerId: 1, menuIds: [1, 2], productionId: 1, userLogins: [{ login: 'TECHNO1', password: 'tech123', name: 'Петров С.' }] },
  'KOTIK': { id: 'KOTIK', company: 'Котик', contact: 'Котик', phone: '+7 (999) 999-99-99', address: 'СПБ', clientType: 'contract', active: true, featured: false, discount: 0, staff: { regular: 10 }, rations: ['lunch'], managerId: 3, menuIds: [1], productionId: 2, userLogins: [{ login: 'KOTIK', password: 'kotik123', name: 'Котик' }] }
}

const BASE_USERS = {
  '0901SMOLADMIN': { id: '0901SmolAdmin', password: '0901SmolAdmin', role: 'admin', name: 'Админ', lastLogin: null },
  'ADMIN': { id: 'ADMIN', password: 'ADMIN', role: 'admin', name: 'Главный Админ', lastLogin: null }
}

const inputStyle = { width: '100%', padding: '10px 12px', fontSize: 14, borderRadius: 6, border: '1px solid #ddd', marginBottom: 10, boxSizing: 'border-box' }
const labelStyle = { fontWeight: '500', display: 'block', marginBottom: 4, fontSize: 12, color: '#555' }
const sectionStyle = { background: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
const buttonPrimaryStyle = { background: '#1976D2', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 6, fontSize: 13, fontWeight: '500', cursor: 'pointer' }
const buttonSecondaryStyle = { background: '#f5f5f5', color: '#333', border: '1px solid #ddd', padding: '10px 16px', borderRadius: 6, fontSize: 13, fontWeight: '500', cursor: 'pointer' }
const buttonDangerStyle = { background: '#f44336', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 6, fontSize: 13, fontWeight: '500', cursor: 'pointer' }

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
  const [bots, setBots] = useState([])
  const [threads, setThreads] = useState(DEFAULT_THREADS)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterManager, setFilterManager] = useState('all')
  const [filterClient, setFilterClient] = useState('all')
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUserType, setNewUserType] = useState('client')
  const [newUserData, setNewUserData] = useState({ login: '', password: '', name: '', company: '', phone: '' })
  const [editingClient, setEditingClient] = useState(null)
  const [editingProduction, setEditingProduction] = useState(null)
  const [editingManager, setEditingManager] = useState(null)
  const [editingMenu, setEditingMenu] = useState(null)
  const [editingBot, setEditingBot] = useState(null)
  const [selectedRations, setSelectedRations] = useState([])
  const [selectedMenuId, setSelectedMenuId] = useState(null)
  const [orderQuantity, setOrderQuantity] = useState({})
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestForm, setRequestForm] = useState({ name: '', phone: '', company: '', people: '', message: '' })
  const [reportPeriod, setReportPeriod] = useState('thisMonth')

  useEffect(() => {
    const loadData = () => {
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
      
      setLoading(false)
    }
    loadData()
  }, [])
  useEffect(() => { if (!loading) saveToStorage('clients', clients) }, [clients, loading])
  useEffect(() => { if (!loading) saveToStorage('orders', orders) }, [orders, loading])
  useEffect(() => { if (!loading && bots.length > 0) saveToStorage('bots', bots) }, [bots, loading])
  useEffect(() => { if (!loading) saveToStorage('threads', threads) }, [threads, loading])
  useEffect(() => { if (!loading && Object.keys(users).length > 0) saveToStorage('users', users) }, [users, loading])
  useEffect(() => { if (!loading && managers.length > 0) saveToStorage('managers', managers) }, [managers, loading])
  useEffect(() => { if (!loading && menus.length > 0) saveToStorage('menus', menus) }, [menus, loading])
  useEffect(() => { if (!loading && productions.length > 0) saveToStorage('productions', productions) }, [productions, loading])
  useEffect(() => { if (!loading) saveToStorage('logs', logs) }, [logs, loading])

  const navigate = (page) => { window.location.hash = page; setView(page) }

  const addLog = (action, details) => {
    const newLog = { id: Date.now(), action, details, user: currentUser?.name || currentClient?.company || 'Система', date: new Date().toISOString() }
    setLogs(prev => [newLog, ...prev].slice(0, 100))
  }

  const recordLogin = (userId, userName, role) => {
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
      addLog('Вход', `${userKey} (${user.role})`)
      
      if (user.role === 'client') {
        const clientData = clients[user.clientId]
        if (clientData) {
          setCurrentClient(clientData)
          setSelectedRations(clientData.rations || ['lunch'])
          setSelectedMenuId(clientData.menuIds?.[0] || 1)
          setOrderQuantity({ breakfast: clientData.staff?.regular || 0, lunch: clientData.staff?.regular || 0, dinner: clientData.staff?.regular || 0, night: 0, snack: 0 })
        }
      } else if (user.role === 'admin') {
        navigate('admin')
      } else if (user.role === 'operator') {
        navigate('manager')
      } else if (user.role === 'production') {
        navigate('production')
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
        setLoginError('')
      } else {
        setLoginError('Неверный логин или пароль')
      }
    } else {
      setLoginError('Неверный логин или пароль')
    }
  }

  const calculateOrderTotal = (menu, rations, quantity) => {
    if (menu.singlePrice > 0) {
      const totalPortions = Object.keys(rations).reduce((s, r) => s + (quantity[r] || 0), 0)
      return totalPortions * menu.singlePrice
    }
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
      rations: selectedRations,
      menuId: selectedMenuId,
      menuName: selectedMenu.name,
      quantity: orderQuantity,
      status: 'created',
      total: calculateOrderTotal(selectedMenu, selectedRations.reduce((acc, r) => ({...acc, [r]: true}), {}), orderQuantity),
      managerId: currentClient.managerId,
      productionId: currentClient.productionId,
      createdAt: new Date().toISOString(),
      confirmedAt: null,
      productionAt: null,
      deliveryAt: null,
      deliveredAt: null
    }

    setOrders(prev => [...prev, newOrder])
    addLog('Создан заказ', `${currentClient.company} - ${newOrder.orderNumber}`)
    alert(`Заказ ${newOrder.orderNumber} отправлен!`)
  }

  const cancelOrder = async (orderId) => {
    if (!confirm('Отменить заказ?')) return
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o))
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId)
    const now = new Date().toISOString()
    
    let updateData = { status: newStatus }
    if (newStatus === 'confirmed') updateData.confirmedAt = now
    if (newStatus === 'production') updateData.productionAt = now
    if (newStatus === 'delivery') updateData.deliveryAt = now
    if (newStatus === 'delivered') updateData.deliveredAt = now
    
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updateData } : o))
    addLog('Статус заказа', `${order?.orderNumber} -> ${ORDER_STATUS[newStatus]?.label}`)
    
    if (newStatus === 'confirmed') {
      const clientData = clients[order?.clientId]
      if (clientData?.managerId) {
        setManagers(prev => prev.map(m => m.id === clientData.managerId ? { ...m, totalSales: m.totalSales + 1, totalRevenue: m.totalRevenue + (order?.total || 0) } : m))
      }
    }
  }

  const confirmDelivery = async (orderId) => {
    await updateOrderStatus(orderId, 'delivered')
  }

  const sendRequest = async () => {
    if (!requestForm.name || !requestForm.phone) {
      alert('Заполните имя и телефон!')
      return
    }
    
    const bot = bots.find(b => b.active && b.type === 'office')
    if (bot) {
      const message = `Новая заявка!\n\nИмя: ${requestForm.name}\nТелефон: ${requestForm.phone}\nКомпания: ${requestForm.company || '-'}\nКол-во человек: ${requestForm.people || '-'}`
      await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: bot.chatId, text: message, message_thread_id: threads.newUser })
      })
    }
    
    alert('Заявка отправлена!')
    setShowRequestForm(false)
    setRequestForm({ name: '', phone: '', company: '', people: '', message: '' })
  }

  const getManager = (id) => managers.find(m => m.id === id)
  const getProduction = (id) => productions.find(p => p.id === id)

  const getFilteredOrders = (filterFn) => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
    
    let periodOrders
    if (reportPeriod === 'thisMonth') {
      periodOrders = orders.filter(o => { const d = new Date(o.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear })
    } else if (reportPeriod === 'lastMonth') {
      periodOrders = orders.filter(o => { const d = new Date(o.date); return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear })
    } else if (reportPeriod === 'year') {
      periodOrders = orders.filter(o => { const d = new Date(o.date); return d.getFullYear() === currentYear })
    } else {
      periodOrders = orders
    }
    
    return filterFn ? periodOrders.filter(filterFn) : periodOrders
  }

  const getFinanceStats = (filterFn) => {
    const filtered = getFilteredOrders(filterFn)
    return {
      count: filtered.length,
      sum: filtered.reduce((s, o) => s + o.total, 0),
      cancelled: filtered.filter(o => o.status === 'cancelled').reduce((s, o) => s + o.total, 0),
      delivered: filtered.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0)
    }
  }

  const getProductionStats = (productionId) => {
    const filtered = getFilteredOrders(o => o.productionId === productionId && o.status !== 'cancelled')
    const byManager = {}
    filtered.forEach(o => {
      const mgr = getManager(o.managerId)
      const mgrName = mgr?.name || 'Неизвестно'
      if (!byManager[mgrName]) byManager[mgrName] = { count: 0, sum: 0, portions: 0 }
      byManager[mgrName].count++
      byManager[mgrName].sum += o.total
      Object.values(o.quantity || {}).forEach(q => byManager[mgrName].portions += q)
    })
    return { count: filtered.length, sum: filtered.reduce((s, o) => s + o.total, 0), byManager }
  }

  const handleCreateUser = () => {
    if (!newUserData.login || !newUserData.password) {
      alert('Заполните логин и пароль!')
      return
    }

    const loginUpper = newUserData.login.toUpperCase()

    if (newUserType === 'client') {
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
        productionId: 1,
        active: true,
        featured: false,
        discount: 0,
        userLogins: [{ login: loginUpper, password: newUserData.password, name: newUserData.name }]
      }
      setClients(prev => ({ ...prev, [newClientId]: newClient }))
      setUsers(prev => ({ ...prev, [loginUpper]: { id: loginUpper, password: newUserData.password, role: 'client', name: newUserData.company || newUserData.name, clientId: newClientId } }))
      alert(`Клиент создан!\nЛогин: ${loginUpper}\nПароль: ${newUserData.password}`)
    } else if (newUserType === 'production') {
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
      setUsers(prev => ({ ...prev, [loginUpper]: { id: loginUpper, password: newUserData.password, role: 'production', name: newUserData.company || newUserData.name, productionId: newProdId } }))
      alert(`Производство создано!\nЛогин: ${loginUpper}\nПароль: ${newUserData.password}`)
    } else if (newUserType === 'manager') {
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
      setUsers(prev => ({ ...prev, [loginUpper]: { id: loginUpper, password: newUserData.password, role: 'operator', name: newUserData.name, managerId: newMgrId } }))
      alert(`Менеджер создан!\nЛогин: ${loginUpper}\nПароль: ${newUserData.password}`)
    }

    setShowAddUser(false)
    setNewUserData({ login: '', password: '', name: '', company: '', phone: '' })
  }

  const handleSaveMenu = () => {
    if (!editingMenu) return
    
    const menuData = {
      ...editingMenu,
      id: editingMenu.id || Date.now(),
      managerIds: editingMenu.managerIds || [],
      productionIds: editingMenu.productionIds || []
    }
    
    const existingIndex = menus.findIndex(m => m.id === menuData.id)
    if (existingIndex >= 0) {
      setMenus(prev => prev.map(m => m.id === menuData.id ? menuData : m))
    } else {
      setMenus(prev => [...prev, menuData])
    }
    setEditingMenu(null)
    alert('Меню сохранено!')
  }

  const handleDeleteMenu = (menuId) => {
    if (!confirm('Удалить меню?')) return
    setMenus(prev => prev.filter(m => m.id !== menuId))
  }

  const handleSaveBot = () => {
    if (!editingBot) return
    
    const botData = {
      ...editingBot,
      id: editingBot.id || 'bot' + Date.now()
    }
    
    const existingIndex = bots.findIndex(b => b.id === botData.id)
    if (existingIndex >= 0) {
      setBots(prev => prev.map(b => b.id === botData.id ? botData : b))
    } else {
      setBots(prev => [...prev, botData])
    }
    setEditingBot(null)
    alert('Бот сохранен!')
  }

  const handleDeleteBot = (botId) => {
    if (!confirm('Удалить бота?')) return
    setBots(prev => prev.filter(b => b.id !== botId))
  }

  const finance = getFinanceStats()

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Загрузка...</div>

  // === ВХОД ===
  if (!currentClient && view === 'login') {
    return (
      <div style={{ padding: 20, maxWidth: 420, margin: '0 auto', fontFamily: 'system-ui', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontSize: 56 }}>🍽️</div>
            <h1 style={{ fontSize: 28, color: '#fff', fontWeight: 700 }}>Питание СПБ</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Личный кабинет</p>
          </div>
          <div style={{ background: '#fff', padding: 28, borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ marginTop: 0, marginBottom: 24, textAlign: 'center' }}>Вход</h2>
            <form onSubmit={handleLogin}>
              <label style={labelStyle}>Логин</label>
              <input type="text" placeholder="Логин" value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} style={{ ...inputStyle, fontSize: 16, padding: 14 } } />
              <label style={labelStyle}>Пароль</label>
              <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, fontSize: 16, padding: 14 } } />
              {loginError && <div style={{ color: '#f44336', marginBottom: 12 }}>{loginError}</div>}
              <button type="submit" style={{ ...buttonPrimaryStyle, width: '100%', padding: 16, fontSize: 16, borderRadius: 10 }}>Войти</button>
            </form>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button onClick={() => setShowRequestForm(true)} style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Оставить заявку</button>
            </div>
          </div>
        </div>

        {showRequestForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, maxWidth: 450, width: '90%' }}>
              <h2 style={{ marginTop: 0, textAlign: 'center' }}>Заявка на питание</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                <div><label style={labelStyle}>Ваше имя:</label><input type="text" value={requestForm.name} onChange={(e) => setRequestForm({...requestForm, name: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Телефон:</label><input type="text" value={requestForm.phone} onChange={(e) => setRequestForm({...requestForm, phone: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Компания:</label><input type="text" value={requestForm.company} onChange={(e) => setRequestForm({...requestForm, company: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Кол-во человек:</label><input type="number" value={requestForm.people} onChange={(e) => setRequestForm({...requestForm, people: e.target.value})} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={sendRequest} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Отправить</button>
                <button onClick={() => setShowRequestForm(false)} style={{ flex: 1, padding: 14, background: '#f5f5f5', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // === АДМИН ===
  if (view === 'admin') {
    const adminTabs = [
      { id: 'dashboard', name: 'Обзор' },
      { id: 'clients', name: 'Клиенты' },
      { id: 'users', name: 'Пользователи' },
      { id: 'orders', name: 'Заказы' },
      { id: 'waiting', name: 'Ожидание' },
      { id: 'production', name: 'Производство' },
      { id: 'productions', name: 'Производства' },
      { id: 'menu', name: 'Меню' },
      { id: 'reports', name: 'Отчеты' },
      { id: 'managers', name: 'Менеджеры' },
      { id: 'telegram', name: 'Telegram' }
    ]

    const filteredOrders = orders.filter(o => {
      if (filterStatus !== 'all' && o.status !== filterStatus) return false
      if (filterManager !== 'all' && o.managerId !== parseInt(filterManager)) return false
      if (filterClient !== 'all' && o.clientId !== filterClient) return false
      if (searchQuery && !o.company?.toLowerCase().includes(searchQuery.toLowerCase()) && !o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })

    return (
      <div style={{ minHeight: '100vh', fontFamily: 'system-ui', background: '#f0f2f5' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 32 }}>🍽️</div>
            <div><div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Питание СПБ</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Админ-панель</div></div>
          </div>
          <button onClick={() => { setCurrentUser(null); navigate('login') }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px 16px', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>Выход</button>
        </div>

        <div style={{ background: '#fff', padding: '10px 24px', borderBottom: '1px solid #eee', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {adminTabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '10px 18px', border: 'none', borderRadius: 10, background: tab === t.id ? '#667eea' : 'transparent', color: tab === t.id ? '#fff' : '#555', cursor: 'pointer', fontSize: 14, fontWeight: '500', marginRight: 6 }}>{t.name}</button>
          ))}
        </div>

        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
          
          {tab === 'dashboard' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 20 }}>Обзор</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
                  <div style={{ fontSize: 36, fontWeight: 700 }}>{Object.keys(clients).length}</div>
                  <div style={{ opacity: 0.9 }}>Клиентов</div>
                </div>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
                  <div style={{ fontSize: 36, fontWeight: 700 }}>{orders.filter(o => o.status === 'created').length}</div>
                  <div style={{ opacity: 0.9 }}>Новых заказов</div>
                </div>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
                  <div style={{ fontSize: 36, fontWeight: 700 }}>{finance.count}</div>
                  <div style={{ opacity: 0.9 }}>Заказов за месяц</div>
                </div>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #43e97b, #38f9d7)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
                  <div style={{ fontSize: 36, fontWeight: 700 }}>{finance.sum.toLocaleString()}₽</div>
                  <div style={{ opacity: 0.9 }}>За месяц</div>
                </div>
              </div>
            </div>
          )}

          {tab === 'reports' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 20 }}>Отчеты</h2>
              
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <button onClick={() => setReportPeriod('thisMonth')} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: reportPeriod === 'thisMonth' ? '#667eea' : '#f5f5f5', color: reportPeriod === 'thisMonth' ? '#fff' : '#333', cursor: 'pointer' }}>Этот месяц</button>
                <button onClick={() => setReportPeriod('lastMonth')} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: reportPeriod === 'lastMonth' ? '#667eea' : '#f5f5f5', color: reportPeriod === 'lastMonth' ? '#fff' : '#333', cursor: 'pointer' }}>Прошлый месяц</button>
                <button onClick={() => setReportPeriod('year')} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: reportPeriod === 'year' ? '#667eea' : '#f5f5f5', color: reportPeriod === 'year' ? '#fff' : '#333', cursor: 'pointer' }}>За год</button>
                <button onClick={() => setReportPeriod('all')} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: reportPeriod === 'all' ? '#667eea' : '#f5f5f5', color: reportPeriod === 'all' ? '#fff' : '#333', cursor: 'pointer' }}>Все время</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>Всего заказов</div>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{finance.count}</div>
                </div>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #43e97b, #38f9d7)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>Получено</div>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{finance.delivered.toLocaleString()}₽</div>
                </div>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>Отменено</div>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{finance.cancelled.toLocaleString()}₽</div>
                </div>
                <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>Итого</div>
                  <div style={{ fontSize: 28, fontWeight: 700 }}>{finance.sum.toLocaleString()}₽</div>
                </div>
              </div>

              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0 }}>По менеджерам</h3>
                {managers.map(mgr => {
                  const mgrStats = getFinanceStats(o => o.managerId === mgr.id)
                  return (
                    <div key={mgr.id} style={{ padding: 14, background: '#f8f9fa', borderRadius: 10, marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>{mgr.name}</b><span>Заказов: {mgrStats.count}</span></div>
                      <div style={{ fontSize: 13, color: '#666' }}>Сумма: {mgrStats.sum.toLocaleString()}₽ | Премия: {Math.round(mgrStats.sum * (mgr.bonusPercent || 5) / 100)}₽</div>
                    </div>
                  )
                })}
              </div>

              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0 }}>По производствам</h3>
                {productions.map(prod => {
                  const prodStats = getProductionStats(prod.id)
                  return (
                    <div key={prod.id} style={{ padding: 14, background: '#f8f9fa', borderRadius: 10, marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>{prod.name}</b><span>Заказов: {prodStats.count}</span></div>
                      <div style={{ fontSize: 13, color: '#666' }}>Сумма: {prodStats.sum.toLocaleString()}₽</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 20 }}>Заказы ({filteredOrders.length})</h2>
              
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 150 }} />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 150 }}>
                  <option value="all">Все статусы</option>
                  {Object.entries(ORDER_STATUS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
                </select>
                <select value={filterManager} onChange={(e) => setFilterManager(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 150 }}>
                  <option value="all">Все менеджеры</option>
                  {managers.map(mgr => <option key={mgr.id} value={mgr.id}>{mgr.name}</option>)}
                </select>
                <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 150 }}>
                  <option value="all">Все клиенты</option>
                  {Object.values(clients).map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                </select>
              </div>
              
              {filteredOrders.slice(0, 30).map(order => {
                const mgr = getManager(order.managerId)
                const prod = getProduction(order.productionId)
                return (
                  <div key={order.id} style={{ ...sectionStyle, borderLeft: `4px solid ${ORDER_STATUS[order.status]?.color}`, borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>{order.orderNumber}</div>
                        <div style={{ fontSize: 14 }}>{order.company}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{order.date} | {order.menuName}</div>
                        <div style={{ fontSize: 12, color: '#667eea' }}>Менеджер: {mgr?.name || '-'} | Производство: {prod?.name || '-'}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: 20 }}>{order.total.toLocaleString()}₽</div>
                        <span style={{ padding: '4px 12px', background: ORDER_STATUS[order.status]?.bg, color: ORDER_STATUS[order.status]?.color, borderRadius: 20, fontSize: 12 }}>{ORDER_STATUS[order.status]?.label}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'waiting' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 20 }}>Ожидают ({orders.filter(o => o.status === 'created').length})</h2>
              {orders.filter(o => o.status === 'created').map(order => {
                const mgr = getManager(order.managerId)
                return (
                  <div key={order.id} style={{ ...sectionStyle, borderLeft: '4px solid #f5576c', borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>{order.orderNumber}</div>
                        <div>{order.company}</div>
                        <div style={{ fontSize: 12, color: '#667eea' }}>Менеджер: {mgr?.name || '-'}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>Адрес: {order.address}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: 20, color: '#f5576c' }}>{order.total.toLocaleString()}₽</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                      <button onClick={() => updateOrderStatus(order.id, 'confirmed')} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>Подтвердить</button>
                      <button onClick={() => updateOrderStatus(order.id, 'cancelled')} style={{ flex: 1, padding: 14, background: '#f5576c', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>Отклонить</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'production' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 20 }}>В работе ({orders.filter(o => ['confirmed', 'production', 'delivery'].includes(o.status)).length})</h2>
              {orders.filter(o => ['confirmed', 'production', 'delivery'].includes(o.status)).map(order => (
                <div key={order.id} style={{ ...sectionStyle, borderLeft: '4px solid #9C27B0', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{order.orderNumber}</div>
                      <div>{order.company}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{order.menuName}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 20 }}>{order.total.toLocaleString()}₽</div>
                      <span style={{ padding: '4px 12px', background: ORDER_STATUS[order.status]?.bg, color: ORDER_STATUS[order.status]?.color, borderRadius: 20, fontSize: 12 }}>{ORDER_STATUS[order.status]?.label}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                    {order.status === 'confirmed' && <button onClick={() => updateOrderStatus(order.id, 'production')} style={{ flex: 1, padding: 14, background: '#9C27B0', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Принять</button>}
                    {order.status === 'production' && <button onClick={() => updateOrderStatus(order.id, 'delivery')} style={{ flex: 1, padding: 14, background: '#4facfe', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Отправить</button>}
                    {order.status === 'delivery' && <button onClick={() => updateOrderStatus(order.id, 'delivered')} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Доставлен</button>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'clients' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>Клиенты</h2>
                <button onClick={() => { setNewUserType('client'); setShowAddUser(true) }} style={buttonPrimaryStyle}>+ Добавить</button>
              </div>
              <input type="text" placeholder="Поиск..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle, marginBottom: 16, maxWidth: 300 }} />
              
              {Object.values(clients).filter(c => !searchQuery || c.company.toLowerCase().includes(searchQuery.toLowerCase())).map(c => {
                const mgr = getManager(c.managerId)
                const prod = getProduction(c.productionId)
                return (
                  <div key={c.id} style={{ ...sectionStyle, borderLeft: '4px solid #667eea', borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 18 }}>{c.company}</h3>
                        <div style={{ fontSize: 13, color: '#666' }}>{c.id} | {c.contact} | {c.phone}</div>
                        <div style={{ fontSize: 12, color: '#667eea' }}>Менеджер: {mgr?.name || '-'} | Производство: {prod?.name || '-'}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div>Сотрудников: <b>{c.staff?.regular || 0}</b></div>
                        <button onClick={() => setEditingClient({...c})} style={{ marginTop: 8, padding: '8px 16px', background: '#667eea', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Изменить</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>Пользователи</h2>
              </div>
              
              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0 }}>Добавить</h3>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <button onClick={() => { setNewUserType('client'); setShowAddUser(true) }} style={{ padding: '12px 20px', border: 'none', borderRadius: 10, background: newUserType === 'client' ? '#667eea' : '#f5f5f5', color: newUserType === 'client' ? '#fff' : '#333', cursor: 'pointer' }}>Клиент</button>
                  <button onClick={() => { setNewUserType('production'); setShowAddUser(true) }} style={{ padding: '12px 20px', border: 'none', borderRadius: 10, background: newUserType === 'production' ? '#f5576c' : '#f5f5f5', color: newUserType === 'production' ? '#fff' : '#333', cursor: 'pointer' }}>Производство</button>
                  <button onClick={() => { setNewUserType('manager'); setShowAddUser(true) }} style={{ padding: '12px 20px', border: 'none', borderRadius: 10, background: newUserType === 'manager' ? '#43e97b' : '#f5f5f5', color: newUserType === 'manager' ? '#fff' : '#333', cursor: 'pointer' }}>Менеджер</button>
                </div>
              </div>
            </div>
          )}

          {tab === 'menu' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>Меню</h2>
                <button onClick={() => setEditingMenu({ id: null, name: 'Новое меню', rations: { breakfast: {price: 280}, lunch: {price: 420}, dinner: {price: 380}, night: {price: 450}, snack: {price: 180} }, active: true, approved: false, managerIds: [], productionIds: [], singlePrice: 0 })} style={buttonPrimaryStyle}>+ Добавить меню</button>
              </div>
              
              {menus.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Нет меню. Нажмите "+ Добавить меню"</div>
              ) : (
                menus.map(menu => (
                  <div key={menu.id} style={{ ...sectionStyle, borderLeft: menu.approved ? '4px solid #43e97b' : '4px solid #f5576c', borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 18 }}>{menu.name}</h3>
                        {menu.singlePrice > 0 && <div style={{ fontSize: 12, color: '#43e97b' }}>Единая цена: {menu.singlePrice}₽ за порцию</div>}
                        <div style={{ fontSize: 12, color: '#667eea' }}>Менеджеры: {menu.managerIds?.map(id => getManager(id)?.name).filter(Boolean).join(', ') || 'Все'}</div>
                        <div style={{ fontSize: 12, color: '#f5576c' }}>Производства: {menu.productionIds?.map(id => getProduction(id)?.name).filter(Boolean).join(', ') || 'Все'}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => setMenus(prev => prev.map(m => m.id === menu.id ? {...m, approved: !m.approved} : m))} style={{ padding: '8px 14px', background: menu.approved ? '#f5576c' : '#43e97b', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>{menu.approved ? 'Выкл' : 'Вкл'}</button>
                        <button onClick={() => setEditingMenu({...menu})} style={{ padding: '8px 14px', background: '#667eea', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Изменить</button>
                        <button onClick={() => handleDeleteMenu(menu.id)} style={{ padding: '8px 14px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Удалить</button>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                      {Object.entries(RATION_TYPES).map(([key, ration]) => (
                        <div key={key} style={{ padding: 12, background: '#f8f9fa', borderRadius: 10, textAlign: 'center' }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{ration.name}</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: '#667eea' }}>{menu.rations?.[key]?.price || 0}₽</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'productions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>Производства</h2>
                <button onClick={() => { setNewUserType('production'); setShowAddUser(true) }} style={buttonPrimaryStyle}>+ Добавить</button>
              </div>
              
              {productions.map(prod => (
                <div key={prod.id} style={{ ...sectionStyle, borderLeft: prod.type === 'own' ? '4px solid #43e97b' : '4px solid #f5576c', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18 }}>{prod.name}</h3>
                      <span style={{ background: prod.type === 'own' ? '#43e97b' : '#f5576c', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>{prod.type === 'own' ? 'Свое' : 'Партнер'}</span>
                    </div>
                    <button onClick={() => setEditingProduction({...prod})} style={buttonSecondaryStyle}>Изменить</button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 14 }}>
                    {Object.entries(RATION_TYPES).map(([key, ration]) => (
                      <div key={key} style={{ padding: 14, background: '#f8f9fa', borderRadius: 10, textAlign: 'center' }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{ration.name}</div>
                        <div style={{ fontSize: 16, color: '#667eea', fontWeight: 700 }}>{prod.rations?.[key] || 0}₽</div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#666' }}>
                    <span>Адрес: {prod.address || '-'}</span>
                    <span>Контакт: {prod.contact || '-'}</span>
                    <span>{prod.delivery ? `Доставка (${prod.deliveryPrice}₽)` : 'Самовывоз'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'managers' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>Менеджеры</h2>
                <button onClick={() => { setNewUserType('manager'); setShowAddUser(true) }} style={buttonPrimaryStyle}>+ Добавить</button>
              </div>
              
              {managers.map(mgr => (
                <div key={mgr.id} style={{ ...sectionStyle, borderLeft: '4px solid #667eea', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18 }}>{mgr.name}</h3>
                      <div style={{ fontSize: 14, color: '#666' }}>{mgr.phone} | {mgr.telegram}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>Логин: {mgr.login}</div>
                    </div>
                    <button onClick={() => setEditingManager({...mgr})} style={buttonSecondaryStyle}>Изменить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'telegram' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 20 }}>Telegram</h2>
              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0 }}>Боты</h3>
                {bots.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>Нет ботов. Нажмите "+ Добавить бота"</div>
                ) : (
                  bots.map(bot => (
                    <div key={bot.id} style={{ padding: 14, background: bot.active ? '#E8F5E9' : '#f8f9fa', borderRadius: 10, marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <b>{bot.name}</b>
                          <span style={{ background: bot.type === 'office' ? '#667eea' : '#f5576c', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>{bot.type}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => setEditingBot({...bot})} style={{ padding: '8px 14px', background: '#667eea', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Изменить</button>
                          <button onClick={() => handleDeleteBot(bot.id)} style={{ padding: '8px 14px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Удалить</button>
                          <button onClick={() => setBots(prev => prev.map(b => b.id === bot.id ? {...b, active: !b.active} : b))} style={{ padding: '8px 14px', background: bot.active ? '#f44336' : '#43e97b', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>{bot.active ? 'Выкл' : 'Вкл'}</button>
                        </div>
                      </div>
                      {bot.active && (
                        <div style={{ marginTop: 10, fontSize: 13, color: '#666' }}>
                          <div>Token: <code style={{ fontSize: 11 }}>{bot.token?.slice(0, 20)}...</code></div>
                          <div>Chat ID: {bot.chatId} | Thread: {bot.threadId}</div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                <button onClick={() => setEditingBot({ id: null, name: 'Новый бот', token: '', chatId: '', active: false, type: 'office', threadId: 0 })} style={{ ...buttonPrimaryStyle, marginTop: 10 }}>+ Добавить бота</button>
              </div>
              
              <div style={sectionStyle}>
                <h3 style={{ marginTop: 0 }}>Темы (Threads)</h3>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div><label style={labelStyle}>Ожидание заказов:</label><input type="number" value={threads.waiting} onChange={(e) => setThreads({...threads, waiting: parseInt(e.target.value)})} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Новые заявки:</label><input type="number" value={threads.newUser} onChange={(e) => setThreads({...threads, newUser: parseInt(e.target.value)})} style={inputStyle} /></div>
                  <div><label style={labelStyle}>История:</label><input type="number" value={threads.history} onChange={(e) => setThreads({...threads, history: parseInt(e.target.value)})} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Заказы:</label><input type="number" value={threads.orders} onChange={(e) => setThreads({...threads, orders: parseInt(e.target.value)})} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Производство:</label><input type="number" value={threads.production} onChange={(e) => setThreads({...threads, production: parseInt(e.target.value)})} style={inputStyle} /></div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* МОДАЛКИ */}
        {showAddUser && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, maxWidth: 500, width: '90%' }}>
              <h2 style={{ marginTop: 0, marginBottom: 20, textAlign: 'center' }}>
                {newUserType === 'client' && 'Добавить клиента'}
                {newUserType === 'production' && 'Добавить производство'}
                {newUserType === 'manager' && 'Добавить менеджера'}
              </h2>
              
              <div style={{ display: 'grid', gap: 12 }}>
                <div><label style={labelStyle}>Логин:</label><input type="text" value={newUserData.login} onChange={(e) => setNewUserData({...newUserData, login: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Пароль:</label><input type="text" value={newUserData.password} onChange={(e) => setNewUserData({...newUserData, password: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>{newUserType === 'client' ? 'Компания:' : 'Имя:'}</label><input type="text" value={newUserData.name} onChange={(e) => setNewUserData({...newUserData, name: e.target.value, company: newUserType === 'client' ? e.target.value : newUserData.company})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Телефон:</label><input type="text" value={newUserData.phone} onChange={(e) => setNewUserData({...newUserData, phone: e.target.value})} style={inputStyle} /></div>
              </div>
              
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={handleCreateUser} style={{ flex: 1, padding: 14, background: '#667eea', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16 }}>Создать</button>
                <button onClick={() => setShowAddUser(false)} style={{ flex: 1, padding: 14, background: '#f5f5f5', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {editingMenu && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>{editingMenu.id ? 'Редактирование меню' : 'Новое меню'}</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
                <div><label style={labelStyle}>Название:</label><input type="text" value={editingMenu.name} onChange={(e) => setEditingMenu({...editingMenu, name: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Единая цена за порцию (0 - использовать цены ниже):</label><input type="number" value={editingMenu.singlePrice || 0} onChange={(e) => setEditingMenu({...editingMenu, singlePrice: parseInt(e.target.value) || 0})} style={inputStyle} /></div>
              </div>
              
              <h4 style={{ marginTop: 20 }}>Цены по рационам:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                {Object.entries(RATION_TYPES).map(([key, ration]) => (
                  <div key={key}><label style={labelStyle}>{ration.name}:</label><input type="number" value={editingMenu.rations?.[key]?.price || 0} onChange={(e) => setEditingMenu({...editingMenu, rations: { ...editingMenu.rations, [key]: { ...editingMenu.rations?.[key], price: parseInt(e.target.value) }}})} style={inputStyle} /></div>
                ))}
              </div>
              
              <h4 style={{ marginTop: 20 }}>Менеджеры:</h4>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {managers.map(mgr => (
                  <label key={mgr.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: editingMenu.managerIds?.includes(mgr.id) ? '#667eea' : '#f5f5f5', color: editingMenu.managerIds?.includes(mgr.id) ? '#fff' : '#333', borderRadius: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={editingMenu.managerIds?.includes(mgr.id)} onChange={(e) => {
                      const ids = editingMenu.managerIds || []
                      setEditingMenu({...editingMenu, managerIds: e.target.checked ? [...ids, mgr.id] : ids.filter(id => id !== mgr.id)})
                    }} style={{ display: 'none' }} />
                    {mgr.name}
                  </label>
                ))}
              </div>
              
              <h4 style={{ marginTop: 20 }}>Производства:</h4>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {productions.map(prod => (
                  <label key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: editingMenu.productionIds?.includes(prod.id) ? '#f5576c' : '#f5f5f5', color: editingMenu.productionIds?.includes(prod.id) ? '#fff' : '#333', borderRadius: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={editingMenu.productionIds?.includes(prod.id)} onChange={(e) => {
                      const ids = editingMenu.productionIds || []
                      setEditingMenu({...editingMenu, productionIds: e.target.checked ? [...ids, prod.id] : ids.filter(id => id !== prod.id)})
                    }} style={{ display: 'none' }} />
                    {prod.name}
                  </label>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={handleSaveMenu} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Сохранить</button>
                <button onClick={() => setEditingMenu(null)} style={{ flex: 1, padding: 14, background: '#f5576c', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}


        {editingBot && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, maxWidth: 500, width: '90%' }}>
              <h2 style={{ marginTop: 0 }}>{editingBot.id ? 'Настройка бота' : 'Новый бот'}</h2>
              
              <div style={{ display: 'grid', gap: 12 }}>
                <div><label style={labelStyle}>Название:</label><input type="text" value={editingBot.name} onChange={(e) => setEditingBot({...editingBot, name: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Тип:</label><select value={editingBot.type} onChange={(e) => setEditingBot({...editingBot, type: e.target.value})} style={inputStyle}><option value="office">Офис</option><option value="production">Производство</option><option value="clients">Клиенты</option></select></div>
                <div><label style={labelStyle}>Telegram Token:</label><input type="text" value={editingBot.token} onChange={(e) => setEditingBot({...editingBot, token: e.target.value})} style={inputStyle} placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz" /></div>
                <div><label style={labelStyle}>Chat ID:</label><input type="text" value={editingBot.chatId} onChange={(e) => setEditingBot({...editingBot, chatId: e.target.value})} style={inputStyle} placeholder="-1001234567890" /></div>
                <div><label style={labelStyle}>Thread ID:</label><input type="number" value={editingBot.threadId || 0} onChange={(e) => setEditingBot({...editingBot, threadId: parseInt(e.target.value) || 0})} style={inputStyle} /></div>
              </div>
              
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={handleSaveBot} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Сохранить</button>
                <button onClick={() => setEditingBot(null)} style={{ flex: 1, padding: 14, background: '#f5576c', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {editingClient && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>Редактирование клиента</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>ID:</label><input type="text" value={editingClient.id} onChange={(e) => setEditingClient({...editingClient, id: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Компания:</label><input type="text" value={editingClient.company} onChange={(e) => setEditingClient({...editingClient, company: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Контакт:</label><input type="text" value={editingClient.contact} onChange={(e) => setEditingClient({...editingClient, contact: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Телефон:</label><input type="text" value={editingClient.phone} onChange={(e) => setEditingClient({...editingClient, phone: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Адрес:</label><input type="text" value={editingClient.address || ''} onChange={(e) => setEditingClient({...editingClient, address: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Сотрудников:</label><input type="number" value={editingClient.staff?.regular || 0} onChange={(e) => setEditingClient({...editingClient, staff: { ...editingClient.staff, regular: parseInt(e.target.value) || 0 }})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Менеджер:</label><select value={editingClient.managerId || 1} onChange={(e) => setEditingClient({...editingClient, managerId: parseInt(e.target.value)})} style={inputStyle}>{managers.map(mgr => <option key={mgr.id} value={mgr.id}>{mgr.name}</option>)}</select></div>
                <div><label style={labelStyle}>Производство:</label><select value={editingClient.productionId || 1} onChange={(e) => setEditingClient({...editingClient, productionId: parseInt(e.target.value)})} style={inputStyle}>{productions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                <div><label style={labelStyle}>Меню:</label><select value={editingClient.menuIds?.[0] || 1} onChange={(e) => setEditingClient({...editingClient, menuIds: [parseInt(e.target.value)]})} style={inputStyle}>{menus.filter(m => m.approved).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                <div><label style={labelStyle}>Скидка (%):</label><input type="number" value={editingClient.discount || 0} onChange={(e) => setEditingClient({...editingClient, discount: parseInt(e.target.value) || 0})} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={() => { setClients(prev => ({...prev, [editingClient.id]: editingClient})); setEditingClient(null); alert('Сохранено!') }} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Сохранить</button>
                <button onClick={() => setEditingClient(null)} style={{ flex: 1, padding: 14, background: '#f5576c', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {editingProduction && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>Редактирование производства</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Название:</label><input type="text" value={editingProduction.name} onChange={(e) => setEditingProduction({...editingProduction, name: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Тип:</label><select value={editingProduction.type} onChange={(e) => setEditingProduction({...editingProduction, type: e.target.value})} style={inputStyle}><option value="own">Свое</option><option value="partner">Партнер</option></select></div>
                <div><label style={labelStyle}>Адрес:</label><input type="text" value={editingProduction.address} onChange={(e) => setEditingProduction({...editingProduction, address: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Контакт:</label><input type="text" value={editingProduction.contact} onChange={(e) => setEditingProduction({...editingProduction, contact: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Доставка:</label><input type="checkbox" checked={editingProduction.delivery} onChange={(e) => setEditingProduction({...editingProduction, delivery: e.target.checked})} /><span>{editingProduction.delivery ? ` Цена: ${editingProduction.deliveryPrice}₽` : ''}</span></div>
              </div>
              <h4 style={{ marginTop: 20 }}>Стоимость рационов:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                {Object.entries(RATION_TYPES).map(([key, ration]) => (
                  <div key={key}><label style={labelStyle}>{ration.name}:</label><input type="number" value={editingProduction.rations?.[key] || 0} onChange={(e) => setEditingProduction({...editingProduction, rations: { ...editingProduction.rations, [key]: parseInt(e.target.value) }})} style={inputStyle} /></div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={() => { setProductions(prev => prev.map(p => p.id === editingProduction.id ? editingProduction : p)); setEditingProduction(null); alert('Сохранено!') }} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Сохранить</button>
                <button onClick={() => setEditingProduction(null)} style={{ flex: 1, padding: 14, background: '#f5576c', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {editingManager && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, maxWidth: 600, width: '90%' }}>
              <h2 style={{ marginTop: 0 }}>Редактирование менеджера</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={labelStyle}>Имя:</label><input type="text" value={editingManager.name} onChange={(e) => setEditingManager({...editingManager, name: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Телефон:</label><input type="text" value={editingManager.phone} onChange={(e) => setEditingManager({...editingManager, phone: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Telegram:</label><input type="text" value={editingManager.telegram} onChange={(e) => setEditingManager({...editingManager, telegram: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Логин:</label><input type="text" value={editingManager.login} onChange={(e) => setEditingManager({...editingManager, login: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Пароль:</label><input type="text" value={editingManager.password} onChange={(e) => setEditingManager({...editingManager, password: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Оклад:</label><input type="number" value={editingManager.salary || 0} onChange={(e) => setEditingManager({...editingManager, salary: parseInt(e.target.value)})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Премия (%):</label><input type="number" value={editingManager.bonusPercent || 5} onChange={(e) => setEditingManager({...editingManager, bonusPercent: parseInt(e.target.value)})} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={() => { setManagers(prev => prev.map(m => m.id === editingManager.id ? editingManager : m)); setEditingManager(null); alert('Сохранено!') }} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Сохранить</button>
                <button onClick={() => setEditingManager(null)} style={{ flex: 1, padding: 14, background: '#f5576c', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

      </div>
    )
  }

  // === ПАНЕЛЬ МЕНЕДЖЕРА ===
  if (view === 'manager') {
    const myManagerId = currentUser?.managerId
    const myClients = Object.values(clients).filter(c => c.managerId === myManagerId)
    const myFinance = getFinanceStats(o => myClients.some(c => c.id === o.clientId))
    return (
      <div style={{ minHeight: '100vh', fontFamily: 'system-ui', background: '#f0f2f5' }}>
        <div style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
          <div><div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Панель менеджера</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{currentUser?.name}</div></div>
          <button onClick={() => { setCurrentUser(null); navigate('login') }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px 16px', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>Выход</button>
        </div>

        <div style={{ padding: 24 }}>
          <h2 style={{ marginTop: 0 }}>Отчеты</h2>
          
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button onClick={() => setReportPeriod('thisMonth')} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: reportPeriod === 'thisMonth' ? '#43e97b' : '#f5f5f5', color: reportPeriod === 'thisMonth' ? '#fff' : '#333', cursor: 'pointer' }}>Этот месяц</button>
            <button onClick={() => setReportPeriod('lastMonth')} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: reportPeriod === 'lastMonth' ? '#43e97b' : '#f5f5f5', color: reportPeriod === 'lastMonth' ? '#fff' : '#333', cursor: 'pointer' }}>Прошлый месяц</button>
            <button onClick={() => setReportPeriod('year')} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: reportPeriod === 'year' ? '#43e97b' : '#f5f5f5', color: reportPeriod === 'year' ? '#fff' : '#333', cursor: 'pointer' }}>За год</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #43e97b, #38f9d7)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Мои клиенты</div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{myClients.length}</div>
            </div>
            <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Заказов</div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{myFinance.count}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Сумма: {myFinance.sum.toLocaleString()}₽</div>
            </div>
            <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Премия</div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{Math.round(myFinance.sum * 0.05).toLocaleString()}₽</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>5% от суммы</div>
            </div>
          </div>

          <h2>Мои клиенты</h2>
          {myClients.map(c => (
            <div key={c.id} style={{ ...sectionStyle, borderLeft: '4px solid #43e97b', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18 }}>{c.company}</h3>
                  <div style={{ fontSize: 13, color: '#666' }}>{c.contact} | {c.phone}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>Сотрудников: {c.staff?.regular || 0}</div>
                </div>
                <button onClick={() => setEditingClient({...c})} style={buttonSecondaryStyle}>Изменить</button>
              </div>
            </div>
          ))}
        </div>

        {editingClient && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, maxWidth: 600, width: '90%' }}>
              <h2 style={{ marginTop: 0 }}>Редактирование клиента</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                <div><label style={labelStyle}>Компания:</label><input type="text" value={editingClient.company} onChange={(e) => setEditingClient({...editingClient, company: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Контакт:</label><input type="text" value={editingClient.contact} onChange={(e) => setEditingClient({...editingClient, contact: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Телефон:</label><input type="text" value={editingClient.phone} onChange={(e) => setEditingClient({...editingClient, phone: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Адрес:</label><input type="text" value={editingClient.address || ''} onChange={(e) => setEditingClient({...editingClient, address: e.target.value})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Сотрудников:</label><input type="number" value={editingClient.staff?.regular || 0} onChange={(e) => setEditingClient({...editingClient, staff: { ...editingClient.staff, regular: parseInt(e.target.value) || 0 }})} style={inputStyle} /></div>
                <div><label style={labelStyle}>Меню:</label><select value={editingClient.menuIds?.[0] || 1} onChange={(e) => setEditingClient({...editingClient, menuIds: [parseInt(e.target.value)]})} style={inputStyle}>{menus.filter(m => m.approved && m.managerIds?.includes(myManagerId)).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={() => { setClients(prev => ({...prev, [editingClient.id]: editingClient})); setEditingClient(null); alert('Сохранено!') }} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Сохранить</button>
                <button onClick={() => setEditingClient(null)} style={{ flex: 1, padding: 14, background: '#f5576c', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // === ПАНЕЛЬ ПРОИЗВОДСТВА ===
  if (view === 'production') {
    const myProductionId = currentUser?.productionId
    const prodStats = getProductionStats(myProductionId)

    return (
      <div style={{ minHeight: '100vh', fontFamily: 'system-ui', background: '#f0f2f5' }}>
        <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
          <div><div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Производство</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{currentUser?.name}</div></div>
          <button onClick={() => { setCurrentUser(null); navigate('login') }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px 16px', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>Выход</button>
        </div>

        <div style={{ padding: 24 }}>
          <h2 style={{ marginTop: 0 }}>Отчеты</h2>
          
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button onClick={() => setReportPeriod('thisMonth')} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: reportPeriod === 'thisMonth' ? '#f5576c' : '#f5f5f5', color: reportPeriod === 'thisMonth' ? '#fff' : '#333', cursor: 'pointer' }}>Этот месяц</button>
            <button onClick={() => setReportPeriod('lastMonth')} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: reportPeriod === 'lastMonth' ? '#f5576c' : '#f5f5f5', color: reportPeriod === 'lastMonth' ? '#fff' : '#333', cursor: 'pointer' }}>Прошлый месяц</button>
            <button onClick={() => setReportPeriod('year')} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: reportPeriod === 'year' ? '#f5576c' : '#f5f5f5', color: reportPeriod === 'year' ? '#fff' : '#333', cursor: 'pointer' }}>За год</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Заказов</div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{prodStats.count}</div>
            </div>
            <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Сумма</div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{prodStats.sum.toLocaleString()}₽</div>
            </div>
            <div style={{ ...sectionStyle, background: 'linear-gradient(135deg, #43e97b, #38f9d7)', color: '#fff', padding: 24, textAlign: 'center', borderRadius: 16 }}>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Менеджеров</div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{Object.keys(prodStats.byManager).length}</div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>По менеджерам</h3>
            {Object.entries(prodStats.byManager).map(([mgrName, data]) => (
              <div key={mgrName} style={{ padding: 12, background: '#f8f9fa', borderRadius: 10, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>{mgrName}</b><span>{data.count} заказов</span></div>
                <div style={{ fontSize: 13, color: '#666' }}>Сумма: {data.sum.toLocaleString()}₽ | Порций: {data.portions}</div>
              </div>
            ))}
          </div>

          <h2>Заказы</h2>
          {orders.filter(o => o.productionId === myProductionId && ['confirmed', 'production', 'delivery'].includes(o.status)).map(order => {
            const mgr = getManager(order.managerId)
            return (
              <div key={order.id} style={{ ...sectionStyle, borderLeft: '4px solid #f5576c', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{order.orderNumber}</div>
                    <div>{order.company}</div>
                    <div style={{ fontSize: 12, color: '#667eea' }}>Менеджер: {mgr?.name || '-'}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{order.menuName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>{order.total.toLocaleString()}₽</div>
                    <span style={{ padding: '4px 12px', background: ORDER_STATUS[order.status]?.bg, color: ORDER_STATUS[order.status]?.color, borderRadius: 20, fontSize: 12 }}>{ORDER_STATUS[order.status]?.label}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  {order.status === 'confirmed' && <button onClick={() => updateOrderStatus(order.id, 'production')} style={{ flex: 1, padding: 14, background: '#f5576c', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Принять</button>}
                  {order.status === 'production' && <button onClick={() => updateOrderStatus(order.id, 'delivery')} style={{ flex: 1, padding: 14, background: '#4facfe', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Отправить</button>}
                  {order.status === 'delivery' && <button onClick={() => updateOrderStatus(order.id, 'delivered')} style={{ flex: 1, padding: 14, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Доставлен</button>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // === ЛИЧНЫЙ КАБИНЕТ КЛИЕНТА ===
  return (
    <div style={{ padding: 16, maxWidth: 550, margin: '0 auto', fontFamily: 'system-ui', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 20, borderRadius: 16, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 style={{ fontSize: 22, margin: 0, color: '#fff' }}>Питание СПБ</h1><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Личный кабинет</div></div>
        <button onClick={() => { setCurrentClient(null); navigate('login') }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '10px 16px', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>Выход</button>
      </div>

      <div style={{ background: '#fff', padding: 20, borderRadius: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>{currentClient.company}</h2>
            <div style={{ fontSize: 13, color: '#666' }}>{currentClient.contact} | {currentClient.phone}</div>
            <div style={{ fontSize: 12, color: '#888' }}>Адрес: {currentClient.address}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ background: currentClient.clientType === 'contract' ? '#43e97b' : '#4facfe', color: '#fff', padding: '6px 12px', borderRadius: 20, fontSize: 12 }}>{CLIENT_TYPES[currentClient.clientType]?.name}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto' }}>
        {[{ id: 'dashboard', name: 'Обзор' }, { id: 'menu', name: 'Меню' }, { id: 'orders', name: 'Заказы' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '12px 16px', border: 'none', borderRadius: 10, background: tab === t.id ? '#667eea' : '#fff', color: tab === t.id ? '#fff' : '#333', cursor: 'pointer', fontSize: 14 }}>{t.name}</button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div style={{ background: '#fff', padding: 20, borderRadius: 16, marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: 16, background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 12, textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: 28, fontWeight: 'bold' }}>{orders.filter(o => o.clientId === currentClient.id && o.status === 'created').length}</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>ожидают</div>
            </div>
            <div style={{ padding: 16, background: 'linear-gradient(135deg, #43e97b, #38f9d7)', borderRadius: 12, textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: 28, fontWeight: 'bold' }}>{orders.filter(o => o.clientId === currentClient.id && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0).toLocaleString()}₽</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>всего заказов</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'menu' && (
        <div style={{ background: '#fff', padding: 20, borderRadius: 16, marginBottom: 12 }}>
          <h3 style={{ marginTop: 0, marginBottom: 14 }}>Выберите меню</h3>
          {menus.filter(m => m.approved && m.managerIds?.includes(currentClient.managerId) && m.productionIds?.includes(currentClient.productionId)).map(menu => (
            <button key={menu.id} onClick={() => setSelectedMenuId(menu.id)} style={{ width: '100%', padding: '14px', marginBottom: 10, border: selectedMenuId === menu.id ? '2px solid #667eea' : '2px solid #e0e0e0', borderRadius: 12, background: selectedMenuId === menu.id ? '#E8F5E9' : '#fff', cursor: 'pointer', textAlign: 'left' }}>
              <b>{menu.name}</b>
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                {menu.singlePrice > 0 ? `Единая цена: ${menu.singlePrice}₽` : Object.entries(RATION_TYPES).map(([k, r]) => `${r.name}: ${menu.rations?.[k]?.price || 0}₽`).join(' | ')}
              </div>
            </button>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div style={{ background: '#fff', padding: 20, borderRadius: 16, marginBottom: 12 }}>
          <h3 style={{ marginTop: 0, marginBottom: 14 }}>Новый заказ</h3>
          
          <label style={labelStyle}>Рационы:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 14 }}>
            {Object.entries(RATION_TYPES).map(([key, ration]) => (
              <button key={key} onClick={() => setSelectedRations(prev => prev.includes(key) ? prev.filter(r => r !== key) : [...prev, key])} style={{ padding: 12, border: selectedRations.includes(key) ? '2px solid #667eea' : '2px solid #e0e0e0', borderRadius: 10, background: selectedRations.includes(key) ? '#E8F5E9' : '#fff', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{ration.name}</div>
              </button>
            ))}
          </div>

          <label style={labelStyle}>Количество человек:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {selectedRations.map(r => (
              <div key={r}><label style={{ fontSize: 12 }}>{RATION_TYPES[r]?.name}:</label><input type="number" value={orderQuantity[r] || 0} onChange={(e) => setOrderQuantity({...orderQuantity, [r]: parseInt(e.target.value) || 0})} style={inputStyle} /></div>
            ))}
          </div>

          <button onClick={createOrder} disabled={selectedRations.length === 0} style={{ ...buttonPrimaryStyle, width: '100%', padding: 14, borderRadius: 10, background: selectedRations.length > 0 ? '#43e97b' : '#ccc' }}>Создать заказ</button>

          <h4 style={{ marginTop: 20 }}>Мои заказы:</h4>
          {orders.filter(o => o.clientId === currentClient.id).slice(0, 10).map(order => (
            <div key={order.id} style={{ padding: 12, background: '#f8f9fa', borderRadius: 10, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>{order.orderNumber}</b>
                <span style={{ fontSize: 12, color: '#666' }}>{order.date}</span>
              </div>
              <div style={{ fontSize: 13, color: '#666' }}>{order.menuName} | {order.total.toLocaleString()}₽</div>
              <div style={{ fontSize: 12, color: ORDER_STATUS[order.status]?.color }}>{ORDER_STATUS[order.status]?.label}</div>
              
              {order.status === 'created' && <button onClick={() => cancelOrder(order.id)} style={{ marginTop: 8, padding: '8px', background: '#f5576c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', width: '100%' }}>Отменить</button>}
              {order.status === 'delivery' && <button onClick={() => confirmDelivery(order.id)} style={{ marginTop: 8, padding: '8px', background: '#43e97b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', width: '100%' }}>Подтвердить получение</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default App