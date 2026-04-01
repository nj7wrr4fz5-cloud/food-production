import { useState } from 'react'

const COMPANY_TYPES = [
  { id: 'office', name: 'Офис', desc: 'Ежедневный выбор блюд', emoji: '🏢' },
  { id: 'plant', name: 'Производство', desc: 'Недельное меню', emoji: '🏭' },
  { id: 'quarter', name: 'Квартал', desc: 'Меню на квартал', emoji: '📅' }
]

// Типы питания для офисов
const OFFICE_MEALS = [
  { id: 'breakfast', name: 'Завтрак', price: 280, emoji: '🥐' },
  { id: 'lunch', name: 'Обед', price: 420, emoji: '🍱' },
  { id: 'dinner', name: 'Ужин', price: 380, emoji: '🍽️' }
]

// Комплексы для производства и квартала
const COMPLEXES = [
  { id: 'breakfast', name: 'Завтрак', price: 280, emoji: '🥐' },
  { id: 'lunch', name: 'Обед', price: 420, emoji: '🍱' },
  { id: 'dinner', name: 'Ужин', price: 380, emoji: '🍽️' },
  { id: 'night', name: 'Ночной обед', price: 420, emoji: '🌙' }
]

const FOOD_TYPES = [
  { id: 'regular', name: 'Обычное', emoji: '🍽️' },
  { id: 'halal', name: 'Халяль', emoji: '🥩' },
  { id: 'pp', name: 'ПП', emoji: '🥗' },
  { id: 'special', name: 'Специальное', emoji: '⭐' }
]

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

const buttonSecondaryStyle = {
  width: '100%',
  background: '#f5f5f5',
  color: '#666',
  border: 'none',
  padding: '14px',
  borderRadius: 8,
  fontSize: 14,
  cursor: 'pointer',
  marginTop: 8
}

