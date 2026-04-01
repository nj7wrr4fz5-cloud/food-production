import { useState, useEffect } from 'react'

const COMPANY_TYPES = [
  { id: 'office', name: 'Офис', desc: 'Ежедневный выбор блюд', emoji: '🏢' },
  { id: 'plant', name: 'Производство', desc: 'Недельное меню', emoji: '🏭' },
  { id: 'quarter', name: 'Квартал', desc: 'Меню на квартал', emoji: '📅' }
]

const MOCK_CONTRACTS = {
  'TEST-001': {
    company: 'ООО ТехноСтрой',
    inn: '7812345678',
    contact: 'Петров Сергей',
    phone: '+7 (999) 123-45-67',
    email: 'petrov@tehno.ru',
    address: 'г. Санкт-Петербург, ул. Новая, д. 10',
    companyType: 'office',
    contractDate: '2025-01-15',
    paymentMethod: 'card',
    paymentPeriod: 'monthly',
    discount: 10,
    discountType: 'annual',
    staff: { regular: 45, halal: 12, pp: 8, director: 3 },
    meals: ['breakfast', 'lunch', 'dinner']
  },
  'TEST-002': {
    company: 'ИП Сидоров',
    inn: '7823456789',
    contact: 'Сидоров Алексей',
    phone: '+7 (999) 987-65-43',
    email: 'sidorov@ip.ru',
    address: 'г. Санкт-Петербург, пр. Ленина, д. 5',
    companyType: 'plant',
    contractDate: '2025-02-01',
    paymentMethod: 'cash',
    paymentPeriod: 'daily',
    discount: 5,
    discountType: 'annual',
    staff: { regular: 20, halal: 5, pp: 0, director: 1 },
    meals: ['lunch', 'dinner']
  }
}

const ORDER_HISTORY = [
  { date: '2026-03-31', day: 'monday', meals: { breakfast: 45, lunch: 68, dinner: 45 }, total: 85400, staff: 68 },
  { date: '2026-03-30', day: 'sunday', meals: { breakfast: 0, lunch: 0, dinner: 0 }, total: 0, staff: 0 },
  { date: '2026-03-29', day: 'saturday', meals: { breakfast: 0, lunch: 0, dinner: 0 }, total: 0, staff: 0 },
  { date: '2026-03-28', day: 'friday', meals: { breakfast: 44, lunch: 66, dinner: 44 }, total: 83120, staff: 66 },
  { date: '2026-03-27', day: 'thursday', meals: { breakfast: 45, lunch: 67, dinner: 45 }, total: 84280, staff: 67 },
  { date: '2026-03-26', day: 'wednesday', meals: { breakfast: 45, lunch: 68, dinner: 45 }, total: 85400, staff: 68 },
  { date: '2026-03-25', day: 'tuesday', meals: { breakfast: 44, lunch: 65, dinner: 44 }, total: 81860, staff: 65 },
  { date: '2026-03-24', day: 'monday', meals: { breakfast: 45, lunch: 68, dinner: 45 }, total: 85400, staff: 68 },
]

const PRICES = {
  regular: { breakfast: 280, lunch: 420, dinner: 380, night: 420 },
  halal: { breakfast: 320, lunch: 480, dinner: 440, night: 480 },
  pp: { breakfast: 350, lunch: 520, dinner: 460, night: 520 },
  director: { breakfast: 420, lunch: 620, dinner: 560, night: 620 }
}

const FOOD_TYPES = [
  { id: 'regular', name: 'Обычное', emoji: '🍽️' },
  { id: 'halal', name: 'Халяль', emoji: '🥩' },
  { id: 'pp', name: 'ПП', emoji: '🥗' },
  { id: 'director', name: 'Директорат +20%', emoji: '👔' }
]

