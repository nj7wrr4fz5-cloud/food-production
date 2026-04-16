import { useState, useEffect } from 'react'

const COMPANY_TYPES = [
  { id: 'office', name: 'Офис', emoji: '🏢' },
  { id: 'plant', name: 'Производство', emoji: '🏭' },
  { id: 'quarter', name: 'Квартал', emoji: '📅' }
]

const SPREADSHEET_ID = '1VRSHLi1eu7k5cT6lAYWvXbIToTpcMj1rx2saiWwENp4'

const DEFAULT_BOTS = [
  { id: 'bot1', name: 'Shyrik', token: '6706048508:AAF-8INmBKwP1x7DA-_ET8D282c5pp0Rn2Y', chatId: '-1002583331823', active: true }
]

const DEFAULT_THREADS = { waiting: 360, newUser: 361, history: 362, orders: 359 }

const DEFAULT_MENUS = [
  { id: 1, name: 'Стандартное', description: 'Обычное питание', price: { breakfast: 280, lunch: 420, dinner: 380 }, active: true, approved: true },
  { id: 2, name: 'Халяль', description: 'Халяль питание', price: { breakfast: 320, lunch: 480, dinner: 440 }, active: true, approved: true },
  { id: 3, name: 'ПП', description: 'Правильное питание', price: { breakfast: 350, lunch: 520, dinner: 460 }, active: true, approved: true },
  { id: 4, name: 'Директорат', description: 'Премиум питание', price: { breakfast: 420, lunch: 620, dinner: 560 }, active: true, approved: true }
]

const FOOD_TYPES = [
  { id: 'regular', name: 'Обычное', emoji: '🍽️' },
  { id: 'halal', name: 'Халяль', emoji: '🥩' },
  { id: 'pp', name: 'ПП', emoji: '🥗' },
  { id: 'director', name: 'Директорат', emoji: '👔' }
]

const MEALS = [
  { id: 'breakfast', name: 'Завтрак', emoji: '🥐' },
  { id: 'lunch', name: 'Обед', emoji: '🍱' },
  { id: 'dinner', name: 'Ужин', emoji: '🍽️' }
]

const DAYS_RU = {
  monday: 'Понедельник', tuesday: 'Вторник', wednesday: 'Среда',
  thursday: 'Четверг', friday: 'Пятница', saturday: 'Суббота', sunday: 'Воскресенье'
}

const ORDER_STATUS = {
  pending: '⏳ На согласовании',
  confirmed: '✓ Подтверждено',
  production: '🏭 На производстве',
  ready: '✅ Готов к выдаче',
  delivered: '📦 Доставлено',
  cancelled: '❌ Отменено'
}

const DEFAULT_PRODUCTIONS = [
  { id: 1, name: 'Собственное производство', type: 'own', address: 'СПБ, ул. Промышленная, д. 10', contact: '+7 (999) 111-22-33', active: true },
  { id: 2, name: 'Партнёр 1', type: 'partner', address: 'СПБ, ул. Партнёрская, д. 5', contact: '+7 (999) 222-33-44', active: true },
  { id: 3, name: 'Партнёр 2', type: 'partner', address: 'СПБ, ул. Заводская, д. 15', contact: '+7 (999) 333-44-55', active: true }
]

const DEFAULT_MANAGERS = [
  { id: 1, name: 'Анна', phone: '+7 (999) 000-11-22', telegram: '@anna_manager', login: 'ANNA', password: 'anna123' },
  { id: 2, name: 'Мария', phone: '+7 (999) 000-33-44', telegram: '@maria_manager', login: 'MARIA', password: 'maria123' },
  { id: 3, name: 'Иван', phone: '+7 (999) 000-55-66', telegram: '@ivan_manager', login: 'IVAN', password: 'ivan123' }
]

const DEFAULT_CLIENTS = {
  'TEST-001': {
    id: 'TEST-001', company: 'ООО ТехноСтрой', inn: '7812345678', contact: 'Петров Сергей',
    phone: '+7 (999) 123-45-67', email: 'petrov@tehno.ru', address: 'г. Санкт-Петербург, ул. Новая, д. 10',
    companyType: 'office', contractDate: '2025-01-15', paymentMethod: 'card', paymentPeriod: 'monthly',
    active: true, featured: true, discount: 10,
    staff: { regular: 45, halal: 12, pp: 8, director: 3 },
    meals: ['breakfast', 'lunch', 'dinner'],
    deliveryTime: { breakfast: '07:30-08:30', lunch: '12:00-13:00', dinner: '17:30-18:30' },
    managerId: 1, adminComment: '', menuIds: [1, 2], freeLogins: 3, usedLogins: 1,
    userLogins: [{ login: 'TECHNO1', password: 'tech123', name: 'Петров С.' }]
  }
}

