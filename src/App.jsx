import { useState, useEffect } from 'react'

const COMPANY_TYPES = [
  { id: 'office', name: 'Офис', emoji: '🏢' },
  { id: 'plant', name: 'Производство', emoji: '🏭' },
  { id: 'quarter', name: 'Квартал', emoji: '📅' }
]

// ID Google таблицы
const SPREADSHEET_ID = '1VRSHLi1eu7k5cT6lAYWvXbIToTpcMj1rx2saiWwENp4'

// Токен бота и ID группы
const BOT_TOKEN = '6706048508:AAF-8INmBKwP1x7DA-_ET8D282c5pp0Rn2Y'
const GROUP_CHAT_ID = '-1002583331823'

// ID топиков (ЧИСЛА!)
const THREADS = {
  waiting: 360,      // Ожидание
  newUser: 361,      // Новый пользователь
  history: 362,       // История
  orders: 359         // Заявки
}

const EVENT_TYPES = [
  { id: 'new_order', name: '📥 Новый заказ', emoji: '📋' },
  { id: 'new_user', name: '👤 Новая заявка', emoji: '👤' },
  { id: 'client_comment', name: '💬 Комментарий клиента', emoji: '💬' },
  { id: 'admin_edit', name: '📝 Изменение в админке', emoji: '📝' },
  { id: 'order_confirmed', name: '✅ Подтверждён заказ', emoji: '✅' },
  { id: 'order_cancelled', name: '❌ Отменён заказ', emoji: '❌' }
]

const PRICES = {
  regular: { breakfast: 280, lunch: 420, dinner: 380 },
  halal: { breakfast: 320, lunch: 480, dinner: 440 },
  pp: { breakfast: 350, lunch: 520, dinner: 460 },
  director: { breakfast: 420, lunch: 620, dinner: 560 }
}

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

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Наличные', emoji: '💵' },
  { id: 'card', name: 'Безналичный', emoji: '💳' },
  { id: 'account', name: 'Счёт', emoji: '🏦' }
]

const PAYMENT_PERIODS = [
  { id: 'daily', name: 'День в день' },
  { id: 'weekly', name: 'Раз в неделю' },
  { id: 'monthly', name: 'Раз в месяц' }
]

const DAYS_RU = {
  monday: 'Понедельник', tuesday: 'Вторник', wednesday: 'Среда',
  thursday: 'Четверг', friday: 'Пятница', saturday: 'Суббота', sunday: 'Воскресенье'
}

const inputStyle = {
  width: '100%', padding: '12px', fontSize: 15, borderRadius: 8,
  border: '2px solid #e0e0e0', marginBottom: 12, boxSizing: 'border-box', background: '#fff'
}

const labelStyle = {
  fontWeight: '600', display: 'block', marginBottom: 6, fontSize: 13, color: '#333'
}

const sectionStyle = {
  background: '#fff', padding: 16, borderRadius: 12, marginBottom: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
}

const buttonPrimaryStyle = {
  width: '100%', background: '#1976D2', color: '#fff', border: 'none',
  padding: '14px', borderRadius: 8, fontSize: 15, fontWeight: '600', cursor: 'pointer'
}

// === TELEGRAM ===
const sendToTelegram = async (message, threadId) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: GROUP_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        message_thread_id: Number(threadId)  // ЧИСЛО!
      })
    })
    const data = await response.json()
    console.log('Telegram response:', data)
    return data.ok
  } catch (err) {
    console.log('Telegram error:', err)
    return false
  }
}

const sendByEvent = async (eventType, message) => {
  const threadMap = {
    new_order: THREADS.waiting,
    new_user: THREADS.newUser,
    client_comment: THREADS.history,
    admin_edit: THREADS.history,
    order_confirmed: THREADS.orders,
    order_cancelled: THREADS.orders
  }
  const threadId = threadMap[eventType]
  console.log('Sending to thread:', threadId, 'event:', eventType)
  return await sendToTelegram(message, threadId)
}

// === LOCAL STORAGE ===
const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem('food_' + key)
    return data ? JSON.parse(data) : null
  } catch (e) { return null }
}

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem('food_' + key, JSON.stringify(data))
    return true
  } catch (e) { return false }
}

