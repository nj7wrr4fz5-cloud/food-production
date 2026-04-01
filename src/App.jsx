import { useState, useEffect } from 'react'

const COMPANY_TYPES = [
  { id: 'office', name: 'Офис', desc: 'Ежедневный выбор блюд', emoji: '🏢' },
  { id: 'plant', name: 'Производство', desc: 'Недельное меню', emoji: '🏭' },
  { id: 'quarter', name: 'Квартал', desc: 'Меню на квартал', emoji: '📅' }
]

const CLIENTS_DB = {
  'TEST-001': {
    id: 'TEST-001',
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
    active: true,
    featured: true,
    discount: 10,
    discountType: 'annual',
    staff: { regular: 45, halal: 12, pp: 8, director: 3 },
    meals: ['breakfast', 'lunch', 'dinner'],
    deliveryTime: { breakfast: '07:30-08:30', lunch: '12:00-13:00', dinner: '17:30-18:30' },
    manager: { name: 'Анна', phone: '+7 (999) 000-11-22' },
    adminComment: '',
    commentDate: null
  },
  'TEST-002': {
    id: 'TEST-002',
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
    active: true,
    featured: false,
    discount: 5,
    discountType: 'annual',
    staff: { regular: 20, halal: 5, pp: 0, director: 1 },
    meals: ['lunch', 'dinner'],
    deliveryTime: { breakfast: '', lunch: '12:00-13:00', dinner: '17:30-18:30' },
    manager: { name: 'Анна', phone: '+7 (999) 000-11-22' },
    adminComment: 'VIP клиент',
    commentDate: '2025-03-15'
  }
}

const ORDER_HISTORY = [
  { date: '2026-03-31', day: 'monday', meals: { breakfast: 45, lunch: 68, dinner: 45 }, total: 85400, staff: 68 },
  { date: '2026-03-28', day: 'friday', meals: { breakfast: 44, lunch: 66, dinner: 44 }, total: 83120, staff: 66 },
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
  { id: 'director', name: 'Директорат', emoji: '👔' }
]

