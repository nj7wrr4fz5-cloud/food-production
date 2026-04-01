import { useState } from 'react'

const COMPANY_TYPES = [
  { id: 'office', name: 'Офис', desc: 'Ежедневный выбор блюд', emoji: '🏢' },
  { id: 'plant', name: 'Производство', desc: 'Недельное меню', emoji: '🏭' },
  { id: 'quarter', name: 'Квартал', desc: 'Меню на квартал', emoji: '📅' }
]

// Цены по типам питания
const PRICES = {
  regular: { breakfast: 280, lunch: 420, dinner: 380, night: 420 },
  halal: { breakfast: 320, lunch: 480, dinner: 440, night: 480 },
  pp: { breakfast: 350, lunch: 520, dinner: 460, night: 520 },
  director: { breakfast: 420, lunch: 620, dinner: 560, night: 620 } // +20%
}

const FOOD_TYPES = [
  { id: 'regular', name: 'Обычное', emoji: '🍽️', price: 280 },
  { id: 'halal', name: 'Халяль', emoji: '🥩', price: 320 },
  { id: 'pp', name: 'ПП', emoji: '🥗', price: 350 },
  { id: 'director', name: 'Директорат +20%', emoji: '👔', price: 420 }
]

const MEALS = [
  { id: 'breakfast', name: 'Завтрак', emoji: '🥐' },
  { id: 'lunch', name: 'Обед', emoji: '🍱' },
  { id: 'dinner', name: 'Ужин', emoji: '🍽️' },
  { id: 'night', name: 'Ночной обед', emoji: '🌙' }
]

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAYS_RU = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье'
}

// Тестовые данные для клиента с договором
const MOCK_CLIENT = {
  company: 'ООО ТехноСтрой',
  inn: '7812345678',
  contact: 'Петров Сергей',
  phone: '+7 (999) 123-45-67',
  email: 'petrov@tehno.ru',
  address: 'г. Санкт-Петербург, ул. Новая, д. 10',
  companyType: 'office',
  contractDate: '2025-01-15',
  staff: { regular: 45, halal: 12, pp: 8, director: 3 }
}

const inputStyle = {
  width: '100%',
  padding: '14px',
  fontSize: 16,
  borderRadius: 8,
  border: '2px solid #e0e0e0',
  marginBottom: 16,
  boxSizing: 'border-box',
  background: '#fff'
}

const labelStyle = {
  fontWeight: '600',
  display: 'block',
  marginBottom: 8,
  fontSize: 14,
  color: '#333'
}

const sectionStyle = {
  background: '#fff',
  padding: 20,
  borderRadius: 12,
  marginBottom: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
}

const buttonPrimaryStyle = {
  width: '100%',
  background: '#1976D2',
  color: '#fff',
  border: 'none',
  padding: '16px',
  borderRadius: 8,
  fontSize: 16,
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: 8
}