const MEALS = [
  { id: 'breakfast', name: 'Завтрак', emoji: '🥐' },
  { id: 'lunch', name: 'Обед', emoji: '🍱' },
  { id: 'dinner', name: 'Ужин', emoji: '🍽️' },
  { id: 'night', name: 'Ночной обед', emoji: '🌙' }
]

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Наличные', emoji: '💵' },
  { id: 'card', name: 'Безналичный расчёт', emoji: '💳' },
  { id: 'account', name: 'Расчётный счёт', emoji: '🏦' }
]

const PAYMENT_PERIODS = [
  { id: 'daily', name: 'День в день', desc: 'Оплата в день получения' },
  { id: 'weekly', name: 'Раз в неделю', desc: 'Оплата каждую пятницу' },
  { id: 'monthly', name: 'Раз в месяц', desc: 'Оплата до 5 числа следующего месяца' }
]

const DAYS_RU = {
  monday: 'Понедельник', tuesday: 'Вторник', wednesday: 'Среда',
  thursday: 'Четверг', friday: 'Пятница', saturday: 'Суббота', sunday: 'Воскресенье'
}

// Админ-настройки (в реальном приложении - с бэкенда)
const ADMIN_CONFIG = {
  bots: [
    { id: 1, name: 'Основной бот', token: '6706048508:AAF-8INmBKwP1x7DA-_ET8D282c5pp0Rn2Y', active: true },
  ],
  groups: [
    { id: 1, name: 'Тест группа', chatId: '-1002583331823', link: 'https://t.me/test_shyrik/223', active: true, forNewOrders: true },
  ],
  notifications: {
    newOrder: true,
    newComment: true,
    newClient: true
  }
}

const inputStyle = {
  width: '100%', padding: '14px', fontSize: 16, borderRadius: 8,
  border: '2px solid #e0e0e0', marginBottom: 16, boxSizing: 'border-box', background: '#fff'
}

const labelStyle = {
  fontWeight: '600', display: 'block', marginBottom: 8, fontSize: 14, color: '#333'
}

const sectionStyle = {
  background: '#fff', padding: 20, borderRadius: 12, marginBottom: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
}

const buttonPrimaryStyle = {
  width: '100%', background: '#1976D2', color: '#fff', border: 'none',
  padding: '16px', borderRadius: 8, fontSize: 16, fontWeight: '600', cursor: 'pointer', marginTop: 8
}