// Дефолтные клиенты
const DEFAULT_CLIENTS = {
  'TEST-001': {
    id: 'TEST-001', company: 'ООО ТехноСтрой', inn: '7812345678', contact: 'Петров Сергей',
    phone: '+7 (999) 123-45-67', email: 'petrov@tehno.ru', address: 'г. Санкт-Петербург, ул. Новая, д. 10',
    companyType: 'office', contractDate: '2025-01-15', paymentMethod: 'card', paymentPeriod: 'monthly',
    active: true, featured: true, discount: 10,
    staff: { regular: 45, halal: 12, pp: 8, director: 3 },
    meals: ['breakfast', 'lunch', 'dinner'],
    deliveryTime: { breakfast: '07:30-08:30', lunch: '12:00-13:00', dinner: '17:30-18:30' },
    manager: { name: 'Анна', phone: '+7 (999) 000-11-22' }, adminComment: ''
  },
  'TEST-002': {
    id: 'TEST-002', company: 'ИП Сидоров', inn: '7823456789', contact: 'Сидоров Алексей',
    phone: '+7 (999) 987-65-43', address: 'г. Санкт-Петербург, пр. Ленина, д. 5',
    companyType: 'plant', contractDate: '2025-02-01', paymentMethod: 'cash', paymentPeriod: 'daily',
    active: true, featured: false, discount: 5,
    staff: { regular: 20, halal: 5, pp: 0, director: 1 },
    meals: ['lunch', 'dinner'],
    deliveryTime: { lunch: '12:00-13:00', dinner: '17:30-18:30' },
    manager: { name: 'Анна', phone: '+7 (999) 000-11-22' }, adminComment: 'VIP клиент'
  },
  'TEST-003': {
    id: 'TEST-003', company: 'АО Невский завод', inn: '7813000111', contact: 'Смирнова Екатерина',
    phone: '+7 (999) 111-22-33', email: 'smirnova@nevskiy.ru', address: 'г. Санкт-Петербург, ул. Металлистов, д. 7',
    companyType: 'office', contractDate: '2024-11-20', paymentMethod: 'account', paymentPeriod: 'monthly',
    active: true, featured: false, discount: 7,
    staff: { regular: 60, halal: 0, pp: 15, director: 10 },
    meals: ['breakfast', 'lunch', 'dinner'],
    deliveryTime: { breakfast: '07:30-08:30', lunch: '12:00-13:00', dinner: '17:30-18:30' },
    manager: { name: 'Мария', phone: '+7 (999) 000-33-44' }, adminComment: 'Требует доставку к 12:00'
  },
  'TEST-004': {
    id: 'TEST-004', company: 'ООО Северный берег', inn: '7814567890', contact: 'Козлов Дмитрий',
    phone: '+7 (999) 222-33-44', email: 'kozlov@severbereg.ru', address: 'г. Санкт-Петербург, наб. реки Фонтанки, д. 28',
    companyType: 'quarter', contractDate: '2024-10-01', paymentMethod: 'card', paymentPeriod: 'monthly',
    active: true, featured: true, discount: 15,
    staff: { regular: 120, halal: 30, pp: 20, director: 10 },
    meals: ['breakfast', 'lunch', 'dinner'],
    deliveryTime: { breakfast: '07:30-08:30', lunch: '12:00-13:00', dinner: '17:30-18:30' },
    manager: { name: 'Анна', phone: '+7 (999) 000-11-22' }, adminComment: 'VIP - приоритетная доставка'
  },
  'DEMO': {
    id: 'DEMO', company: 'Демо клиент', inn: '0000000000', contact: 'Тестовый пользователь',
    phone: '+7 (999) 000-00-00', email: 'demo@test.ru', address: 'Тестовый адрес',
    companyType: 'office', contractDate: '2025-01-01', paymentMethod: 'cash', paymentPeriod: 'daily',
    active: true, featured: false, discount: 0,
    staff: { regular: 10, halal: 0, pp: 0, director: 5 },
    meals: ['lunch'],
    deliveryTime: { lunch: '12:00-13:00' },
    manager: { name: 'Анна', phone: '+7 (999) 000-11-22' }, adminComment: 'Тестовый аккаунт'
  }
}