function App() {
  const [view, setView] = useState('login') // login, new-user, cabinet
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [companyType, setCompanyType] = useState('office')
  const [selectedMeals, setSelectedMeals] = useState([])
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([])
  const [selectedDay, setSelectedDay] = useState('monday')
  
  const [client, setClient] = useState({
    company: '',
    inn: '',
    contact: '',
    phone: '',
    email: '',
    address: ''
  })

  const [staff, setStaff] = useState({
    regular: 0,
    halal: 0,
    pp: 0,
    director: 0
  })

  const totalStaff = staff.regular + staff.halal + staff.pp + staff.director

  const toggleMeal = (mealId) => {
    setSelectedMeals(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    )
  }

  const toggleFoodType = (typeId) => {
    setSelectedFoodTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    )
  }

  const handleNewUserSubmit = (e) => {
    e.preventDefault()
    if (client.company && client.contact && client.phone) {
      alert('Заявка отправлена! Менеджер свяжется с вами для заключения договора.')
      setView('login')
    }
  }

  const handleLogin = (type) => {
    if (type === 'new') {
      setView('new-user')
    } else {
      // Имитация входа клиента с договором
      setIsLoggedIn(true)
    }
  }

  const getPrice = (foodType, meal) => PRICES[foodType]?.[meal] || 0

  const getTotalPrice = () => {
    let total = 0
    selectedMeals.forEach(meal => {
      selectedFoodTypes.forEach(type => {
        total += getPrice(type, meal)
      })
    })
    return total
  }

  // === ВХОД ===
  if (!isLoggedIn && view === 'login') {
    return (
      <div style={{ padding: 16, maxWidth: 500, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <h1 style={{ fontSize: 32, marginBottom: 8, color: '#1976D2' }}>🍽️ Питание СПБ</h1>
          <p style={{ color: '#666', fontSize: 18 }}>Корпоративное питание</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 20, textAlign: 'center' }}>Вход в систему</h2>
          
          <button 
            onClick={() => handleLogin('existing')}
            style={{...buttonPrimaryStyle, background: '#4CAF50'}}
          >
            🔐 Войти как клиент с договором
          </button>

          <button 
            onClick={() => handleLogin('new')}
            style={{...buttonPrimaryStyle, background: '#1976D2', marginTop: 12}}
          >
            🔓 Новый пользователь / Оставить заявку
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, color: '#999', fontSize: 14 }}>
          По вопросам: +7 (812) 123-45-67
        </div>
      </div>
    )
  }

  // === НОВЫЙ ПОЛЬЗОВАТЕЛЬ ===
  if (view === 'new-user') {
    return (
      <div style={{ padding: 16, maxWidth: 600, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
        <button 
          onClick={() => setView('login')}
          style={{ background: 'none', border: 'none', color: '#1976D2', cursor: 'pointer', marginBottom: 16, fontSize: 16 }}
        >
          ← Назад
        </button>

        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 20, color: '#333', fontSize: 18 }}>
            📋 Заявка на поставку питания
          </h2>
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
            <input type="text" placeholder="г. Санкт-Петербург, ул. Примерная, д. 1" value={client.address}
              onChange={(e) => setClient({...client, address: e.target.value})} style={inputStyle} />

            <label style={labelStyle}>Тип предприятия:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {COMPANY_TYPES.map(type => (
                <button key={type.id} type="button" onClick={() => setCompanyType(type.id)}
                  style={{
                    padding: '16px 20px',
                    border: companyType === type.id ? '2px solid #1976D2' : '2px solid #e0e0e0',
                    borderRadius: 10,
                    background: companyType === type.id ? '#E3F2FD' : '#fafafa',
                    cursor: 'pointer', textAlign: 'left', fontSize: 16
                  }}>
                  <span style={{ fontSize: 22, marginRight: 12 }}>{type.emoji}</span>
                  <b>{type.name}</b>
                  <span style={{ color: '#666', fontSize: 14, marginLeft: 10 }}>{type.desc}</span>
                </button>
              ))}
            </div>

            <button type="submit" style={buttonPrimaryStyle}>
              📤 Отправить заявку
            </button>
          </form>
        </div>
      </div>
    )
  }

  // === ЛИЧНЫЙ КАБИНЕТ КЛИЕНТА ===
  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, margin: 0, color: '#1976D2' }}>🍽️ Питание СПБ</h1>
        <button onClick={() => setIsLoggedIn(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
          Выход
        </button>
      </div>

      {/* Карточка клиента */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>{MOCK_CLIENT.company}</h2>
            <p style={{ margin: '4px 0', color: '#666' }}>ИНН: {MOCK_CLIENT.inn}</p>
            <p style={{ margin: '4px 0', color: '#666' }}>{MOCK_CLIENT.contact} • {MOCK_CLIENT.phone}</p>
            <p style={{ margin: '4px 0', color: '#666' }}>📍 {MOCK_CLIENT.address}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ background: '#4CAF50', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>
              Договор подписан
            </span>
            <p style={{ margin: '4px 0', color: '#999', fontSize: 12 }}>от {MOCK_CLIENT.contractDate}</p>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div style={sectionStyle}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>📊 Статистика питания</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ padding: 16, background: '#E3F2FD', borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1976D2' }}>{MOCK_CLIENT.staff.regular + MOCK_CLIENT.staff.halal + MOCK_CLIENT.staff.pp + MOCK_CLIENT.staff.director}</div>
            <div style={{ fontSize: 14, color: '#666' }}>человек всего</div>
          </div>
          <div style={{ padding: 16, background: '#E8F5E9', borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#4CAF50' }}>5</div>
            <div style={{ fontSize: 14, color: '#666' }}>дней в неделю</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>{(MOCK_CLIENT.staff.regular + MOCK_CLIENT.staff.halal + MOCK_CLIENT.staff.pp + MOCK_CLIENT.staff.director) * 5}</div>
            <div style={{ fontSize: 12, color: '#666' }}>в день</div>
          </div>
          <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>{(MOCK_CLIENT.staff.regular + MOCK_CLIENT.staff.halal + MOCK_CLIENT.staff.pp + MOCK_CLIENT.staff.director) * 22}</div>
            <div style={{ fontSize: 12, color: '#666' }}>в месяц</div>
          </div>
          <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>{(MOCK_CLIENT.staff.regular + MOCK_CLIENT.staff.halal + MOCK_CLIENT.staff.pp + MOCK_CLIENT.staff.director) * 66}</div>
            <div style={{ fontSize: 12, color: '#666' }}>в квартал</div>
          </div>
        </div>
      </div>

      {/* Меню */}
      <div style={sectionStyle}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>🍴 Меню на неделю</h3>
        
        <label style={labelStyle}>Выберите день:</label>
        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}
          style={{...inputStyle, marginBottom: 20}}>
          {DAYS.map(d => (
            <option key={d} value={d}>{DAYS_RU[d]}</option>
          ))}
        </select>

        <label style={labelStyle}>Типы питания:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {FOOD_TYPES.map(type => (
            <button key={type.id} onClick={() => toggleFoodType(type.id)}
              style={{
                padding: '10px 14px',
                border: selectedFoodTypes.includes(type.id) ? '2px solid #1976D2' : '2px solid #e0e0e0',
                borderRadius: 8,
                background: selectedFoodTypes.includes(type.id) ? '#E3F2FD' : '#fafafa',
                cursor: 'pointer', fontSize: 14
              }}>
              {type.emoji} {type.name}
            </button>
          ))}
        </div>

        {/* Таблица цен */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Приём пищи</th>
                {selectedFoodTypes.map(type => (
                  <th key={type.id} style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #ddd' }}>
                    {type.emoji} {type.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEALS.map(meal => (
                <tr key={meal.id}>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    {meal.emoji} {meal.name}
                  </td>
                  {selectedFoodTypes.map(type => (
                    <td key={type.id} style={{ padding: 12, textAlign: 'center', borderBottom: '1px solid #eee' }}>
                      <span style={{ 
                        background: type.id === 'director' ? '#FFF3E0' : '#E8F5E9',
                        padding: '4px 12px',
                        borderRadius: 16,
                        fontWeight: '600',
                        color: type.id === 'director' ? '#E65100' : '#2E7D32'
                      }}>
                        {getPrice(type.id, meal.id)}₽
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedFoodTypes.length > 0 && (
          <div style={{ marginTop: 20, padding: 16, background: '#E3F2FD', borderRadius: 10 }}>
            <div style={{ fontSize: 14, color: '#666' }}>Стоимость в день (все приёмы пищи):</div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1976D2' }}>
              {selectedFoodTypes.reduce((sum, type) => 
                selectedMeals.reduce((s, meal) => s + getPrice(type.id, meal.id), sum), 0)}₽
            </div>
          </div>
        )}
      </div>

      {/* Время доставки */}
      <div style={sectionStyle}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>🚚 Время доставки</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ padding: 12, background: '#fafafa', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>🥐 Завтрак</span>
            <span style={{ fontWeight: '600' }}>07:30 - 08:30</span>
          </div>
          <div style={{ padding: 12, background: '#fafafa', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>🍱 Обед</span>
            <span style={{ fontWeight: '600' }}>12:00 - 13:00</span>
          </div>
          <div style={{ padding: 12, background: '#fafafa', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>🍽️ Ужин</span>
            <span style={{ fontWeight: '600' }}>17:30 - 18:30</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App