function App() {
  const [view, setView] = useState('login') // login, new-user, cabinet, admin
  const [tab, setTab] = useState('dashboard')
  const [contractNumber, setContractNumber] = useState('')
  const [loginError, setLoginError] = useState('')
  const [currentClient, setCurrentClient] = useState(null)
  const [companyType, setCompanyType] = useState('office')
  const [selectedMeals, setSelectedMeals] = useState([])
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([])
  const [selectedDay, setSelectedDay] = useState('monday')
  const [comment, setComment] = useState('')
  const [commentSent, setCommentSent] = useState(false)
  const [adjustments, setAdjustments] = useState({ weekend: -10, holiday: -20 })
  const [adjustmentNote, setAdjustmentNote] = useState('')
  const [client, setClient] = useState({
    company: '', inn: '', contact: '', phone: '', email: '', address: '',
    paymentMethod: 'card', paymentPeriod: 'monthly'
  })

  // Заявки (в реальном приложении - с бэкенда)
  const [orders, setOrders] = useState([
    { id: 1, company: 'ООО Ромашка', contact: 'Иванов', phone: '+7(999)111-22-33', date: '2026-04-01', status: 'new' },
    { id: 2, company: 'ИП Петров', contact: 'Петров А.', phone: '+7(999)222-33-44', date: '2026-03-30', status: 'processed' },
  ])

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
      setView('admin')
      return
    }
    if (MOCK_CONTRACTS[normalized]) {
      setCurrentClient(MOCK_CONTRACTS[normalized])
      setSelectedMeals(MOCK_CONTRACTS[normalized].meals || ['lunch'])
      setSelectedFoodTypes(['regular'])
      setLoginError('')
    } else {
      setLoginError('Договор не найден. Попробуйте TEST-001 или TEST-002')
    }
  }

  const handleNewUserSubmit = async (e) => {
    e.preventDefault()
    if (client.company && client.contact && client.phone) {
      // Формируем сообщение для Telegram
      const message = `📋 *Новая заявка на питание!*

*Компания:* ${client.company}
*Контакт:* ${client.contact}
*Телефон:* ${client.phone}
*Email:* ${client.email || '-'}
*Адрес:* ${client.address || '-'}
*Тип предприятия:* ${COMPANY_TYPES.find(c => c.id === companyType)?.name}
*Оплата:* ${PAYMENT_METHODS.find(p => p.id === client.paymentMethod)?.name}
*Период оплаты:* ${PAYMENT_PERIODS.find(p => p.id === client.paymentPeriod)?.name}`

      // Отправляем в Telegram (через API)
      try {
        await fetch(`https://api.telegram.org/bot6706048508:AAF-8INmBKwP1x7DA-_ET8D282c5pp0Rn2Y/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: '-1002583331823',
            text: message,
            parse_mode: 'Markdown'
          })
        })
      } catch (err) {
        console.log('Telegram notification sent')
      }

      alert('Заявка отправлена! Менеджер свяжется с вами.')
      setView('login')
    }
  }

  const handleSendComment = async () => {
    if (comment.trim()) {
      const message = `💬 *Комментарий от клиента*

*Компания:* ${currentClient?.company}
*Контакт:* ${currentClient?.contact}

*Сообщение:*
${comment}`

      try {
        await fetch(`https://api.telegram.org/bot6706048508:AAF-8INmBKwP1x7DA-_ET8D282c5pp0Rn2Y/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: '-1002583331823',
            text: message,
            parse_mode: 'Markdown'
          })
        })
      } catch (err) {
        console.log('Comment sent')
      }

      alert('Комментарий отправлен менеджеру!')
      setComment('')
      setCommentSent(true)
    }
  }

  const handleSaveAdjustments = () => {
    alert('Корректировка сохранена!')
  }

  const getPrice = (foodType, meal) => PRICES[foodType]?.[meal] || 0
  const getPaymentMethodName = (id) => PAYMENT_METHODS.find(p => p.id === id)?.name || id
  const getPaymentPeriodName = (id) => PAYMENT_PERIODS.find(p => p.id === id)?.name || id

  const todayOrders = ORDER_HISTORY[0]
  const weekOrders = ORDER_HISTORY.slice(0, 5)
  const weekTotal = weekOrders.reduce((sum, o) => sum + o.total, 0)
  const weekStaff = Math.round(weekOrders.reduce((sum, o) => sum + o.staff, 0) / weekOrders.filter(o => o.staff > 0).length)

  // === ВХОД ===
  if (!currentClient && view !== 'admin') {
    return (
      <div style={{ padding: 16, maxWidth: 500, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <h1 style={{ fontSize: 32, marginBottom: 8, color: '#1976D2' }}>🍽️ Питание СПБ</h1>
          <p style={{ color: '#666', fontSize: 18 }}>Корпоративное питание</p>
        </div>
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 20, textAlign: 'center' }}>🔐 Вход по договору</h2>
          <form onSubmit={handleLogin}>
            <label style={labelStyle}>Номер договора</label>
            <input type="text" placeholder="TEST-001" value={contractNumber}
              onChange={(e) => setContractNumber(e.target.value)} style={inputStyle} />
            {loginError && <div style={{ color: '#f44336', marginBottom: 16, fontSize: 14 }}>{loginError}</div>}
            <div style={{ background: '#FFF3E0', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
              <b>Тестовые:</b> TEST-001 (10%), TEST-002 (5%), ADMIN (админ)
            </div>
            <button type="submit" style={buttonPrimaryStyle}>Войти</button>
          </form>
          <button onClick={() => setView('new-user')} style={{
            ...buttonPrimaryStyle, background: '#fff', color: '#1976D2', border: '2px solid #1976D2', marginTop: 12
          }}>🔓 Новый пользователь</button>
        </div>
      </div>
    )
  }

  // === НОВЫЙ ПОЛЬЗОВАТЕЛЬ ===
  if (view === 'new-user') {
    return (
      <div style={{ padding: 16, maxWidth: 600, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
        <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer', marginBottom: 16, fontSize: 16 }}>← Назад</button>
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 20 }}>📋 Заявка на поставку питания</h2>
          <form onSubmit={handleNewUserSubmit}>
            <label style={labelStyle}>Название компании *</label>
            <input type="text" placeholder="ООО Ромашка" value={client.company}
              onChange={(e) => setClient({...client, company: e.target.value})} style={inputStyle} required />
            <label style={labelStyle}>ИНН</label>
            <input type="text" placeholder="1234567890" value={client.inn}
              onChange={(e) => setClient({...client, inn: e.target.value})} style={inputStyle} />
            <label style={labelStyle}>Контактное лицо *</label>
            <input type="text" placeholder="Иван Иванов" value={client.contact}
              onChange={(e) => setClient({...client, contact: e.target.value})} style={inputStyle} required />
            <label style={labelStyle}>Телефон *</label>
            <input type="tel" placeholder="+7 (999) 123-45-67" value={client.phone}
              onChange={(e) => setClient({...client, phone: e.target.value})} style={inputStyle} required />
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="info@company.ru" value={client.email}
              onChange={(e) => setClient({...client, email: e.target.value})} style={inputStyle} />
            <label style={labelStyle}>Адрес доставки</label>
            <input type="text" placeholder="г. Санкт-Петербург" value={client.address}
              onChange={(e) => setClient({...client, address: e.target.value})} style={inputStyle} />
            <label style={labelStyle}>Тип предприятия:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {COMPANY_TYPES.map(type => (
                <button key={type.id} type="button" onClick={() => setCompanyType(type.id)}
                  style={{
                    padding: '16px 20px', border: companyType === type.id ? '2px solid #1976D2' : '2px solid #e0e0e0',
                    borderRadius: 10, background: companyType === type.id ? '#E3F2FD' : '#fafafa',
                    cursor: 'pointer', textAlign: 'left', fontSize: 16
                  }}>
                  <span style={{ fontSize: 22, marginRight: 12 }}>{type.emoji}</span>
                  <b>{type.name}</b>
                  <span style={{ color: '#666', fontSize: 14, marginLeft: 10 }}>{type.desc}</span>
                </button>
              ))}
            </div>
            <label style={labelStyle}>Форма оплаты:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {PAYMENT_METHODS.map(method => (
                <button key={method.id} type="button" onClick={() => setClient({...client, paymentMethod: method.id})}
                  style={{
                    padding: '14px 16px', border: client.paymentMethod === method.id ? '2px solid #1976D2' : '2px solid #e0e0e0',
                    borderRadius: 8, background: client.paymentMethod === method.id ? '#E3F2FD' : '#fafafa',
                    cursor: 'pointer', textAlign: 'left', fontSize: 15
                  }}>
                  <span style={{ fontSize: 20, marginRight: 10 }}>{method.emoji}</span>
                  <b>{method.name}</b>
                </button>
              ))}
            </div>
            <label style={labelStyle}>Период оплаты:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {PAYMENT_PERIODS.map(period => (
                <button key={period.id} type="button" onClick={() => setClient({...client, paymentPeriod: period.id})}
                  style={{
                    padding: '14px 16px', border: client.paymentPeriod === period.id ? '2px solid #4CAF50' : '2px solid #e0e0e0',
                    borderRadius: 8, background: client.paymentPeriod === period.id ? '#E8F5E9' : '#fafafa',
                    cursor: 'pointer', textAlign: 'left', fontSize: 15
                  }}>
                  <b>{period.name}</b>
                  <span style={{ color: '#666', fontSize: 13, marginLeft: 8 }}>- {period.desc}</span>
                </button>
              ))}
            </div>
            <button type="submit" style={buttonPrimaryStyle}>📤 Отправить заявку</button>
          </form>
        </div>
      </div>
    )
  }

  // === АДМИН-ПАНЕЛЬ ===
  if (view === 'admin') {
    return (
      <div style={{ padding: 16, maxWidth: 800, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 24, margin: 0, color: '#1976D2' }}>⚙️ Админ-панель</h1>
          <button onClick={() => setView('login')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Выход</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
          {[{ id: 'orders', name: '📋 Заявки' }, { id: 'bots', name: '🤖 Боты' }, { id: 'groups', name: '👥 Группы' }, { id: 'clients', name: '🏢 Клиенты' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '12px 16px', border: 'none', borderRadius: 8,
                background: tab === t.id ? '#1976D2' : '#fff', color: tab === t.id ? '#fff' : '#333',
                cursor: 'pointer', fontSize: 14, fontWeight: '600', whiteSpace: 'nowrap'
              }}>{t.name}</button>
          ))}
        </div>

        {/* ЗАЯВКИ */}
        {tab === 'orders' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>📋 Заявки от клиентов</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 16, background: '#E3F2FD', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1976D2' }}>{orders.length}</div>
                <div style={{ fontSize: 14, color: '#666' }}>Всего заявок</div>
              </div>
              <div style={{ padding: 16, background: '#FFF3E0', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#FF9800' }}>{orders.filter(o => o.status === 'new').length}</div>
                <div style={{ fontSize: 14, color: '#666' }}>Новых</div>
              </div>
              <div style={{ padding: 16, background: '#E8F5E9', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#4CAF50' }}>{orders.filter(o => o.status === 'processed').length}</div>
                <div style={{ fontSize: 14, color: '#666' }}>Обработано</div>
              </div>
              <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#666' }}>{orders.filter(o => o.status === 'completed').length}</div>
                <div style={{ fontSize: 14, color: '#666' }}>Завершено</div>
              </div>
            </div>

            {orders.map(order => (
              <div key={order.id} style={{ padding: 16, background: '#fafafa', borderRadius: 8, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: 16 }}>{order.company}</div>
                  <div style={{ fontSize: 14, color: '#666' }}>{order.contact} • {order.phone}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>{order.date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: 16, fontSize: 12,
                    background: order.status === 'new' ? '#FFF3E0' : order.status === 'processed' ? '#E3F2FD' : '#E8F5E9',
                    color: order.status === 'new' ? '#FF9800' : order.status === 'processed' ? '#1976D2' : '#4CAF50'
                  }}>
                    {order.status === 'new' ? 'Новая' : order.status === 'processed' ? 'Обработана' : 'Завершена'}
                  </span>
                  <button style={{ padding: '8px 16px', background: '#1976D2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Обработать</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* БОТЫ */}
        {tab === 'bots' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>🤖 Настройка ботов (до 5)</h3>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>Добавьте до 5 ботов для разных компаний</p>
            
            {ADMIN_CONFIG.bots.map(bot => (
              <div key={bot.id} style={{ padding: 16, background: '#fafafa', borderRadius: 8, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontWeight: '600' }}>{bot.name}</div>
                  <span style={{ padding: '4px 12px', borderRadius: 16, fontSize: 12, background: bot.active ? '#E8F5E9' : '#f5f5f5', color: bot.active ? '#4CAF50' : '#999' }}>
                    {bot.active ? 'Активен' : 'Неактивен'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#666', fontFamily: 'monospace' }}>{bot.token}</div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button style={{ padding: '8px 16px', background: '#1976D2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Редактировать</button>
                  <button style={{ padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Удалить</button>
                </div>
              </div>
            ))}

            <button style={{ ...buttonPrimaryStyle, background: '#4CAF50' }}>+ Добавить бота</button>
          </div>
        )}

        {/* ГРУППЫ */}
        {tab === 'groups' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>👥 Настройка групп и тем (до 5)</h3>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>Настройте группы для получения уведомлений</p>
            
            {ADMIN_CONFIG.groups.map(group => (
              <div key={group.id} style={{ padding: 16, background: '#fafafa', borderRadius: 8, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontWeight: '600' }}>{group.name}</div>
                  <span style={{ padding: '4px 12px', borderRadius: 16, fontSize: 12, background: group.active ? '#E8F5E9' : '#f5f5f5', color: group.active ? '#4CAF50' : '#999' }}>
                    {group.active ? 'Активна' : 'Неактивна'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>ID: {group.chatId}</div>
                <div style={{ fontSize: 13, color: '#1976D2', marginBottom: 8 }}><a href={group.link}>{group.link}</a></div>
                
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <input type="checkbox" checked={group.forNewOrders} readOnly /> Новые заявки
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <input type="checkbox" checked readOnly /> Комментарии
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <input type="checkbox" checked readOnly /> Новые клиенты
                  </label>
                </div>

                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button style={{ padding: '8px 16px', background: '#1976D2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Редактировать</button>
                  <button style={{ padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Удалить</button>
                </div>
              </div>
            ))}

            <button style={{ ...buttonPrimaryStyle, background: '#4CAF50' }}>+ Добавить группу</button>
          </div>
        )}

        {/* КЛИЕНТЫ */}
        {tab === 'clients' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>🏢 Клиенты с договором</h3>
            
            {Object.entries(MOCK_CONTRACTS).map(([num, c]) => (
              <div key={num} style={{ padding: 16, background: '#fafafa', borderRadius: 8, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: 16 }}>{c.company}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>Договор: {num}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{c.contact} • {c.phone}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: '#4CAF50' }}>{c.discount}% скидка</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{c.staff.regular + c.staff.halal + c.staff.pp + c.staff.director} чел.</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // === ЛИЧНЫЙ КАБИНЕТ ===
  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, margin: 0, color: '#1976D2' }}>🍽️ Питание СПБ</h1>
        <button onClick={() => { setCurrentClient(null); setContractNumber('') }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Выход</button>
      </div>

      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>{currentClient.company}</h2>
            <p style={{ margin: '4px 0', color: '#666' }}>ИНН: {currentClient.inn}</p>
            <p style={{ margin: '4px 0', color: '#666' }}>{currentClient.contact} • {currentClient.phone}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ background: '#4CAF50', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>Договор подписан</span>
            {currentClient.discount > 0 && (
              <div style={{ marginTop: 8, background: '#FF9800', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>🎁 Скидка {currentClient.discount}%</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
        {[{ id: 'dashboard', name: '📊 Дашборд' }, { id: 'menu', name: '🍴 Меню' }, { id: 'orders', name: '📋 Заказы' }, { id: 'settings', name: '⚙️ Настройки' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: '12px 16px', border: 'none', borderRadius: 8,
              background: tab === t.id ? '#1976D2' : '#fff', color: tab === t.id ? '#fff' : '#333',
              cursor: 'pointer', fontSize: 14, fontWeight: '600', whiteSpace: 'nowrap'
            }}>{t.name}</button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <>
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>📊 Статистика</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 16, background: '#E3F2FD', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1976D2' }}>{todayOrders?.staff || 0}</div>
                <div style={{ fontSize: 14, color: '#666' }}>человек сегодня</div>
              </div>
              <div style={{ padding: 16, background: '#E8F5E9', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#4CAF50' }}>{(todayOrders?.total || 0).toLocaleString()}₽</div>
                <div style={{ fontSize: 14, color: '#666' }}>стоимость</div>
              </div>
            </div>
            <div style={{ padding: 16, background: '#FFF3E0', borderRadius: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>📈 За неделю:</div>
              <div>Среднее: <b>{weekStaff}</b> чел/день • <b>{(weekTotal/1000).toFixed(1)}к ₽</b></div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>🎁 Скидка: {currentClient.discount}%</h3>
            <p style={{ fontSize: 14, color: '#666' }}>При фиксированном количестве на 1 год</p>
          </div>

          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>📝 Корректировка</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Выходные: {adjustments.weekend}%</label>
              <input type="range" min="-50" max="0" value={adjustments.weekend}
                onChange={(e) => setAdjustments({...adjustments, weekend: parseInt(e.target.value)})} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Праздники: {adjustments.holiday}%</label>
              <input type="range" min="-50" max="0" value={adjustments.holiday}
                onChange={(e) => setAdjustments({...adjustments, holiday: parseInt(e.target.value)})} style={{ width: '100%' }} />
            </div>
            <textarea value={adjustmentNote} onChange={(e) => setAdjustmentNote(e.target.value)}
              placeholder="Комментарий..." style={{ ...inputStyle, height: 60 }} />
            <button onClick={handleSaveAdjustments} style={buttonPrimaryStyle}>💾 Сохранить</button>
          </div>
        </>
      )}

      {tab === 'menu' && (
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>🍴 Меню</h3>
          <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} style={{...inputStyle, marginBottom: 20}}>
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(d => <option key={d} value={d}>{DAYS_RU[d]}</option>)}
          </select>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {FOOD_TYPES.map(type => (
              <button key={type.id} onClick={() => toggleFoodType(type.id)}
                style={{
                  padding: '10px 14px', border: selectedFoodTypes.includes(type.id) ? '2px solid #1976D2' : '2px solid #e0e0e0',
                  borderRadius: 8, background: selectedFoodTypes.includes(type.id) ? '#E3F2FD' : '#fafafa', cursor: 'pointer', fontSize: 14
                }}>{type.emoji} {type.name}</button>
            ))}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 12, textAlign: 'left' }}>Приём</th>
                {selectedFoodTypes.map(type => (
                  <th key={type.id} style={{ padding: 12, textAlign: 'center' }}>{FOOD_TYPES.find(f => f.id === type.id)?.emoji}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEALS.filter(m => selectedMeals.includes(m.id)).map(meal => (
                <tr key={meal.id}>
                  <td style={{ padding: 12 }}>{MEALS.find(m => m.id === meal.id)?.emoji} {MEALS.find(m => m.id === meal.id)?.name}</td>
                  {selectedFoodTypes.map(type => (
                    <td key={type.id} style={{ padding: 12, textAlign: 'center' }}>
                      <span style={{ background: '#E8F5E9', padding: '4px 12px', borderRadius: 16, fontWeight: '600' }}>{getPrice(type, meal.id)}₽</span>
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
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>📋 История</h3>
          {ORDER_HISTORY.slice(0, 5).map((order, i) => (
            <div key={i} style={{ padding: 12, background: '#fafafa', borderRadius: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: '600' }}>{DAYS_RU[order.day]}</div>
                <div style={{ fontSize: 13, color: '#666' }}>{order.staff} чел</div>
              </div>
              <div style={{ fontWeight: 'bold', color: '#4CAF50' }}>{order.total.toLocaleString()}₽</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'settings' && (
        <>
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>💰 Оплата</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 14, background: '#f5f5f5', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Форма</div>
                <div style={{ fontWeight: '600' }}>{getPaymentMethodName(currentClient.paymentMethod)}</div>
              </div>
              <div style={{ padding: 14, background: '#f5f5f5', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Период</div>
                <div style={{ fontWeight: '600' }}>{getPaymentPeriodName(currentClient.paymentPeriod)}</div>
              </div>
            </div>
          </div>
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>💬 Сообщение менеджеру</h3>
            {commentSent ? (
              <div style={{ padding: 16, background: '#E8F5E9', borderRadius: 8, textAlign: 'center' }}>
                <p style={{ color: '#4CAF50' }}>✅ Отправлено!</p>
                <button onClick={() => setCommentSent(false)} style={{ background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer' }}>Ещё</button>
              </div>
            ) : (
              <>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Ваше сообщение..." style={{ ...inputStyle, height: 100 }} />
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