// ВСЕ ПОЛЬЗОВАТЕЛИ СИСТЕМЫ
const DEFAULT_USERS = {
  // Админы
  '0901SmolAdmin': { id: '0901SmolAdmin', password: '0901SmolAdmin', role: 'admin', name: 'Админ', lastLogin: null },
  'ADMIN': { id: 'ADMIN', password: 'ADMIN', role: 'admin', name: 'Главный Админ', lastLogin: null },
  
  // Операторы / Менеджеры
  'OPERATOR1': { id: 'OPERATOR1', password: 'operator123', role: 'operator', name: 'Оператор 1 - Анна', managerId: 1, lastLogin: null },
  'OPERATOR2': { id: 'OPERATOR2', password: 'operator456', role: 'operator', name: 'Оператор 2 - Мария', managerId: 2, lastLogin: null },
  'OPERATOR3': { id: 'OPERATOR3', password: 'operator789', role: 'operator', name: 'Оператор 3 - Иван', managerId: 3, lastLogin: null },
  
  // Производство
  'PROD1': { id: 'PROD1', password: 'prod123', role: 'production', name: 'Производство СПБ', lastLogin: null },
  'PROD2': { id: 'PROD2', password: 'prod456', role: 'production', name: 'Партнёр 1', productionId: 2, lastLogin: null },
  
  // Клиенты
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
  const [tab, setTab] = useState('clients')
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
  const [selectedMeals, setSelectedMeals] = useState([])
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([])
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

  useEffect(() => {
    const loadData = () => {
      setClients(loadFromStorage('clients') || DEFAULT_CLIENTS)
      setOrders(loadFromStorage('orders') || [])
      setBots(loadFromStorage('bots') || DEFAULT_BOTS)
      setThreads(loadFromStorage('threads') || DEFAULT_THREADS)
      setUsers(loadFromStorage('users') || DEFAULT_USERS)
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
  const toggleMeal = (mealId) => { setSelectedMeals(prev => prev.includes(mealId) ? prev.filter(id => id !== mealId) : [...prev, mealId]) }
  const toggleFoodType = (typeId) => { setSelectedFoodTypes(prev => prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId]) }

  const addLog = (action, details) => {
    const newLog = { id: Date.now(), action, details, user: currentUser?.name || currentClient?.company || 'Система', date: new Date().toISOString() }
    setLogs(prev => [newLog, ...prev].slice(0, 100))
  }

  const recordLogin = (userId, userName, role) => {
    const loginRecord = { id: Date.now(), userId, userName, role, loginTime: new Date().toISOString() }
    setLoginHistory(prev => [loginRecord, ...prev].slice(0, 50))
    
    // Обновляем lastLogin у пользователя
    setUsers(prev => ({
      ...prev,
      [userId]: { ...prev[userId], lastLogin: new Date().toISOString() }
    }))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const normalized = contractNumber.trim().toUpperCase()
    const pass = password.trim()
    
    // Проверяем пользователей системы
    if (users[normalized] && users[normalized].password === pass) {
      setCurrentUser(users[normalized])
      recordLogin(normalized, users[normalized].name, users[normalized].role)
      addLog('Вход в систему', `Пользователь ${normalized} (${users[normalized].role}) вошёл в систему`)
      navigate('admin')
      return
    }
    
    // Проверяем клиентов
    const upperNormalized = normalized.toUpperCase().trim()
    if (clients[upperNormalized]) {
      const c = clients[upperNormalized]
      if (!c.active) { setLoginError('Договор приостановлен'); return }
      
      // Проверяем дополнительные логины клиента
      const clientLogin = c.userLogins?.find(u => u.login.toUpperCase() === normalized && u.password === pass)
      
      if (clientLogin || pass === 'test') {
        setCurrentClient(c)
        setSelectedMeals(c.meals || ['lunch'])
        setSelectedFoodTypes(['regular'])
        setOrderQuantity({ breakfast: c.staff?.regular || 0, lunch: c.staff?.regular || 0, dinner: c.staff?.regular || 0 })
        recordLogin(upperNormalized, c.company, 'client')
        addLog('Вход клиента', `Клиент ${c.company} вошёл в систему`)
        setLoginError('')
      } else {
        setLoginError('Неверный логин или пароль')
      }
    } else {
      setLoginError('Неверный логин или пароль')
    }
  }

  const handleRecovery = async () => {
    const upperContract = recoveryContract.trim().toUpperCase()
    if (clients[upperContract]) {
      const activeBot = bots.find(b => b.active)
      if (activeBot) {
        const newPassword = 'P' + Math.random().toString(36).slice(-6).toUpperCase()
        const message = `🔐 *Восстановление пароля*\n\n*Компания:* ${clients[upperContract].company}\n*Договор:* ${upperContract}\n*Новый пароль:* ${newPassword}`
        await sendToTelegram(activeBot, message, threads.history)
        alert('Запрос отправлен!')
      }
    } else { alert('Договор не найден') }
  }

  const handleNewUserSubmit = async (e) => {
    e.preventDefault()
    if (client.company && client.contact && client.phone) {
      const activeBot = bots.find(b => b.active)
      if (activeBot) {
        const message = `📋 *Новая заявка!*\n\n*Компания:* ${client.company}\n*Контакт:* ${client.contact}\n*Телефон:* ${client.phone}`
        await sendToTelegram(activeBot, message, threads.newUser)
      }
      addLog('Новая заявка', `Компания ${client.company} оставила заявку`)
      alert('Заявка отправлена!')
      navigate('login')
    }
  }

  const handleSendComment = async () => {
    if (comment.trim() && currentClient) {
      const activeBot = bots.find(b => b.active)
      if (activeBot) {
        const message = `💬 *${currentClient.company}:*\n\n${comment}`
        await sendToTelegram(activeBot, message, threads.history)
      }
      addLog('Сообщение менеджеру', `Клиент ${currentClient.company} отправил сообщение`)
      alert('Отправлено!')
      setComment('')
      setCommentSent(true)
    }
  }

  const createOrder = async () => {
    const selectedMenu = menus.find(m => m.id === selectedFoodTypes[0]) || menus[0]
    const newOrder = {
      id: Date.now(),
      clientId: currentClient.id,
      company: currentClient.company,
      address: currentClient.address,
      date: new Date().toISOString().split('T')[0],
      day: selectedDay,
      meals: { breakfast: orderQuantity.breakfast || 0, lunch: orderQuantity.lunch || 0, dinner: orderQuantity.dinner || 0 },
      menuId: selectedMenu?.id,
      menuName: selectedMenu?.name,
      status: 'pending',
      total: ((orderQuantity.breakfast || 0) * (selectedMenu?.price.breakfast || 280)) + ((orderQuantity.lunch || 0) * (selectedMenu?.price.lunch || 420)) + ((orderQuantity.dinner || 0) * (selectedMenu?.price.dinner || 380)),
      productionId: null,
      createdAt: new Date().toISOString()
    }

    setOrders(prev => [...prev, newOrder])
    addLog('Создан заказ', `Клиент ${currentClient.company} создал заказ на ${DAYS_RU[newOrder.day]}`)

    const activeBot = bots.find(b => b.active)
    if (activeBot) {
      const message = `📥 *Новый заказ!*\n\n*Компания:* ${currentClient.company}\n*Адрес:* ${currentClient.address}\n*Меню:* ${selectedMenu?.name}\n*Дата:* ${DAYS_RU[newOrder.day]}\n\n🥐 Завтрак: ${newOrder.meals.breakfast}\n🍱 Обед: ${newOrder.meals.lunch}\n🍽️ Ужин: ${newOrder.meals.dinner}\n\n💰 *Стоимость:* ${newOrder.total.toLocaleString()}₽`
      await sendToTelegram(activeBot, message, threads.waiting)
    }

    alert('Заказ отправлен на согласование!')
  }

  const updateOrderStatus = async (orderId, newStatus, productionId = null) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, productionId: productionId || o.productionId } : o))
    const order = orders.find(o => o.id === orderId)
    addLog('Изменение статуса заказа', `Заказ #${orderId} изменён на "${ORDER_STATUS[newStatus]}"`)
    
    const activeBot = bots.find(b => b.active)
    if (activeBot) {
      const statusMsg = `📦 *Статус заказа изменён*\n\n*Заказ:* #${orderId}\n*Компания:* ${order?.company}\n*Статус:* ${ORDER_STATUS[newStatus]}\n📅 ${new Date().toLocaleString('ru-RU')}`
      await sendToTelegram(activeBot, statusMsg, threads.orders)
    }
  }

  const saveClientEdit = async () => {
    if (editingClient) {
      setClients(prev => ({ ...prev, [editingClient.id]: editingClient }))
      addLog('Редактирование клиента', `Клиент ${editingClient.company} отредактирован`)
      setEditingClient(null)
      alert('Сохранено!')
    }
  }

  const addNewClient = () => {
    const newId = 'NEW-' + Date.now().toString().slice(-4).toUpperCase()
    const newClient = { id: newId, company: '', inn: '', contact: '', phone: '', email: '', address: '', companyType: 'office', contractDate: new Date().toISOString().split('T')[0], paymentMethod: 'card', paymentPeriod: 'monthly', active: true, featured: false, discount: 0, staff: { regular: 0, halal: 0, pp: 0, director: 0 }, meals: ['lunch'], deliveryTime: { lunch: '12:00-13:00' }, managerId: 1, adminComment: '', menuIds: [1], freeLogins: 3, usedLogins: 0, userLogins: [] }
    setEditingClient(newClient)
  }

  const deleteClient = async (clientId) => {
    if (confirm('Удалить клиента?')) {
      const c = clients[clientId]
      setClients(prev => { const updated = { ...prev }; delete updated[clientId]; return updated })
      addLog('Удаление клиента', `Клиент ${c.company} удалён`)
    }
  }

  const addNewUser = () => {
    const newId = 'USER' + Date.now().toString().slice(-4).toUpperCase()
    setUsers(prev => ({ ...prev, [newId]: { id: newId, password: 'pass123', role: 'operator', name: 'Новый оператор', lastLogin: null } }))
    addLog('Создан пользователь', `Создан оператор ${newId}`)
    alert(`Создан пользователь: ${newId}, пароль: pass123`)
  }

  const saveUserEdit = (userId, field, value) => {
    setUsers(prev => ({ ...prev, [userId]: { ...prev[userId], [field]: value } }))
  }

  const deleteUser = (userId) => {
    if (confirm('Удалить пользователя?')) {
      setUsers(prev => { const updated = { ...prev }; delete updated[userId]; return updated })
      addLog('Удалён пользователь', `Пользователь ${userId} удалён`)
    }
  }

  const addNewManager = () => {
    const newId = Date.now()
    const login = 'MGR' + newId.toString().slice(-3)
    setManagers(prev => [...prev, { id: newId, name: 'Новый менеджер', phone: '', telegram: '', login, password: 'pass123' }])
    addLog('Добавлен менеджер', `Добавлен новый менеджер ${login}`)
  }

  const saveManager = (managerId, field, value) => {
    setManagers(prev => prev.map(m => m.id === managerId ? { ...m, [field]: value } : m))
  }

  const deleteManager = (managerId) => {
    if (confirm('Удалить менеджера?')) {
      setManagers(prev => prev.filter(m => m.id !== managerId))
      addLog('Удалён менеджер', `Менеджер ID ${managerId} удалён`)
    }
  }

  const addNewMenu = () => {
    const newId = Date.now()
    setMenus(prev => [...prev, { id: newId, name: 'Новое меню', description: '', price: { breakfast: 280, lunch: 420, dinner: 380 }, active: true, approved: false }])
    addLog('Добавлено меню', `Добавлено новое меню ID ${newId}`)
  }

  const saveMenu = (menuId, field, value) => {
    setMenus(prev => prev.map(m => m.id === menuId ? { ...m, [field]: value } : m))
  }

  const toggleMenuApproved = (menuId) => {
    setMenus(prev => prev.map(m => m.id === menuId ? { ...m, approved: !m.approved } : m))
    addLog('Изменено меню', `Меню ID ${menuId} ${menus.find(m => m.id === menuId)?.approved ? 'откл' : 'одобр'}ено`)
  }

  const deleteMenu = (menuId) => {
    if (confirm('Удалить меню?')) {
      setMenus(prev => prev.filter(m => m.id !== menuId))
      addLog('Удалено меню', `Меню ID ${menuId} удалено`)
    }
  }

  const addNewProduction = () => {
    const newId = Date.now()
    setProductions(prev => [...prev, { id: newId, name: 'Новое производство', type: 'partner', address: '', contact: '', active: true }])
    addLog('Добавлено производство', `Добавлено производство ID ${newId}`)
  }

  const saveProduction = (prodId, field, value) => {
    setProductions(prev => prev.map(p => p.id === prodId ? { ...p, [field]: value } : p))
  }

  const deleteProduction = (prodId) => {
    if (confirm('Удалить производство?')) {
      setProductions(prev => prev.filter(p => p.id !== prodId))
      addLog('Удалено производство', `Производство ID ${prodId} удалено`)
    }
  }

  const addNewBot = () => {
    const newBot = { id: 'bot' + Date.now(), name: 'Новый бот', token: '', chatId: '', active: bots.length === 0 }
    setEditingBot(newBot)
  }

  const saveBot = () => {
    if (editingBot) {
      setBots(prev => { const existing = prev.find(b => b.id === editingBot.id); return existing ? prev.map(b => b.id === editingBot.id ? editingBot : b) : [...prev, editingBot] })
      setEditingBot(null)
      addLog('Настройка бота', `Бот ${editingBot.name} сохранён`)
      alert('Бот сохранён!')
    }
  }

  const deleteBot = (botId) => {
    if (confirm('Удалить бота?')) {
      setBots(prev => prev.filter(b => b.id !== botId))
    }
  }

  const toggleBotActive = (botId) => {
    setBots(prev => prev.map(b => ({ ...b, active: b.id === botId ? !b.active : false })))
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

  const testTelegram = async () => {
    const activeBot = bots.find(b => b.active)
    if (!activeBot) { alert('Нет активного бота!'); return }
    const results = []
    for (const t of [{ id: threads.waiting, name: 'Ожидание' }, { id: threads.newUser, name: 'Новый' }, { id: threads.history, name: 'История' }, { id: threads.orders, name: 'Заказы' }]) {
      const ok = await sendToTelegram(activeBot, `🧪 Тест ${t.name}`, t.id)
      results.push(`${t.name}: ${ok ? '✅' : '❌'}`)
    }
    alert('Результаты:\n' + results.join('\n'))
  }

  const getManager = (id) => managers.find(m => m.id === id)
  const getMenu = (id) => menus.find(m => m.id === id)
  const getProduction = (id) => productions.find(p => p.id === id)

  const getFinanceStats = () => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const todayOrders = orders.filter(o => o.date === today && o.status !== 'cancelled')
    const weekOrders = orders.filter(o => o.date >= weekAgo && o.status !== 'cancelled')
    const monthOrders = orders.filter(o => o.date >= monthAgo && o.status !== 'cancelled')
    const yearOrders = orders.filter(o => o.date >= yearAgo && o.status !== 'cancelled')

    return {
      today: { count: todayOrders.length, sum: todayOrders.reduce((s, o) => s + o.total, 0) },
      week: { count: weekOrders.length, sum: weekOrders.reduce((s, o) => s + o.total, 0) },
      month: { count: monthOrders.length, sum: monthOrders.reduce((s, o) => s + o.total, 0) },
      year: { count: yearOrders.length, sum: yearOrders.reduce((s, o) => s + o.total, 0) }
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
              <button onClick={handleRecovery} style={buttonPrimaryStyle}>🔐 Восстановить пароль</button>
              <button onClick={() => { setRecoveryMode(false); setRecoveryContract('') }} style={{ ...buttonPrimaryStyle, background: '#fff', color: '#666', border: '1px solid #ccc', marginTop: 12 }}>← Назад</button>
            </>
          ) : (
            <form onSubmit={handleLogin}>
              <label style={labelStyle}>Логин</label>
              <input type="text" placeholder="Логин (например: 0901SmolAdmin)" value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} style={inputStyle} />
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

  // === НОВЫЙ ПОЛЬЗОВАТЕЛЬ ===
  if (view === 'new-user') {
    return (
      <div style={{ padding: 16, maxWidth: 500, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
        <button onClick={() => navigate('login')} style={{ background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer', marginBottom: 12 }}>← Назад</button>
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>📋 Заявка</h2>
          <form onSubmit={handleNewUserSubmit}>
            <label style={labelStyle}>Компания *</label>
            <input type="text" placeholder="ООО Ромашка" value={client.company} onChange={(e) => setClient({...client, company: e.target.value})} style={inputStyle} required />
            <label style={labelStyle}>Контакт *</label>
            <input type="text" placeholder="Иван Иванов" value={client.contact} onChange={(e) => setClient({...client, contact: e.target.value})} style={inputStyle} required />
            <label style={labelStyle}>Телефон *</label>
            <input type="tel" placeholder="+7 (999) 123-45-67" value={client.phone} onChange={(e) => setClient({...client, phone: e.target.value})} style={inputStyle} required />
            <label style={labelStyle}>Тип:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {COMPANY_TYPES.map(type => (
                <button key={type.id} type="button" onClick={() => setCompanyType(type.id)} style={{ padding: '12px 16px', border: companyType === type.id ? '2px solid #1976D2' : '2px solid #e0e0e0', borderRadius: 8, background: companyType === type.id ? '#E3F2FD' : '#fafafa', cursor: 'pointer', textAlign: 'left' }}>
                  <b>{type.emoji} {type.name}</b>
                </button>
              ))}
            </div>
            <button type="submit" style={buttonPrimaryStyle}>📤 Отправить</button>
          </form>
        </div>
      </div>
    )
  }

  // === АДМИН / ОПЕРАТОР / ПРОИЗВОДСТВО ===
  if (view === 'admin') {
    const adminTabs = [
      { id: 'clients', name: '🏢 Клиенты' },
      { id: 'orders', name: '📋 Заказы' },
      { id: 'waiting', name: '📥 Ожидание' },
      { id: 'production', name: '🏭 Производство' },
      { id: 'menu', name: '🍽️ Меню' },
      { id: 'finances', name: '💰 Финансы' },
      { id: 'managers', name: '👩‍💼 Менеджеры' },
      { id: 'productions', name: '🏭 Производства' },
      { id: 'users', name: '👥 Пользователи' },
      { id: 'logins', name: '🔑 Входы' },
      { id: 'logs', name: '📜 Логи' },
      { id: 'telegram', name: '📱 Telegram' },
      { id: 'database', name: '📊 База данных' }
    ]

    return (
      <div style={{ padding: 16, maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, margin: 0, color: '#1976D2' }}>⚙️ {isAdmin ? 'Админ-панель' : isOperator ? 'Оператор' : 'Производство'}</h1>
          <button onClick={() => { setCurrentUser(null); navigate('login') }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Выход</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
          {adminTabs.filter(t => isAdmin || ['clients', 'orders', 'waiting', 'production', 'menu'].includes(t.id)).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '10px 14px', border: 'none', borderRadius: 8, background: tab === t.id ? '#1976D2' : '#fff', color: tab === t.id ? '#fff' : '#333', cursor: 'pointer', fontSize: 14, fontWeight: '600' }}>{t.name}</button>
          ))}
        </div>

        {/* === КЛИЕНТЫ === */}
        {tab === 'clients' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Всего: {Object.keys(clients).length} клиентов</span>
              {(isAdmin || isOperator) && <button onClick={addNewClient} style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>+ Добавить клиента</button>}
            </div>
            {Object.values(clients).map(c => {
              const mgr = getManager(c.managerId)
              return (
                <div key={c.id} style={{ ...sectionStyle, borderLeft: c.featured ? '4px solid #FF9800' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h3 style={{ margin: 0, fontSize: 18 }}>{c.company}</h3>
                        {c.featured && <span style={{ background: '#FF9800', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>VIP</span>}
                        {!c.active && <span style={{ background: '#f44336', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>ОТКЛ</span>}
                      </div>
                      <div style={{ fontSize: 13, color: '#666' }}>{c.id} • {c.contact} • {c.phone}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(isAdmin || isOperator) && <button onClick={() => setEditingClient({...c})} style={{ padding: '8px 16px', background: '#1976D2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Изменить</button>}
                      {isAdmin && <button onClick={() => deleteClient(c.id)} style={{ padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>✕</button>}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: 13, marginBottom: 8 }}>
                    <div>📍 <b>{c.address || 'Не указан'}</b></div>
                    <div>👤 Менеджер: <b>{mgr?.name || 'Не назначен'}</b></div>
                    <div>👥 Сотрудников: <b>{c.staff?.regular || 0}</b></div>
                    <div>💰 Скидка: <b>{c.discount}%</b></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* === ЗАКАЗЫ === */}
        {tab === 'orders' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>📋 Все заказы ({orders.length})</h3>
            {orders.length === 0 ? <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>Нет заказов</div> : orders.map(order => (
              <div key={order.id} style={{ padding: 12, background: '#fafafa', borderRadius: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{order.company}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>📍 {order.address}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{DAYS_RU[order.day]} • {order.date} • {order.menuName}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>🥐 {order.meals.breakfast} • 🍱 {order.meals.lunch} • 🍽️ {order.meals.dinner}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>{order.total.toLocaleString()}₽</div>
                    <span style={{ padding: '4px 12px', background: order.status === 'pending' ? '#FFF3E0' : order.status === 'confirmed' ? '#E3F2FD' : order.status === 'production' ? '#F3E5F5' : order.status === 'ready' ? '#E8F5E9' : '#ffebee', borderRadius: 16, fontSize: 12 }}>{ORDER_STATUS[order.status]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === ОЖИДАНИЕ === */}
        {tab === 'waiting' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>📥 Ожидают согласования ({orders.filter(o => o.status === 'pending').length})</h3>
            {orders.filter(o => o.status === 'pending').map(order => (
              <div key={order.id} style={{ padding: 12, background: '#FFF3E0', borderRadius: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{order.company}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>📍 {order.address}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{DAYS_RU[order.day]}, {order.date} • {order.menuName}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>🥐 {order.meals.breakfast} • 🍱 {order.meals.lunch} • 🍽️ {order.meals.dinner}</div>
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
            {orders.filter(o => o.status === 'pending').length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>Нет заказов на согласование</div>}
          </div>
        )}

        {/* === ПРОИЗВОДСТВО === */}
        {tab === 'production' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>🏭 Готовятся к выдаче ({orders.filter(o => o.status === 'confirmed' || o.status === 'production').length})</h3>
            {orders.filter(o => o.status === 'confirmed' || o.status === 'production').map(order => (
              <div key={order.id} style={{ padding: 12, background: '#F3E5F5', borderRadius: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{order.company}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>📍 {order.address}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{order.date} • {order.menuName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>{order.total.toLocaleString()}₽</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => updateOrderStatus(order.id, 'production')} style={{ flex: 1, padding: '8px', background: '#9C27B0', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>🏭 На производство</button>
                  <button onClick={() => updateOrderStatus(order.id, 'ready')} style={{ flex: 1, padding: '8px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>✅ Готов</button>
                </div>
              </div>
            ))}
            {orders.filter(o => o.status === 'confirmed' || o.status === 'production').length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>Нет заказов в производстве</div>}
          </div>
        )}

        {/* === МЕНЮ === */}
        {tab === 'menu' && isAdmin && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Всего меню: {menus.length}</span>
              <button onClick={addNewMenu} style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>+ Добавить меню</button>
            </div>
            {menus.map(menu => (
              <div key={menu.id} style={{ ...sectionStyle, borderLeft: menu.approved ? '4px solid #4CAF50' : '4px solid #FF9800' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18 }}>🍽️ {menu.name}</h3>
                    <div style={{ fontSize: 13, color: '#666' }}>{menu.description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => toggleMenuApproved(menu.id)} style={{ padding: '8px 16px', background: menu.approved ? '#FF9800' : '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>{menu.approved ? 'Отключить' : 'Одобрить'}</button>
                    <button onClick={() => deleteMenu(menu.id)} style={{ padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>✕</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 13 }}>
                  <div>🥐 Завтрак: <b>{menu.price.breakfast}₽</b></div>
                  <div>🍱 Обед: <b>{menu.price.lunch}₽</b></div>
                  <div>🍽️ Ужин: <b>{menu.price.dinner}₽</b></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === ФИНАНСЫ === */}
        {tab === 'finances' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>💰 Финансы</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 16, background: '#E3F2FD', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1976D2' }}>{finance.today.count}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Заказов сегодня</div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1976D2', marginTop: 8 }}>{finance.today.sum.toLocaleString()}₽</div>
              </div>
              <div style={{ padding: 16, background: '#E8F5E9', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#4CAF50' }}>{finance.week.count}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Заказов за неделю</div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#4CAF50', marginTop: 8 }}>{finance.week.sum.toLocaleString()}₽</div>
              </div>
              <div style={{ padding: 16, background: '#FFF3E0', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#FF9800' }}>{finance.month.count}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Заказов за месяц</div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#FF9800', marginTop: 8 }}>{finance.month.sum.toLocaleString()}₽</div>
              </div>
              <div style={{ padding: 16, background: '#F3E5F5', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#9C27B0' }}>{finance.year.count}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Заказов за год</div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#9C27B0', marginTop: 8 }}>{finance.year.sum.toLocaleString()}₽</div>
              </div>
            </div>
          </div>
        )}

        {/* === МЕНЕДЖЕРЫ === */}
        {tab === 'managers' && isAdmin && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Всего менеджеров: {managers.length}</span>
              <button onClick={addNewManager} style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>+ Добавить менеджера</button>
            </div>
            {managers.map(mgr => (
              <div key={mgr.id} style={{ ...sectionStyle, borderLeft: '4px solid #9C27B0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div><h3 style={{ margin: 0, fontSize: 18 }}>👩‍💼 {mgr.name}</h3></div>
                  <button onClick={() => deleteManager(mgr.id)} style={{ padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>✕</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><label style={labelStyle}>Имя:</label><input type="text" value={mgr.name} onChange={(e) => saveManager(mgr.id, 'name', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Телефон:</label><input type="text" value={mgr.phone} onChange={(e) => saveManager(mgr.id, 'phone', e.target.value)} style={inputStyle} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><label style={labelStyle}>Логин:</label><input type="text" value={mgr.login || ''} onChange={(e) => saveManager(mgr.id, 'login', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Пароль:</label><input type="text" value={mgr.password || ''} onChange={(e) => saveManager(mgr.id, 'password', e.target.value)} style={inputStyle} /></div>
                </div>
                <label style={labelStyle}>Telegram:</label>
                <input type="text" value={mgr.telegram} onChange={(e) => saveManager(mgr.id, 'telegram', e.target.value)} style={inputStyle} placeholder="@username" />
              </div>
            ))}
          </div>
        )}

        {/* === ПРОИЗВОДСТВА === */}
        {tab === 'productions' && isAdmin && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Всего производств: {productions.length}</span>
              <button onClick={addNewProduction} style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>+ Добавить производство</button>
            </div>
            {productions.map(prod => (
              <div key={prod.id} style={{ ...sectionStyle, borderLeft: prod.type === 'own' ? '4px solid #4CAF50' : '4px solid #FF9800' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18 }}>🏭 {prod.name}</h3>
                    <span style={{ background: prod.type === 'own' ? '#4CAF50' : '#FF9800', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>{prod.type === 'own' ? 'Своё' : 'Партнёр'}</span>
                  </div>
                  <button onClick={() => deleteProduction(prod.id)} style={{ padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>✕</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><label style={labelStyle}>Адрес:</label><input type="text" value={prod.address} onChange={(e) => saveProduction(prod.id, 'address', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Контакт:</label><input type="text" value={prod.contact} onChange={(e) => saveProduction(prod.id, 'contact', e.target.value)} style={inputStyle} /></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === ПОЛЬЗОВАТЕЛИ === */}
        {tab === 'users' && isAdmin && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Всего пользователей: {Object.keys(users).length}</span>
              <button onClick={addNewUser} style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>+ Добавить</button>
            </div>
            {Object.entries(users).map(([id, user]) => (
              <div key={id} style={{ ...sectionStyle, borderLeft: user.role === 'admin' ? '4px solid #9C27B0' : user.role === 'production' ? '4px solid #FF9800' : user.role === 'operator' ? '4px solid #2196F3' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 18 }}>👤 {user.name}</h3>
                      <span style={{ background: user.role === 'admin' ? '#9C27B0' : user.role === 'production' ? '#FF9800' : user.role === 'operator' ? '#2196F3' : '#4CAF50', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>{user.role === 'admin' ? 'АДМИН' : user.role === 'production' ? 'ПРОИЗВОДСТВО' : user.role === 'operator' ? 'ОПЕРАТОР' : 'КЛИЕНТ'}</span>
                    </div>
                    {user.lastLogin && <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>Последний вход: {new Date(user.lastLogin).toLocaleString('ru-RU')}</div>}
                  </div>
                  <button onClick={() => deleteUser(id)} style={{ padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>✕</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><label style={labelStyle}>Имя:</label><input type="text" value={user.name} onChange={(e) => saveUserEdit(id, 'name', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Пароль:</label><input type="text" value={user.password} onChange={(e) => saveUserEdit(id, 'password', e.target.value)} style={inputStyle} /></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === ИСТОРИЯ ВХОДОВ === */}
        {tab === 'logins' && isAdmin && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>🔑 История входов ({loginHistory.length})</h3>
            {loginHistory.length === 0 ? <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>Нет записей</div> : loginHistory.map(login => (
              <div key={login.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 12 }}>
                <span style={{ color: '#666' }}>{new Date(login.loginTime).toLocaleString('ru-RU')}</span> • <b>{login.userName}</b> ({login.role})
              </div>
            ))}
          </div>
        )}

        {/* === ЛОГИ === */}
        {tab === 'logs' && isAdmin && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>📜 Логи действий ({logs.length})</h3>
            {logs.length === 0 ? <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>Нет логов</div> : logs.map(log => (
              <div key={log.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 12 }}>
                <span style={{ color: '#666' }}>{new Date(log.date).toLocaleString('ru-RU')}</span> • <b>{log.user}</b> • {log.action}: {log.details}
              </div>
            ))}
          </div>
        )}

        {/* === TELEGRAM === */}
        {tab === 'telegram' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>📱 Настройки Telegram</h3>
            <div style={{ padding: 12, background: '#FFF3E0', borderRadius: 8, marginBottom: 12 }}>
              <div style={{ fontWeight: '600', marginBottom: 8 }}>📋 ID топиков</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>📥 Ожидание: <input type="number" value={threads.waiting} onChange={(e) => setThreads({...threads, waiting: parseInt(e.target.value)})} style={{ width: 60, padding: 4 }} /></div>
                <div>👤 Новый: <input type="number" value={threads.newUser} onChange={(e) => setThreads({...threads, newUser: parseInt(e.target.value)})} style={{ width: 60, padding: 4 }} /></div>
                <div>📜 История: <input type="number" value={threads.history} onChange={(e) => setThreads({...threads, history: parseInt(e.target.value)})} style={{ width: 60, padding: 4 }} /></div>
                <div>📋 Заказы: <input type="number" value={threads.orders} onChange={(e) => setThreads({...threads, orders: parseInt(e.target.value)})} style={{ width: 60, padding: 4 }} /></div>
              </div>
            </div>
            <button onClick={testTelegram} style={{ ...buttonPrimaryStyle, background: '#FF9800', marginBottom: 12 }}>🧪 Тест всех топиков</button>
            <div style={{ padding: 12, background: '#E8F5E9', borderRadius: 8, fontSize: 13 }}>💡 <b>Заказы приходят в Telegram!</b></div>
          </div>
        )}

        {/* === БАЗА ДАННЫХ === */}
        {tab === 'database' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>📊 База данных</h3>
            <div style={{ padding: 12, background: '#E3F2FD', borderRadius: 8, fontSize: 13 }}>
              📊 <a href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`} target="_blank" style={{ color: '#1976D2', fontSize: 16 }}>Открыть Google Таблицу</a>
            </div>
          </div>
        )}

        {/* === РЕДАКТИРОВАНИЕ КЛИЕНТА === */}
        {editingClient && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 16, maxWidth: 600, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>Редактирование: {editingClient.id}</h2>
              <label style={labelStyle}>Компания:</label><input type="text" value={editingClient.company} onChange={(e) => setEditingClient({...editingClient, company: e.target.value})} style={inputStyle} />
              <label style={labelStyle}>Контакт:</label><input type="text" value={editingClient.contact} onChange={(e) => setEditingClient({...editingClient, contact: e.target.value})} style={inputStyle} />
              <label style={labelStyle}>Телефон:</label><input type="text" value={editingClient.phone} onChange={(e) => setEditingClient({...editingClient, phone: e.target.value})} style={inputStyle} />
              <label style={labelStyle}>📍 Адрес доставки:</label><input type="text" value={editingClient.address || ''} onChange={(e) => setEditingClient({...editingClient, address: e.target.value})} style={inputStyle} />
              <label style={labelStyle}>👥 Количество сотрудников:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                <div><label style={{ fontSize: 11 }}>Обычное:</label><input type="number" value={editingClient.staff?.regular || 0} onChange={(e) => setEditingClient({...editingClient, staff: { ...editingClient.staff, regular: parseInt(e.target.value) || 0 }})} style={inputStyle} /></div>
                <div><label style={{ fontSize: 11 }}>Халяль:</label><input type="number" value={editingClient.staff?.halal || 0} onChange={(e) => setEditingClient({...editingClient, staff: { ...editingClient.staff, halal: parseInt(e.target.value) || 0 }})} style={inputStyle} /></div>
                <div><label style={{ fontSize: 11 }}>ПП:</label><input type="number" value={editingClient.staff?.pp || 0} onChange={(e) => setEditingClient({...editingClient, staff: { ...editingClient.staff, pp: parseInt(e.target.value) || 0 }})} style={inputStyle} /></div>
                <div><label style={{ fontSize: 11 }}>Директор:</label><input type="number" value={editingClient.staff?.director || 0} onChange={(e) => setEditingClient({...editingClient, staff: { ...editingClient.staff, director: parseInt(e.target.value) || 0 }})} style={inputStyle} /></div>
              </div>
              <label style={labelStyle}>⏰ Время доставки:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                <div><label style={{ fontSize: 11 }}>🥐 Завтрак:</label><input type="text" value={editingClient.deliveryTime?.breakfast || ''} onChange={(e) => setEditingClient({...editingClient, deliveryTime: { ...editingClient.deliveryTime, breakfast: e.target.value }})} style={inputStyle} placeholder="07:30-08:30" /></div>
                <div><label style={{ fontSize: 11 }}>🍱 Обед:</label><input type="text" value={editingClient.deliveryTime?.lunch || ''} onChange={(e) => setEditingClient({...editingClient, deliveryTime: { ...editingClient.deliveryTime, lunch: e.target.value }})} style={inputStyle} placeholder="12:00-13:00" /></div>
                <div><label style={{ fontSize: 11 }}>🍽️ Ужин:</label><input type="text" value={editingClient.deliveryTime?.dinner || ''} onChange={(e) => setEditingClient({...editingClient, deliveryTime: { ...editingClient.deliveryTime, dinner: e.target.value }})} style={inputStyle} placeholder="17:30-18:30" /></div>
              </div>
              <label style={labelStyle}>👩‍💼 Менеджер:</label>
              <select value={editingClient.managerId || 1} onChange={(e) => setEditingClient({...editingClient, managerId: parseInt(e.target.value)})} style={inputStyle}>
                {managers.map(mgr => <option key={mgr.id} value={mgr.id}>{mgr.name} ({mgr.phone})</option>)}
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={editingClient.active} onChange={(e) => setEditingClient({...editingClient, active: e.target.checked})} />Активен</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={editingClient.featured} onChange={(e) => setEditingClient({...editingClient, featured: e.target.checked})} />VIP</label>
              </div>
              <label style={labelStyle}>Скидка (%):</label><input type="number" value={editingClient.discount} onChange={(e) => setEditingClient({...editingClient, discount: parseInt(e.target.value) || 0})} style={inputStyle} />
              <label style={labelStyle}>Комментарий:</label><textarea value={editingClient.adminComment || ''} onChange={(e) => setEditingClient({...editingClient, adminComment: e.target.value})} style={{ ...inputStyle, height: 80 }} />
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={saveClientEdit} style={{ ...buttonPrimaryStyle, background: '#4CAF50' }}>💾 Сохранить</button>
                <button onClick={() => setEditingClient(null)} style={{ ...buttonPrimaryStyle, background: '#f44336' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}

        {editingBot && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 16, maxWidth: 600, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>Редактирование бота</h2>
              <label style={labelStyle}>Название:</label><input type="text" value={editingBot.name} onChange={(e) => setEditingBot({...editingBot, name: e.target.value})} style={inputStyle} />
              <label style={labelStyle}>Token бота:</label><input type="text" value={editingBot.token} onChange={(e) => setEditingBot({...editingBot, token: e.target.value})} style={inputStyle} placeholder="123456789:ABC..." />
              <label style={labelStyle}>Chat ID группы:</label><input type="text" value={editingBot.chatId} onChange={(e) => setEditingBot({...editingBot, chatId: e.target.value})} style={inputStyle} placeholder="-1001234567890" />
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={saveBot} style={{ ...buttonPrimaryStyle, background: '#4CAF50' }}>💾 Сохранить</button>
                <button onClick={() => setEditingBot(null)} style={{ ...buttonPrimaryStyle, background: '#f44336' }}>Отмена</button>
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

      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>{currentClient.company}</h2>
            <div style={{ fontSize: 13, color: '#666' }}>{currentClient.contact} • {currentClient.phone}</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>📍 {currentClient.address}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ background: '#4CAF50', color: '#fff', padding: '4px 10px', borderRadius: 16, fontSize: 11 }}>Договор</span>
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
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1976D2' }}>{orders.filter(o => o.clientId === currentClient.id && o.status === 'pending').length}</div>
                <div style={{ fontSize: 12, color: '#666' }}>ожидают</div>
              </div>
              <div style={{ padding: 14, background: '#E8F5E9', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4CAF50' }}>{orders.filter(o => o.clientId === currentClient.id).reduce((s, o) => s + o.total, 0).toLocaleString()}₽</div>
                <div style={{ fontSize: 12, color: '#666' }}>всего</div>
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
            <button key={menu.id} onClick={() => setSelectedFoodTypes([menu.id])} style={{ width: '100%', padding: '12px', marginBottom: 8, border: selectedFoodTypes.includes(menu.id) ? '2px solid #1976D2' : '2px solid #e0e0e0', borderRadius: 8, background: selectedFoodTypes.includes(menu.id) ? '#E3F2FD' : '#fff', cursor: 'pointer', textAlign: 'left' }}>
              <b>{menu.name}</b> - <span style={{ color: '#4CAF50' }}>{menu.price.lunch}₽</span>/обед
            </button>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>📋 Сделать заказ</h3>
          <label style={labelStyle}>День недели:</label>
          <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} style={{...inputStyle, marginBottom: 12}}>
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(d => <option key={d} value={d}>{DAYS_RU[d]}</option>)}
          </select>

          <label style={labelStyle}>Количество человек:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label style={{ fontSize: 11 }}>🥐 Завтрак:</label><input type="number" value={orderQuantity.breakfast || 0} onChange={(e) => setOrderQuantity({...orderQuantity, breakfast: parseInt(e.target.value) || 0})} style={inputStyle} /></div>
            <div><label style={{ fontSize: 11 }}>🍱 Обед:</label><input type="number" value={orderQuantity.lunch || 0} onChange={(e) => setOrderQuantity({...orderQuantity, lunch: parseInt(e.target.value) || 0})} style={inputStyle} /></div>
            <div><label style={{ fontSize: 11 }}>🍽️ Ужин:</label><input type="number" value={orderQuantity.dinner || 0} onChange={(e) => setOrderQuantity({...orderQuantity, dinner: parseInt(e.target.value) || 0})} style={inputStyle} /></div>
          </div>

          <button onClick={createOrder} disabled={selectedFoodTypes.length === 0} style={{ ...buttonPrimaryStyle, background: selectedFoodTypes.length > 0 ? '#4CAF50' : '#ccc' }}>📤 Отправить на согласование</button>
        </div>
      )}

      {tab === 'settings' && (
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0, fontSize: 14 }}>💬 Сообщение менеджеру</h3>
          {commentSent ? (
            <div style={{ padding: 12, background: '#E8F5E9', borderRadius: 8, textAlign: 'center' }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <p style={{ margin: '4px 0 0', fontSize: 13 }}>Отправлено!</p>
              <button onClick={() => setCommentSent(false)} style={{ marginTop: 8, background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer', fontSize: 13 }}>Ещё</button>
            </div>
          ) : (
            <>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Сообщение менеджеру..." style={{ ...inputStyle, height: 80 }} />
              <button onClick={handleSendComment} disabled={!comment.trim()} style={{ ...buttonPrimaryStyle, background: comment.trim() ? '#4CAF50' : '#ccc' }}>📤 Отправить</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default App