const MEALS = [
  { id: 'breakfast', name: 'Завтрак', emoji: '🥐' },
  { id: 'lunch', name: 'Обед', emoji: '🍱' },
  { id: 'dinner', name: 'Ужин', emoji: '🍽️' },
  { id: 'night', name: 'Ночной', emoji: '🌙' }
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

function App() {
  const [view, setView] = useState('login')
  const [tab, setTab] = useState('clients')
  const [contractNumber, setContractNumber] = useState('')
  const [loginError, setLoginError] = useState('')
  const [currentClient, setCurrentClient] = useState(null)
  const [clients, setClients] = useState(CLIENTS_DB)
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

  // Hash роутинг
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash === 'admin') {
      setView('admin')
    } else if (hash === 'new') {
      setView('new-user')
    }
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
      const message = `📋 *Новая заявка!*\n*Компания:* ${client.company}\n*Контакт:* ${client.contact}\n*Телефон:* ${client.phone}`
      try {
        await fetch(`https://api.telegram.org/bot6706048508:AAF-8INmBKwP1x7DA-_ET8D282c5pp0Rn2Y/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: '-1002583331823', text: message, parse_mode: 'Markdown' })
        })
      } catch (err) {}
      alert('Заявка отправлена!')
      navigate('login')
    }
  }

  const handleSendComment = async () => {
    if (comment.trim() && currentClient) {
      const message = `💬 *${currentClient.company}:*\n${comment}`
      try {
        await fetch(`https://api.telegram.org/bot6706048508:AAF-8INmBKwP1x7DA-_ET8D282c5pp0Rn2Y/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: '-1002583331823', text: message, parse_mode: 'Markdown' })
        })
      } catch (err) {}
      alert('Отправлено!')
      setComment('')
      setCommentSent(true)
    }
  }

  const saveClientEdit = () => {
    if (editingClient) {
      setClients(prev => ({ ...prev, [editingClient.id]: editingClient }))
      setEditingClient(null)
      alert('Сохранено!')
    }
  }

  const getPrice = (foodType, meal) => PRICES[foodType]?.[meal] || 0
  const getPaymentMethodName = (id) => PAYMENT_METHODS.find(p => p.id === id)?.name || id
  const getPaymentPeriodName = (id) => PAYMENT_PERIODS.find(p => p.id === id)?.name || id

  const todayOrders = ORDER_HISTORY[0]

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
          <h1 style={{ fontSize: 22, margin: 0, color: '#1976D2' }}>⚙️ Админ</h1>
          <button onClick={() => navigate('login')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Выход</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
          {[{ id: 'clients', name: '🏢 Клиенты' }, { id: 'orders', name: '📋 Заявки' }].map(t => (
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
                  <button onClick={() => setEditingClient({...c})} style={{ padding: '8px 16px', background: '#1976D2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Изменить</button>
                </div>
                {c.adminComment && (
                  <div style={{ padding: 10, background: '#FFF3E0', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>
                    💬 {c.adminComment}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontSize: 13 }}>
                  <div>Скидка: <b>{c.discount}%</b></div>
                  <div>Оплата: <b>{getPaymentMethodName(c.paymentMethod)}</b></div>
                  <div>Менеджер: <b>{c.manager.name}</b></div>
                  <div>Тел: <b>{c.manager.phone}</b></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'orders' && (
          <div style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>Заявки</h3>
            <div style={{ padding: 12, background: '#fafafa', borderRadius: 8 }}>
              <div style={{ fontWeight: '600' }}>ООО Ромашка</div>
              <div style={{ fontSize: 13, color: '#666' }}>Иванов • +7(999)111-22-33</div>
              <span style={{ padding: '4px 12px', background: '#FFF3E0', borderRadius: 16, fontSize: 12 }}>Новая</span>
            </div>
          </div>
        )}

        {editingClient && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 16, maxWidth: 600, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>Редактирование</h2>

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

              <label style={labelStyle}>Оплата:</label>
              <select value={editingClient.paymentMethod} onChange={(e) => setEditingClient({...editingClient, paymentMethod: e.target.value})} style={inputStyle}>
                {PAYMENT_METHODS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              <label style={labelStyle}>Период:</label>
              <select value={editingClient.paymentPeriod} onChange={(e) => setEditingClient({...editingClient, paymentPeriod: e.target.value})} style={inputStyle}>
                {PAYMENT_PERIODS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              <label style={labelStyle}>Адрес:</label>
              <input type="text" value={editingClient.address} onChange={(e) => setEditingClient({...editingClient, address: e.target.value})} style={inputStyle} />

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

              <label style={labelStyle}>Время доставки:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                <input type="text" placeholder="Завтрак" value={editingClient.deliveryTime?.breakfast || ''} onChange={(e) => setEditingClient({...editingClient, deliveryTime: {...editingClient.deliveryTime, breakfast: e.target.value}})} style={inputStyle} />
                <input type="text" placeholder="Обед" value={editingClient.deliveryTime?.lunch || ''} onChange={(e) => setEditingClient({...editingClient, deliveryTime: {...editingClient.deliveryTime, lunch: e.target.value}})} style={inputStyle} />
                <input type="text" placeholder="Ужин" value={editingClient.deliveryTime?.dinner || ''} onChange={(e) => setEditingClient({...editingClient, deliveryTime: {...editingClient.deliveryTime, dinner: e.target.value}})} style={inputStyle} />
              </div>

              <label style={labelStyle}>Менеджер:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                <input type="text" placeholder="Имя" value={editingClient.manager?.name || ''} onChange={(e) => setEditingClient({...editingClient, manager: {...editingClient.manager, name: e.target.value}})} style={inputStyle} />
                <input type="text" placeholder="Тел" value={editingClient.manager?.phone || ''} onChange={(e) => setEditingClient({...editingClient, manager: {...editingClient.manager, phone: e.target.value}})} style={inputStyle} />
              </div>

              <label style={labelStyle}>Комментарий клиенту:</label>
              <textarea value={editingClient.adminComment || ''} onChange={(e) => setEditingClient({...editingClient, adminComment: e.target.value, commentDate: new Date().toISOString().split('T')[0]})} style={{ ...inputStyle, height: 80 }} />

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={saveClientEdit} style={{ ...buttonPrimaryStyle, background: '#4CAF50' }}>Сохранить</button>
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
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1976D2' }}>{todayOrders?.staff || 0}</div>
                <div style={{ fontSize: 12, color: '#666' }}>человек</div>
              </div>
              <div style={{ padding: 14, background: '#E8F5E9', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4CAF50' }}>{(todayOrders?.total || 0).toLocaleString()}₽</div>
                <div style={{ fontSize: 12, color: '#666' }}>стоимость</div>
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
          {ORDER_HISTORY.map((order, i) => (
            <div key={i} style={{ padding: 10, background: '#fafafa', borderRadius: 6, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: '600', fontSize: 14 }}>{DAYS_RU[order.day]}</div>
              <div style={{ color: '#4CAF50', fontWeight: '600' }}>{order.total.toLocaleString()}₽</div>
            </div>
          ))}
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
            <h3 style={{ marginTop: 0, fontSize: 14 }}>💬 Сообщение</h3>
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