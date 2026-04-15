import { useState, useEffect } from 'react'

const COMPANY_TYPES = [
  { id: 'office', name: 'Офис', emoji: '🏢' },
  { id: 'plant', name: 'Производство', emoji: '🏭' },
  { id: 'quarter', name: 'Квартал', emoji: '📅' }
]

const SPREADSHEET_ID = '1VRSHLi1eu7k5cT6lAYWvXbIToTpcMj1rx2saiWwENp4'

const DEFAULT_BOTS = [
  {
    id: 'bot1',
    name: 'Shyrik',
    token: '6706048508:AAF-8INmBKwP1x7DA-_ET8D282c5pp0Rn2Y',
    chatId: '-1002583331823',
    active: true
  }
]

const DEFAULT_THREADS = {
  waiting: 360,
  newUser: 361,
  history: 362,
  orders: 359
}

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

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [bots, setBots] = useState([])
  const [threads, setThreads] = useState(DEFAULT_THREADS)
  const [editingBot, setEditingBot] = useState(null)

  useEffect(() => {
    const loadData = () => {
      const savedClients = loadFromStorage('clients')
      setClients(savedClients || DEFAULT_CLIENTS)
      
      const savedOrders = loadFromStorage('orders')
      setOrders(savedOrders || [])
      
      const savedBots = loadFromStorage('bots')
      setBots(savedBots || DEFAULT_BOTS)
      
      const savedThreads = loadFromStorage('threads')
      if (savedThreads) setThreads(savedThreads)
      
      setLoading(false)
    }
    loadData()
  }, [])

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
    if (!loading && bots.length > 0) {
      saveToStorage('bots', bots)
    }
  }, [bots, loading])

  useEffect(() => {
    if (!loading) {
      saveToStorage('threads', threads)
    }
  }, [threads, loading])

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
    const normalized = contractNumber.trim()
    
    if (normalized === '0901SmolAdmin') {
      navigate('admin')
      return
    }
    
    const upperNormalized = normalized.toUpperCase().trim()
    if (upperNormalized === 'ADMIN') {
      navigate('admin')
      return
    }
    
    if (clients[upperNormalized]) {
      const c = clients[upperNormalized]
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
      const activeBot = bots.find(b => b.active)
      if (activeBot) {
        const message = `📋 *Новая заявка!*\n\n*Компания:* ${client.company}\n*Контакт:* ${client.contact}\n*Телефон:* ${client.phone}\n*Тип:* ${COMPANY_TYPES.find(t => t.id === companyType)?.name || companyType}`
        await sendToTelegram(activeBot, message, threads.newUser)
      }
      alert('Заявка отправлена!')
      navigate('login')
    }
  }

  const handleSendComment = async () => {
    if (comment.trim() && currentClient) {
      const activeBot = bots.find(b => b.active)
      if (activeBot) {
        const message = `💬 *${currentClient.company}:*\n\n${comment}\n\n📅 ${new Date().toLocaleString('ru-RU')}`
        await sendToTelegram(activeBot, message, threads.history)
      }
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

      setClients(prev => ({ ...prev, [editingClient.id]: editingClient }))

      if (changes.length > 0) {
        const activeBot = bots.find(b => b.active)
        if (activeBot) {
          const logMessage = `📝 *Изменение: ${editingClient.company}*\n\n${changes.join('\n')}\n\n📅 ${new Date().toLocaleString('ru-RU')}`
          await sendToTelegram(activeBot, logMessage, threads.history)
        }
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

    const activeBot = bots.find(b => b.active)
    if (activeBot) {
      const orderMessage = `📥 *Новый заказ на согласование*\n\n*Компания:* ${currentClient.company}\n*Дата:* ${DAYS_RU[newOrder.day]}, ${newOrder.date}\n\n🥐 Завтрак: ${newOrder.meals.breakfast}\n🍱 Обед: ${newOrder.meals.lunch}\n🍽️ Ужин: ${newOrder.meals.dinner}\n\n💰 *Стоимость:* ${newOrder.total.toLocaleString()}₽`
      await sendToTelegram(activeBot, orderMessage, threads.waiting)
    }

    alert('Заказ отправлен на согласование!')
  }

  const addNewClient = () => {
    const newId = 'NEW-' + Date.now().toString().slice(-4).toUpperCase()
    const newClient = {
      id: newId, company: '', inn: '', contact: '', phone: '', email: '', address: '',
      companyType: 'office', contractDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'card', paymentPeriod: 'monthly', active: true, featured: false, discount: 0,
      staff: { regular: 0, halal: 0, pp: 0, director: 0 }, meals: ['lunch'],
      deliveryTime: { lunch: '12:00-13:00' }, manager: { name: 'Анна', phone: '+7 (999) 000-11-22' }, adminComment: ''
    }
    setEditingClient(newClient)
  }

  const deleteClient = async (clientId) => {
    if (confirm('Удалить клиента?')) {
      const c = clients[clientId]
      const activeBot = bots.find(b => b.active)
      if (activeBot) {
        const message = `🗑️ *Клиент удалён:* ${c.company}\nID: ${clientId}\n📅 ${new Date().toLocaleString('ru-RU')}`
        await sendToTelegram(activeBot, message, threads.history)
      }
      setClients(prev => {
        const updated = { ...prev }
        delete updated[clientId]
        return updated
      })
    }
  }

  const addNewBot = () => {
    const newBot = {
      id: 'bot' + Date.now(),
      name: 'Новый бот',
      token: '',
      chatId: '',
      active: bots.length === 0
    }
    setEditingBot(newBot)
  }

  const saveBot = () => {
    if (editingBot) {
      setBots(prev => {
        const existing = prev.find(b => b.id === editingBot.id)
        if (existing) {
          return prev.map(b => b.id === editingBot.id ? editingBot : b)
        } else {
          return [...prev, editingBot]
        }
      })
      setEditingBot(null)
      alert('Бот сохранён!')
    }
  }

  const deleteBot = (botId) => {
    if (confirm('Удалить бота?')) {
      setBots(prev => prev.filter(b => b.id !== botId))
    }
  }

  const toggleBotActive = (botId) => {
    setBots(prev => prev.map(b => ({
      ...b,
      active: b.id === botId ? !b.active : false
    })))
  }

  const sendToTelegram = async (bot, message, threadId) => {
    if (!bot || !bot.token || !bot.chatId) return false
    try {
      const response = await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: bot.chatId,
          text: message,
          parse_mode: 'Markdown',
          message_thread_id: Number(threadId)
        })
      })
      return (await response.json()).ok
    } catch (err) {
      console.log('Telegram error:', err)
      return false
    }
  }

  const testTelegram = async () => {
    const activeBot = bots.find(b => b.active)
    if (!activeBot) {
      alert('Нет активного бота!')
      return
    }

    const results = []
    const tests = [
      { id: threads.waiting, name: 'Ожидание' },
      { id: threads.newUser, name: 'Новый пользователь' },
      { id: threads.history, name: 'История' },
      { id: threads.orders, name: 'Заявки' }
    ]

    for (const t of tests) {
      const msg = `🧪 *Тест ${t.name}*\n\nID топика: ${t.id}\n⏰ ${new Date().toLocaleString('ru-RU')}`
      const ok = await sendToTelegram(activeBot, msg, t.id)
      results.push(`${t.name}: ${ok ? '✅' : '❌'}`)
    }

    alert('Результаты:\n' + results.join('\n'))
  }

  const getPrice = (foodType, meal) => PRICES[foodType]?.[meal] || 0

  const todayOrders = orders.filter(o => o.status === 'waiting')

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ fontSize: 24, marginBottom: 10 }}>⏳</div>
        <div>Загрузка...</div>
      </div>
    )
  }

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
            <label style={labelStyle}>Номер договора / Пароль</label>
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
            { id: 'bots', name: '🤖 Боты' },
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
                  <div>Тип: <b>{c.companyType}</b></div>
                  <div>Скидка: <b>{c.discount}%</b></div>
                  <div>Менеджер: <b>{c.manager?.name || '-'}</b></div>
                </div>
              </div>
            ))}
          </div>
        )}

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
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={async () => {
                      setOrders(prev => prev.map(o => o.id === order.id ? {...o, status: 'confirmed'} : o))
                      const activeBot = bots.find(b => b.active)
                      if (activeBot) {
                        await sendToTelegram(activeBot, `✅ *Заказ подтверждён*\n\n*Компания:* ${clientName}\n*Дата:* ${DAYS_RU[order.day]}, ${order.date}\n\n💰 Сумма: ${order.total.toLocaleString()}₽`, threads.orders)
                      }
                    }} style={{ flex: 1, padding: '8px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>✓ Подтвердить</button>
                    <button onClick={async () => {
                      setOrders(prev => prev.filter(o => o.id !== order.id))
                      const activeBot = bots.find(b => b.active)
                      if (activeBot) {
                        await sendToTelegram(activeBot, `❌ *Заказ отменён*\n\n*Компания:* ${clientName}\n*Дата:* ${DAYS_RU[order.day]}, ${order.date}`, threads.orders)
                      }
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

        {tab === 'bots' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Всего ботов: {bots.length}</span>
              <button onClick={addNewBot} style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>+ Добавить бота</button>
            </div>
            
            {bots.map(bot => (
              <div key={bot.id} style={{ ...sectionStyle, borderLeft: bot.active ? '4px solid #4CAF50' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 18 }}>🤖 {bot.name}</h3>
                      {bot.active && <span style={{ background: '#4CAF50', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>АКТИВЕН</span>}
                    </div>
                    <div style={{ fontSize: 13, color: '#666' }}>ID: {bot.id}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setEditingBot({...bot})} style={{ padding: '8px 16px', background: '#1976D2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Изменить</button>
                    <button onClick={() => deleteBot(bot.id)} style={{ padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>✕</button>
                  </div>
                </div>
                <div style={{ fontSize: 13, marginBottom: 8 }}>
                  <div>Token: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>{bot.token?.slice(0, 20)}...</code></div>
                  <div>Chat ID: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>{bot.chatId}</code></div>
                </div>
                <button onClick={() => toggleBotActive(bot.id)} style={{
                  padding: '8px 16px', background: bot.active ? '#FF9800' : '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13
                }}>
                  {bot.active ? 'Деактивировать' : 'Активировать'}
                </button>
              </div>
            ))}

            {bots.length === 0 && (
              <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>Нет ботов. Добавьте бота.</div>
            )}
          </div>
        )}

        {tab === 'telegram' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>📱 Настройки Telegram</h3>
            
            <div style={{ padding: 12, background: '#FFF3E0', borderRadius: 8, marginBottom: 12 }}>
              <div style={{ fontWeight: '600', marginBottom: 8 }}>📋 ID топиков</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>📥 Ожидание: <input type="number" value={threads.waiting} onChange={(e) => setThreads({...threads, waiting: parseInt(e.target.value)})} style={{ width: 60, padding: 4 }} /></div>
                <div>👤 Новый: <input type="number" value={threads.newUser} onChange={(e) => setThreads({...threads, newUser: parseInt(e.target.value)})} style={{ width: 60, padding: 4 }} /></div>
                <div>📜 История: <input type="number" value={threads.history} onChange={(e) => setThreads({...threads, history: parseInt(e.target.value)})} style={{ width: 60, padding: 4 }} /></div>
                <div>📋 Заявки: <input type="number" value={threads.orders} onChange={(e) => setThreads({...threads, orders: parseInt(e.target.value)})} style={{ width: 60, padding: 4 }} /></div>
              </div>
            </div>

            <button onClick={testTelegram} style={{ ...buttonPrimaryStyle, background: '#FF9800', marginBottom: 12 }}>
              🧪 Тест всех топиков
            </button>

            <div style={{ marginTop: 16, padding: 12, background: '#E3F2FD', borderRadius: 8, fontSize: 13 }}>
              📊 <a href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`} target="_blank" style={{ color: '#1976D2' }}>Открыть Google Таблицу</a>
            </div>
          </div>
        )}

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

              <label style={labelStyle}>Комментарий клиенту:</label>
              <textarea value={editingClient.adminComment || ''} onChange={(e) => setEditingClient({...editingClient, adminComment: e.target.value})} style={{ ...inputStyle, height: 80 }} />

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

              <label style={labelStyle}>Название:</label>
              <input type="text" value={editingBot.name} onChange={(e) => setEditingBot({...editingBot, name: e.target.value})} style={inputStyle} />

              <label style={labelStyle}>Token бота:</label>
              <input type="text" value={editingBot.token} onChange={(e) => setEditingBot({...editingBot, token: e.target.value})} style={inputStyle} placeholder="123456789:ABC..." />

              <label style={labelStyle}>Chat ID группы:</label>
              <input type="text" value={editingBot.chatId} onChange={(e) => setEditingBot({...editingBot, chatId: e.target.value})} style={inputStyle} placeholder="-1001234567890" />

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