function App() {
  const [view, setView] = useState('login')
  const [tab, setTab] = useState('clients')
  const [contractNumber, setContractNumber] = useState('')
  const [loginError, setLoginError] = useState('')
  const [currentClient, setCurrentClient] = useState(null)
  const [clients, setClients] = useState({})
  const [editingClient, setEditingClient] = useState(null)
  const [companyType, setCompanyType] = useState('office')
  const [selectedMeals, setSelectedMeals] = useState([])
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([])
  const [selectedDay, setSelectedDay] = useState('monday')
  const [comment, setComment] = useState('')
  const [commentSent, setCommentSent] = useState(false)
  const [client, setClient] = useState({
    company: '', inn: '', contact: '', phone: '', email: '', address: '',
    paymentMethod: 'card', paymentPeriod: 'monthly'
  })

  // Заказы
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Загрузка данных
  useEffect(() => {
    const loadData = () => {
      const savedClients = loadFromStorage('clients')
      setClients(savedClients || DEFAULT_CLIENTS)
      
      const savedOrders = loadFromStorage('orders')
      setOrders(savedOrders || [])
      
      setLoading(false)
    }
    loadData()
  }, [])

  // Сохранение при изменении
  useEffect(() => {
    if (!loading && Object.keys(clients).length > 0) {
      saveToStorage('clients', clients)
    }
  }, [clients, loading])

  useEffect(() => {
    if (!loading && orders.length > 0) {
      saveToStorage('orders', orders)
    }
  }, [orders, loading])

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash === 'admin') setView('admin')
    else if (hash === 'new') setView('new-user')
  }, [])

  const navigate = (page) => {
    window.location.hash = page
    setView(page === 'admin' ? 'admin' : page === 'new' ? 'new-user' : 'login')
  }

  const toggleMeal = (mealId) => {
    setSelectedMeals(prev => prev.includes(mealId) ? prev.filter(id => id !== mealId) : [...prev, mealId])
  }

  const toggleFoodType = (typeId) => {
    setSelectedFoodTypes(prev => prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId])
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const normalized = contractNumber.toUpperCase().trim()
    if (normalized === 'ADMIN') {
      navigate('admin')
      return
    }
    if (clients[normalized]) {
      const c = clients[normalized]
      if (!c.active) {
        setLoginError('Договор приостановлен')
        return
      }
      setCurrentClient(c)
      setSelectedMeals(c.meals || ['lunch'])
      setSelectedFoodTypes(['regular'])
      setLoginError('')
    } else {
      setLoginError('Договор не найден')
    }
  }

  const handleNewUserSubmit = async (e) => {
    e.preventDefault()
    if (client.company && client.contact && client.phone) {
      const message = `📋 *Новая заявка!*\n\n*Компания:* ${client.company}\n*Контакт:* ${client.contact}\n*Телефон:* ${client.phone}\n*Тип:* ${COMPANY_TYPES.find(t => t.id === companyType)?.name || companyType}`
      await sendByEvent('new_user', message)
      alert('Заявка отправлена!')
      navigate('login')
    }
  }

  const handleSendComment = async () => {
    if (comment.trim() && currentClient) {
      const message = `💬 *${currentClient.company}:*\n\n${comment}\n\n📅 ${new Date().toLocaleString('ru-RU')}`
      await sendByEvent('client_comment', message)
      alert('Отправлено!')
      setComment('')
      setCommentSent(true)
    }
  }

  const saveClientEdit = async () => {
    if (editingClient) {
      const oldClient = clients[editingClient.id]
      const changes = []

      if (oldClient.discount !== editingClient.discount) changes.push(`скидка: ${oldClient.discount}% → ${editingClient.discount}%`)
      if (oldClient.active !== editingClient.active) changes.push(`активность: ${oldClient.active ? 'вкл' : 'выкл'} → ${editingClient.active ? 'вкл' : 'выкл'}`)
      if (oldClient.featured !== editingClient.featured) changes.push(`VIP: ${oldClient.featured ? 'да' : 'нет'} → ${editingClient.featured ? 'да' : 'нет'}`)
      if (oldClient.paymentMethod !== editingClient.paymentMethod) changes.push(`оплата: ${oldClient.paymentMethod} → ${editingClient.paymentMethod}`)
      if (oldClient.paymentPeriod !== editingClient.paymentPeriod) changes.push(`период: ${oldClient.paymentPeriod} → ${editingClient.paymentPeriod}`)
      if (oldClient.address !== editingClient.address) changes.push(`адрес: ${oldClient.address} → ${editingClient.address}`)
      if (oldClient.manager?.name !== editingClient.manager?.name) changes.push(`менеджер: ${oldClient.manager?.name} → ${editingClient.manager?.name}`)
      if (oldClient.adminComment !== editingClient.adminComment) changes.push(`комментарий: "${editingClient.adminComment}"`)

      setClients(prev => ({ ...prev, [editingClient.id]: editingClient }))

      if (changes.length > 0) {
        const logMessage = `📝 *Изменение: ${editingClient.company}*\n\n${changes.join('\n')}\n\n📅 ${new Date().toLocaleString('ru-RU')}`
        await sendByEvent('admin_edit', logMessage)
      }

      setEditingClient(null)
      alert('Сохранено!')
    }
  }

  const createOrder = async () => {
    const newOrder = {
      id: Date.now(),
      clientId: currentClient.id,
      date: new Date().toISOString().split('T')[0],
      day: selectedDay,
      meals: { breakfast: 0, lunch: 0, dinner: 0 },
      status: 'waiting',
      total: 0
    }

    selectedMeals.forEach(m => {
      newOrder.meals[m] = currentClient.staff?.regular || 0
    })

    const pricePerMeal = PRICES.regular.lunch
    newOrder.total = (newOrder.meals.breakfast + newOrder.meals.lunch + newOrder.meals.dinner) * pricePerMeal

    setOrders(prev => [...prev, newOrder])

    const orderMessage = `📥 *Новый заказ на согласование*\n\n*Компания:* ${currentClient.company}\n*Дата:* ${DAYS_RU[newOrder.day]}, ${newOrder.date}\n\n🥐 Завтрак: ${newOrder.meals.breakfast}\n🍱 Обед: ${newOrder.meals.lunch}\n🍽️ Ужин: ${newOrder.meals.dinner}\n\n💰 *Стоимость:* ${newOrder.total.toLocaleString()}₽`
    await sendByEvent('new_order', orderMessage)

    alert('Заказ отправлен на согласование!')
  }

  const addNewClient = () => {
    const newId = 'NEW-' + Date.now().toString().slice(-4).toUpperCase()
    const newClient = {
      id: newId,
      company: '',
      inn: '',
      contact: '',
      phone: '',
      email: '',
      address: '',
      companyType: 'office',
      contractDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'card',
      paymentPeriod: 'monthly',
      active: true,
      featured: false,
      discount: 0,
      staff: { regular: 0, halal: 0, pp: 0, director: 0 },
      meals: ['lunch'],
      deliveryTime: { lunch: '12:00-13:00' },
      manager: { name: 'Анна', phone: '+7 (999) 000-11-22' },
      adminComment: ''
    }
    setEditingClient(newClient)
  }

  const deleteClient = async (clientId) => {
    if (confirm('Удалить клиента?')) {
      const c = clients[clientId]
      const message = `🗑️ *Клиент удалён:* ${c.company}\nID: ${clientId}\n📅 ${new Date().toLocaleString('ru-RU')}`
      await sendByEvent('admin_edit', message)
      setClients(prev => {
        const updated = { ...prev }
        delete updated[clientId]
        return updated
      })
    }
  }

  const testTelegram = async () => {
    const results = []
    
    // Тест всех топиков
    const tests = [
      { id: THREADS.waiting, name: 'Ожидание' },
      { id: THREADS.newUser, name: 'Новый пользователь' },
      { id: THREADS.history, name: 'История' },
      { id: THREADS.orders, name: 'Заявки' }
    ]

    for (const t of tests) {
      const msg = `🧪 *Тест ${t.name}*\n\nID топика: ${t.id}\n⏰ ${new Date().toLocaleString('ru-RU')}`
      const ok = await sendToTelegram(msg, t.id)
      results.push(`${t.name}: ${ok ? '✅' : '❌'}`)
    }

    alert('Результаты:\n' + results.join('\n'))
  }

  const getPrice = (foodType, meal) => PRICES[foodType]?.[meal] || 0
  const getPaymentMethodName = (id) => PAYMENT_METHODS.find(p => p.id === id)?.name || id
  const getPaymentPeriodName = (id) => PAYMENT_PERIODS.find(p => p.id === id)?.name || id
  const getCompanyTypeName = (id) => COMPANY_TYPES.find(t => t.id === id)?.name || id

  const todayOrders = orders.filter(o => o.status === 'waiting')

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ fontSize: 24, marginBottom: 10 }}>⏳</div>
        <div>Загрузка...</div>
      </div>
    )
  }

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
          <form onSubmit={handleLogin}>
            <label style={labelStyle}>Номер договора</label>
            <input type="text" placeholder="TEST-001" value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)} style={inputStyle} />
            {loginError && <div style={{ color: '#f44336', marginBottom: 12, fontSize: 13 }}>{loginError}</div>}
            <button type="submit" style={buttonPrimaryStyle}>Войти</button>
          </form>
          <button onClick={() => navigate('new')} style={{
            ...buttonPrimaryStyle, background: '#fff', color: '#1976D2', border: '2px solid #1976D2', marginTop: 12
          }}>📝 Оставить заявку</button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#666' }}>
          📊 <a href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`} target="_blank" style={{ color: '#1976D2' }}>База данных</a>
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
            <input type="text" placeholder="ООО Ромашка" value={client.company}
              onChange={(e) => setClient({...client, company: e.target.value})} style={inputStyle} required />
            <label style={labelStyle}>Контакт *</label>
            <input type="text" placeholder="Иван Иванов" value={client.contact}
              onChange={(e) => setClient({...client, contact: e.target.value})} style={inputStyle} required />
            <label style={labelStyle}>Телефон *</label>
            <input type="tel" placeholder="+7 (999) 123-45-67" value={client.phone}
              onChange={(e) => setClient({...client, phone: e.target.value})} style={inputStyle} required />
            <label style={labelStyle}>Тип:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {COMPANY_TYPES.map(type => (
                <button key={type.id} type="button" onClick={() => setCompanyType(type.id)}
                  style={{
                    padding: '12px 16px', border: companyType === type.id ? '2px solid #1976D2' : '2px solid #e0e0e0',
                    borderRadius: 8, background: companyType === type.id ? '#E3F2FD' : '#fafafa', cursor: 'pointer', textAlign: 'left'
                  }}>
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

  // === АДМИН ===
  if (view === 'admin') {
    return (
      <div style={{ padding: 16, maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, margin: 0, color: '#1976D2' }}>⚙️ Админ-панель</h1>
          <button onClick={() => navigate('login')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Выход</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
          {[
            { id: 'clients', name: '🏢 Клиенты' },
            { id: 'orders', name: '📋 Заказы' },
            { id: 'waiting', name: '📥 Ожидание' },
            { id: 'telegram', name: '📱 Telegram' }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '10px 14px', border: 'none', borderRadius: 8,
                background: tab === t.id ? '#1976D2' : '#fff', color: tab === t.id ? '#fff' : '#333',
                cursor: 'pointer', fontSize: 14, fontWeight: '600'
              }}>{t.name}</button>
          ))}
        </div>

        {/* === КЛИЕНТЫ === */}
        {tab === 'clients' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Всего: {Object.keys(clients).length} клиентов</span>
              <button onClick={addNewClient} style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>+ Добавить клиента</button>
            </div>
            {Object.values(clients).map(c => (
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
                    <button onClick={() => setEditingClient({...c})} style={{ padding: '8px 16px', background: '#1976D2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Изменить</button>
                    <button onClick={() => deleteClient(c.id)} style={{ padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>✕</button>
                  </div>
                </div>
                {c.adminComment && (
                  <div style={{ padding: 10, background: '#FFF3E0', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>
                    💬 {c.adminComment}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: 13 }}>
                  <div>Тип: <b>{getCompanyTypeName(c.companyType)}</b></div>
                  <div>Скидка: <b>{c.discount}%</b></div>
                  <div>Оплата: <b>{getPaymentMethodName(c.paymentMethod)}</b></div>
                  <div>Менеджер: <b>{c.manager?.name || '-'}</b></div>
                  <div>Тел: <b>{c.manager?.phone || '-'}</b></div>
                  <div>Договор: <b>{c.contractDate || '-'}</b></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === ЗАКАЗЫ === */}
        {tab === 'orders' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>📋 Все заказы ({orders.length})</h3>
            {orders.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>Нет заказов</div>
            ) : (
              orders.map(order => {
                const clientName = clients[order.clientId]?.company || 'Unknown'
                return (
                  <div key={order.id} style={{ padding: 12, background: '#fafafa', borderRadius: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{clientName}</div>
                      <div style={{ fontSize: 13, color: '#666' }}>{DAYS_RU[order.day]} • {order.date}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        🥐{order.meals.breakfast} • 🍱{order.meals.lunch} • 🍽️{order.meals.dinner}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold' }}>{order.total.toLocaleString()}₽</div>
                      <span style={{ padding: '4px 12px', background: order.status === 'waiting' ? '#FFF3E0' : '#E8F5E9', borderRadius: 16, fontSize: 12 }}>
                        {order.status === 'waiting' ? '⏳ Ожидание' : '✓ Подтверждён'}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* === ОЖИДАНИЕ === */}
        {tab === 'waiting' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>📥 Ожидают согласования ({orders.filter(o => o.status === 'waiting').length})</h3>
            {orders.filter(o => o.status === 'waiting').map(order => {
              const clientName = clients[order.clientId]?.company || 'Unknown'
              return (
                <div key={order.id} style={{ padding: 12, background: '#FFF3E0', borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{clientName}</div>
                      <div style={{ fontSize: 13, color: '#666' }}>{DAYS_RU[order.day]}, {order.date}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: '#FF9800' }}>{order.total.toLocaleString()}₽</div>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        🥐{order.meals.breakfast} • 🍱{order.meals.lunch} • 🍽️{order.meals.dinner}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={async () => {
                      setOrders(prev => prev.map(o => o.id === order.id ? {...o, status: 'confirmed'} : o))
                      await sendByEvent('order_confirmed', `✅ *Заказ подтверждён*\n\n*Компания:* ${clientName}\n*Дата:* ${DAYS_RU[order.day]}, ${order.date}\n\n💰 Сумма: ${order.total.toLocaleString()}₽`)
                    }} style={{ flex: 1, padding: '8px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>✓ Подтвердить</button>
                    <button onClick={async () => {
                      setOrders(prev => prev.filter(o => o.id !== order.id))
                      await sendByEvent('order_cancelled', `❌ *Заказ отменён*\n\n*Компания:* ${clientName}\n*Дата:* ${DAYS_RU[order.day]}, ${order.date}`)
                    }} style={{ flex: 1, padding: '8px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>✕ Отклонить</button>
                  </div>
                </div>
              )
            })}
            {orders.filter(o => o.status === 'waiting').length === 0 && (
              <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>Нет заказов на согласование</div>
            )}
          </div>
        )}

        {/* === TELEGRAM === */}
        {tab === 'telegram' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>📱 Настройки Telegram</h3>
            
            <div style={{ padding: 12, background: '#E8F5E9', borderRadius: 8, marginBottom: 12 }}>
              <div style={{ fontWeight: '600', marginBottom: 8 }}>🤖 Бот</div>
              <div style={{ fontSize: 13 }}>Имя: <b>Shyrik</b></div>
              <div style={{ fontSize: 13 }}>Username: <b>@Sgrer01_bot</b></div>
              <div style={{ fontSize: 13 }}>ID: <b>6706048508</b></div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Статус: <span style={{ color: '#4CAF50' }}>✅ Работает</span></div>
            </div>

            <div style={{ padding: 12, background: '#E3F2FD', borderRadius: 8, marginBottom: 12 }}>
              <div style={{ fontWeight: '600', marginBottom: 8 }}>💬 Группа</div>
              <div style={{ fontSize: 13 }}>Название: <b>Тест группа</b></div>
              <div style={{ fontSize: 13 }}>Username: <b>@test_shyrik</b></div>
              <div style={{ fontSize: 13 }}>Chat ID: <code style={{ background: '#fff', padding: '2px 6px', borderRadius: 4 }}>{GROUP_CHAT_ID}</code></div>
              <div style={{ fontSize: 13 }}>Ссылка: <a href="https://t.me/test_shyrik/223" target="_blank" style={{ color: '#1976D2' }}>t.me/test_shyrik/223</a></div>
            </div>

            <div style={{ padding: 12, background: '#FFF3E0', borderRadius: 8, marginBottom: 12 }}>
              <div style={{ fontWeight: '600', marginBottom: 8 }}>📋 Топики</div>
              <div style={{ fontSize: 13, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>📥 Ожидание: <b>{THREADS.waiting}</b></div>
                <div>👤 Новый: <b>{THREADS.newUser}</b></div>
                <div>📜 История: <b>{THREADS.history}</b></div>
                <div>📋 Заявки: <b>{THREADS.orders}</b></div>
              </div>
            </div>

            <button onClick={testTelegram} style={{ ...buttonPrimaryStyle, background: '#FF9800', marginBottom: 12 }}>
              🧪 Тест всех топиков
            </button>

            <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 8, marginBottom: 12 }}>
              <div style={{ fontWeight: '600', marginBottom: 8 }}>📊 Ссылки на топики</div>
              <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="https://t.me/test_shyrik/360" target="_blank" style={{ color: '#1976D2' }}>📥 Ожидание</a>
                <a href="https://t.me/test_shyrik/361" target="_blank" style={{ color: '#1976D2' }}>👤 Новый пользователь</a>
                <a href="https://t.me/test_shyrik/362" target="_blank" style={{ color: '#1976D2' }}>📜 История</a>
                <a href="https://t.me/test_shyrik/359" target="_blank" style={{ color: '#1976D2' }}>📋 Заявки</a>
              </div>
            </div>

            <div style={{ marginTop: 16, padding: 12, background: '#E3F2FD', borderRadius: 8, fontSize: 13 }}>
              📊 <a href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`} → target="_blank" style={{ color: '#1976D2' }}>Открыть Google Таблицу</a>
            </div>
          </div>
        )}

        {/* === РЕДАКТИРОВАНИЕ КЛИЕНТА === */}
        {editingClient && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 16, maxWidth: 600, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>Редактирование: {editingClient.id}</h2>

              <label style={labelStyle}>Компания:</label>
              <input type="text" value={editingClient.company} onChange={(e) => setEditingClient({...editingClient, company: e.target.value})} style={inputStyle} />

              <label style={labelStyle}>Контакт:</label>
              <input type="text" value={editingClient.contact} onChange={(e) => setEditingClient({...editingClient, contact: e.target.value})} style={inputStyle} />

              <label style={labelStyle}>Телефон:</label>
              <input type="text" value={editingClient.phone} onChange={(e) => setEditingClient({...editingClient, phone: e.target.value})} style={inputStyle} />

              <label style={labelStyle}>Email:</label>
              <input type="text" value={editingClient.email || ''} onChange={(e) => setEditingClient({...editingClient, email: e.target.value})} style={inputStyle} />

              <label style={labelStyle}>Адрес:</label>
              <input type="text" value={editingClient.address} onChange={(e) => setEditingClient({...editingClient, address: e.target.value})} style={inputStyle} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={editingClient.active} onChange={(e) => setEditingClient({...editingClient, active: e.target.checked})} />
                  Активен
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={editingClient.featured} onChange={(e) => setEditingClient({...editingClient, featured: e.target.checked})} />
                  VIP
                </label>
              </div>

              <label style={labelStyle}>Скидка (%):</label>
              <input type="number" value={editingClient.discount} onChange={(e) => setEditingClient({...editingClient, discount: parseInt(e.target.value) || 0})} style={inputStyle} />

              <label style={labelStyle}>Тип предприятия:</label>
              <select value={editingClient.companyType} onChange={(e) => setEditingClient({...editingClient, companyType: e.target.value})} style={inputStyle}>
                {COMPANY_TYPES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
              </select>

              <label style={labelStyle}>Оплата:</label>
              <select value={editingClient.paymentMethod} onChange={(e) => setEditingClient({...editingClient, paymentMethod: e.target.value})} style={inputStyle}>
                {PAYMENT_METHODS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              <label style={labelStyle}>Период:</label>
              <select value={editingClient.paymentPeriod} onChange={(e) => setEditingClient({...editingClient, paymentPeriod: e.target.value})} style={inputStyle}>
                {PAYMENT_PERIODS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              <label style={labelStyle}>Приёмы:</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {MEALS.map(m => (
                  <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="checkbox" checked={editingClient.meals?.includes(m.id)} onChange={(e) => {
                      const meals = editingClient.meals || []
                      setEditingClient({...editingClient, meals: e.target.checked ? [...meals, m.id] : meals.filter(x => x !== m.id)})
                    }} />
                    {m.name}
                  </label>
                ))}
              </div>

              <label style={labelStyle}>Менеджер:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                <input type="text" placeholder="Имя" value={editingClient.manager?.name || ''} onChange={(e) => setEditingClient({...editingClient, manager: {...editingClient.manager, name: e.target.value}})} style={inputStyle} />
                <input type="text" placeholder="Тел" value={editingClient.manager?.phone || ''} onChange={(e) => setEditingClient({...editingClient, manager: {...editingClient.manager, phone: e.target.value}})} style={inputStyle} />
              </div>

              <label style={labelStyle}>Комментарий клиенту:</label>
              <textarea value={editingClient.adminComment || ''} onChange={(e) => setEditingClient({...editingClient, adminComment: e.target.value})} style={{ ...inputStyle, height: 80 }} />

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={saveClientEdit} style={{ ...buttonPrimaryStyle, background: '#4CAF50' }}>💾 Сохранить</button>
                <button onClick={() => setEditingClient(null)} style={{ ...buttonPrimaryStyle, background: '#f44336' }}>Отмена</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // === КАБИНЕТ ===
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
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ background: '#4CAF50', color: '#fff', padding: '4px 10px', borderRadius: 16, fontSize: 11 }}>Договор</span>
            {currentClient.discount > 0 && <div style={{ marginTop: 4, background: '#FF9800', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>-{currentClient.discount}%</div>}
          </div>
        </div>
        {currentClient.adminComment && (
          <div style={{ marginTop: 12, padding: 10, background: '#E3F2FD', borderRadius: 8, fontSize: 13 }}>
            💬 {currentClient.adminComment}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto' }}>
        {[{ id: 'dashboard', name: '📊' }, { id: 'menu', name: '🍴' }, { id: 'orders', name: '📋' }, { id: 'settings', name: '⚙️' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: '10px 14px', border: 'none', borderRadius: 8,
              background: tab === t.id ? '#1976D2' : '#fff', color: tab === t.id ? '#fff' : '#333',
              cursor: 'pointer', fontSize: 14
            }}>{t.name}</button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <>
          <div style={sectionStyle}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 14, background: '#E3F2FD', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1976D2' }}>{todayOrders.length}</div>
                <div style={{ fontSize: 12, color: '#666' }}>ожидают</div>
              </div>
              <div style={{ padding: 14, background: '#E8F5E9', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4CAF50' }}>{todayOrders.reduce((s,o) => s+o.total, 0).toLocaleString()}₽</div>
                <div style={{ fontSize: 12, color: '#666' }}>сумма</div>
              </div>
            </div>
          </div>
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, fontSize: 14 }}>📞 Менеджер</h3>
            <div style={{ fontSize: 14 }}>{currentClient.manager?.name} • {currentClient.manager?.phone}</div>
          </div>
        </>
      )}

      {tab === 'menu' && (
        <div style={sectionStyle}>
          <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} style={{...inputStyle, marginBottom: 12}}>
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(d => <option key={d} value={d}>{DAYS_RU[d]}</option>)}
          </select>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {FOOD_TYPES.map(type => (
              <button key={type.id} onClick={() => toggleFoodType(type.id)}
                style={{
                  padding: '8px 12px', border: selectedFoodTypes.includes(type.id) ? '2px solid #1976D2' : '2px solid #e0e0e0',
                  borderRadius: 6, background: selectedFoodTypes.includes(type.id) ? '#E3F2FD' : '#fafafa', cursor: 'pointer', fontSize: 13
                }}>{type.emoji} {type.name}</button>
            ))}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <tbody>
              {MEALS.filter(m => selectedMeals.includes(m.id)).map(meal => (
                <tr key={meal.id}>
                  <td style={{ padding: 10 }}>{meal.emoji} {meal.name}</td>
                  {selectedFoodTypes.map(type => (
                    <td key={type.id} style={{ padding: 10, textAlign: 'right' }}>
                      <span style={{ background: '#E8F5E9', padding: '4px 10px', borderRadius: 12, fontWeight: '600' }}>{getPrice(type, meal.id)}₽</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>📋 Сделать заказ</h3>
          <label style={labelStyle}>День недели:</label>
          <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} style={{...inputStyle, marginBottom: 12}}>
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(d => <option key={d} value={d}>{DAYS_RU[d]}</option>)}
          </select>

          <label style={labelStyle}>Приёмы пищи:</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {MEALS.map(m => (
              <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedMeals.includes(m.id)} onChange={() => toggleMeal(m.id)} />
                {m.emoji} {m.name}
              </label>
            ))}
          </div>

          <button onClick={createOrder} disabled={selectedMeals.length === 0} style={{ ...buttonPrimaryStyle, background: selectedMeals.length > 0 ? '#4CAF50' : '#ccc' }}>
            📤 Отправить на согласование
          </button>
        </div>
      )}

      {tab === 'settings' && (
        <>
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, fontSize: 14 }}>💰 Оплата</h3>
            <div style={{ fontSize: 13 }}>{getPaymentMethodName(currentClient.paymentMethod)} • {getPaymentPeriodName(currentClient.paymentPeriod)}</div>
          </div>
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, fontSize: 14 }}>🚚 Доставка</h3>
            {currentClient.deliveryTime?.breakfast && <div style={{ fontSize: 13 }}>🥐 {currentClient.deliveryTime.breakfast}</div>}
            {currentClient.deliveryTime?.lunch && <div style={{ fontSize: 13 }}>🍱 {currentClient.deliveryTime.lunch}</div>}
            {currentClient.deliveryTime?.dinner && <div style={{ fontSize: 13 }}>🍽️ {currentClient.deliveryTime.dinner}</div>}
          </div>
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
        </>
      )}
    </div>
  )
}

export default App