function App() {
  const [step, setStep] = useState(1)
  const [companyType, setCompanyType] = useState('office')
  const [selectedMeals, setSelectedMeals] = useState([])
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([])
  
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
    special: 0
  })

  const totalStaff = staff.regular + staff.halal + staff.pp + staff.special

  const meals = companyType === 'office' ? OFFICE_MEALS : COMPLEXES

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

  const handleCompanySubmit = (e) => {
    e.preventDefault()
    if (client.company && client.contact && client.phone) {
      setStep(2)
    }
  }

  const handleStaffSubmit = (e) => {
    e.preventDefault()
    if (totalStaff > 0) {
      setStep(3)
    }
  }

  const handleOrderSubmit = (e) => {
    e.preventDefault()
    if (selectedMeals.length > 0 && selectedFoodTypes.length > 0) {
      alert('Заявка отправлена! Менеджер свяжется с вами для заключения договора.')
    }
  }

  const getSelectedMeals = () => meals.filter(m => selectedMeals.includes(m.id))
  const getSelectedFoodTypes = () => FOOD_TYPES.filter(f => selectedFoodTypes.includes(f.id))

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: '0 auto', fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <h1 style={{ fontSize: 28, marginBottom: 4, color: '#1976D2' }}>🍽️ Питание СПБ</h1>
        <p style={{ color: '#666', marginTop: 0 }}>Система заказа корпоративного питания</p>
      </div>

      {/* ШАГ 1: Карточка клиента */}
      {step === 1 && (
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 20, color: '#333', fontSize: 18 }}>
            📋 Заявка на поставку питания
          </h2>
          <form onSubmit={handleCompanySubmit}>
            <label style={labelStyle}>Название компании *</label>
            <input
              type="text"
              placeholder="ООО Ромашка"
              value={client.company}
              onChange={(e) => setClient({...client, company: e.target.value})}
              style={inputStyle}
              required
            />

            <label style={labelStyle}>ИНН</label>
            <input
              type="text"
              placeholder="1234567890"
              value={client.inn}
              onChange={(e) => setClient({...client, inn: e.target.value})}
              style={inputStyle}
            />

            <label style={labelStyle}>Контактное лицо *</label>
            <input
              type="text"
              placeholder="Иван Иванов"
              value={client.contact}
              onChange={(e) => setClient({...client, contact: e.target.value})}
              style={inputStyle}
              required
            />

            <label style={labelStyle}>Телефон *</label>
            <input
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={client.phone}
              onChange={(e) => setClient({...client, phone: e.target.value})}
              style={inputStyle}
              required
            />

            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="info@company.ru"
              value={client.email}
              onChange={(e) => setClient({...client, email: e.target.value})}
              style={inputStyle}
            />

            <label style={labelStyle}>Адрес доставки</label>
            <input
              type="text"
              placeholder="г. Санкт-Петербург, ул. Примерная, д. 1"
              value={client.address}
              onChange={(e) => setClient({...client, address: e.target.value})}
              style={inputStyle}
            />

            <label style={labelStyle}>Тип предприятия:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {COMPANY_TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => { setCompanyType(type.id); setSelectedMeals([]) }}
                  style={{
                    padding: '16px 20px',
                    border: companyType === type.id ? '2px solid #1976D2' : '2px solid #e0e0e0',
                    borderRadius: 10,
                    background: companyType === type.id ? '#E3F2FD' : '#fafafa',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 16,
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: 22, marginRight: 12 }}>{type.emoji}</span>
                  <b style={{ color: '#333' }}>{type.name}</b>
                  <span style={{ color: '#666', fontSize: 14, marginLeft: 10 }}>{type.desc}</span>
                </button>
              ))}
            </div>

            <button type="submit" style={buttonPrimaryStyle}>
              Продолжить →
            </button>
          </form>
        </div>
      )}

      {/* ШАГ 2: Количество сотрудников */}
      {step === 2 && (
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 20, color: '#333', fontSize: 18 }}>
            👥 Количество сотрудников
          </h2>
          
          <div style={{ padding: 16, background: '#E3F2FD', borderRadius: 10, marginBottom: 20 }}>
            <div style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#1976D2' }}>
              Всего сотрудников: {totalStaff}
            </div>
          </div>

          <form onSubmit={handleStaffSubmit}>
            {FOOD_TYPES.map(type => (
              <div key={type.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '14px 16px',
                background: '#fafafa',
                borderRadius: 10,
                marginBottom: 10
              }}>
                <span>
                  <span style={{ fontSize: 20, marginRight: 10 }}>{type.emoji}</span>
                  <b style={{ color: '#333' }}>{type.name}</b>
                </span>
                <input
                  type="number"
                  min="0"
                  value={staff[type.id]}
                  onChange={(e) => setStaff({...staff, [type.id]: parseInt(e.target.value) || 0})}
                  style={{
                    width: '90px',
                    padding: '10px',
                    fontSize: 16,
                    borderRadius: 8,
                    border: '2px solid #e0e0e0',
                    textAlign: 'center'
                  }}
                />
              </div>
            ))}

            <button type="submit" disabled={totalStaff === 0} style={{
              ...buttonPrimaryStyle,
              background: totalStaff > 0 ? '#1976D2' : '#ccc'
            }}>
              Продолжить →
            </button>

            <button type="button" onClick={() => setStep(1)} style={buttonSecondaryStyle}>
              ← Назад
            </button>
          </form>
        </div>
      )}

      {/* ШАГ 3: Выбор питания */}
      {step === 3 && (
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 20, color: '#333', fontSize: 18 }}>
            🍴 Выбор типа питания
          </h2>

          {/* Сводка */}
          <div style={{ padding: 14, background: '#f5f7fa', borderRadius: 10, marginBottom: 20 }}>
            <div style={{ fontWeight: '600', marginBottom: 6 }}>{client.company}</div>
            <div style={{ fontSize: 14, color: '#666' }}>{client.contact} • {client.phone}</div>
            <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
              <b>Тип:</b> {COMPANY_TYPES.find(c => c.id === companyType)?.name} • 
              <b>Сотрудников:</b> {totalStaff}
            </div>
          </div>

          {/* Выбор приёмов пищи */}
          <label style={labelStyle}>Выберите приёмы пищи:</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {meals.map(meal => (
              <button
                key={meal.id}
                type="button"
                onClick={() => toggleMeal(meal.id)}
                style={{
                  padding: '16px 20px',
                  border: selectedMeals.includes(meal.id) ? '2px solid #4CAF50' : '2px solid #e0e0e0',
                  borderRadius: 10,
                  background: selectedMeals.includes(meal.id) ? '#E8F5E9' : '#fafafa',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>
                  <span style={{ fontSize: 22, marginRight: 12 }}>{meal.emoji}</span>
                  <b>{meal.name}</b>
                </span>
                <span style={{ color: '#4CAF50', fontWeight: '600' }}>{meal.price}₽</span>
              </button>
            ))}
          </div>

          {/* Выбор типа питания */}
          <label style={labelStyle}>Выберите типы питания:</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {FOOD_TYPES.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => toggleFoodType(type.id)}
                style={{
                  padding: '16px 20px',
                  border: selectedFoodTypes.includes(type.id) ? '2px solid #1976D2' : '2px solid #e0e0e0',
                  borderRadius: 10,
                  background: selectedFoodTypes.includes(type.id) ? '#E3F2FD' : '#fafafa',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 16
                }}
              >
                <span style={{ fontSize: 22, marginRight: 12 }}>{type.emoji}</span>
                <b>{type.name}</b>
              </button>
            ))}
          </div>

          {/* Итог */}
          {selectedMeals.length > 0 && selectedFoodTypes.length > 0 && (
            <div style={{ padding: 16, background: '#E8F5E9', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Предварительный итог:</div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>
                <b>Приёмы пищи:</b> {getSelectedMeals().map(m => m.name).join(', ')}
              </div>
              <div style={{ fontSize: 14 }}>
                <b>Типы питания:</b> {getSelectedFoodTypes().map(f => f.name).join(', ')}
              </div>
            </div>
          )}

          <button 
            onClick={handleOrderSubmit}
            disabled={selectedMeals.length === 0 || selectedFoodTypes.length === 0}
            style={{
              ...buttonPrimaryStyle,
              background: (selectedMeals.length > 0 && selectedFoodTypes.length > 0) ? '#4CAF50' : '#ccc'
            }}
          >
            📤 Отправить заявку на договор
          </button>

          <button type="button" onClick={() => setStep(2)} style={buttonSecondaryStyle}>
            ← Назад
          </button>
        </div>
      )}
    </div>
  )
}

export default App