import { useState, useEffect } from 'react'

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
const DAYS_RU = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница'
}
const FOOD_TYPES = [
  { id: 'regular', name: 'Обычное', emoji: '🍽️' },
  { id: 'halal', name: 'Халяль', emoji: '🥩' }
]
const CATEGORIES = {
  soup: 'Супы',
  main: 'Второе',
  salad: 'Салаты',
  drink: 'Напитки'
}

const SAMPLE_MENU = {
  regular: {
    monday: [
      { id: 'r1', name: 'Борщ', price: 120, category: 'soup' },
      { id: 'r2', name: 'Котлета с пюре', price: 180, category: 'main' },
      { id: 'r3', name: 'Оливье', price: 100, category: 'salad' },
      { id: 'r4', name: 'Чай', price: 30, category: 'drink' }
    ],
    tuesday: [
      { id: 'r5', name: 'Суп грибной', price: 110, category: 'soup' },
      { id: 'r6', name: 'Пельмени', price: 170, category: 'main' },
      { id: 'r7', name: 'Винегрет', price: 90, category: 'salad' },
      { id: 'r8', name: 'Компот', price: 30, category: 'drink' }
    ],
    wednesday: [
      { id: 'r9', name: 'Щи', price: 120, category: 'soup' },
      { id: 'r10', name: 'Гуляш с рисом', price: 190, category: 'main' },
      { id: 'r11', name: 'Мимоза', price: 100, category: 'salad' },
      { id: 'r12', name: 'Кофе', price: 50, category: 'drink' }
    ],
    thursday: [
      { id: 'r13', name: 'Рассольник', price: 120, category: 'soup' },
      { id: 'r14', name: 'Тефтели', price: 175, category: 'main' },
      { id: 'r15', name: 'Цезарь', price: 120, category: 'salad' },
      { id: 'r16', name: 'Сок', price: 40, category: 'drink' }
    ],
    friday: [
      { id: 'r17', name: 'Уха', price: 130, category: 'soup' },
      { id: 'r18', name: 'Рыба с овощами', price: 200, category: 'main' },
      { id: 'r19', name: 'Греческий', price: 110, category: 'salad' },
      { id: 'r20', name: 'Чай', price: 30, category: 'drink' }
    ]
  },
  halal: {
    monday: [
      { id: 'h1', name: 'Лагман', price: 150, category: 'soup' },
      { id: 'h2', name: 'Шурпа', price: 160, category: 'soup' },
      { id: 'h3', name: 'Шашлык', price: 250, category: 'main' },
      { id: 'h4', name: 'Плов', price: 200, category: 'main' }
    ],
    tuesday: [
      { id: 'h5', name: 'Суп из баранины', price: 150, category: 'soup' },
      { id: 'h6', name: 'Манты', price: 180, category: 'main' },
      { id: 'h7', name: 'Люля-кебаб', price: 220, category: 'main' },
      { id: 'h8', name: 'Айран', price: 50, category: 'drink' }
    ],
    wednesday: [
      { id: 'h9', name: 'Чучвара', price: 140, category: 'soup' },
      { id: 'h10', name: 'Бешбармак', price: 210, category: 'main' },
      { id: 'h11', name: 'Долма', price: 180, category: 'main' },
      { id: 'h12', name: 'Компот', price: 30, category: 'drink' }
    ],
    thursday: [
      { id: 'h13', name: 'Мастава', price: 140, category: 'soup' },
      { id: 'h14', name: 'Казан-кабоб', price: 230, category: 'main' },
      { id: 'h15', name: 'Салат овощной', price: 80, category: 'salad' },
      { id: 'h16', name: 'Чай', price: 30, category: 'drink' }
    ],
    friday: [
      { id: 'h17', name: 'Хаш', price: 150, category: 'soup' },
      { id: 'h18', name: 'Басма', price: 200, category: 'main' },
      { id: 'h19', name: 'Свежий салат', price: 90, category: 'salad' },
      { id: 'h20', name: 'Чай', price: 30, category: 'drink' }
    ]
  }
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  fontSize: 16,
  borderRadius: 8,
  border: '2px solid #ddd',
  marginBottom: 12,
  boxSizing: 'border-box'
}

const labelStyle = {
  fontWeight: 'bold',
  display: 'block',
  marginBottom: 8,
  fontSize: 14
}

function App() {
  const [step, setStep] = useState(1) // 1: клиент, 2: меню
  const [foodType, setFoodType] = useState('regular')
  const [day, setDay] = useState('monday')
  const [selectedDishes, setSelectedDishes] = useState([])
  const [mixedStaff, setMixedStaff] = useState(false)
  
  // Данные клиента
  const [client, setClient] = useState({
    company: '',
    contact: '',
    phone: '',
    email: '',
    address: ''
  })

  const menu = SAMPLE_MENU[foodType][day] || []
  const total = selectedDishes.reduce((sum, d) => sum + d.price, 0)

  const toggleDish = (dish) => {
    setSelectedDishes(prev => {
      const exists = prev.find(d => d.id === dish.id)
      if (exists) {
        return prev.filter(d => d.id !== dish.id)
      }
      return [...prev, dish]
    })
  }

  const isSelected = (id) => selectedDishes.some(d => d.id === id)

  const groupedMenu = menu.reduce((acc, dish) => {
    if (!acc[dish.category]) acc[dish.category] = []
    acc[dish.category].push(dish)
    return acc
  }, {})

  const handleClientSubmit = (e) => {
    e.preventDefault()
    if (client.company && client.contact && client.phone) {
      setStep(2)
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 500, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>🍽️ Питание СПБ</h1>
      <p style={{ color: '#666', marginTop: 0 }}>Система заказа питания</p>

      {/* ШАГ 1: Карточка клиента */}
      {step === 1 && (
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 12, marginTop: 16 }}>
          <h2 style={{ marginTop: 0 }}>📋 Данные компании</h2>
          <form onSubmit={handleClientSubmit}>
            <label style={labelStyle}>Название компании *</label>
            <input
              type="text"
              placeholder="ООО Ромашка"
              value={client.company}
              onChange={(e) => setClient({...client, company: e.target.value})}
              style={inputStyle}
              required
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
              placeholder="ул. Примерная, д. 1"
              value={client.address}
              onChange={(e) => setClient({...client, address: e.target.value})}
              style={inputStyle}
            />

            <button type="submit" style={{
              width: '100%',
              background: '#2196F3',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: 8
            }}>
              Продолжить →
            </button>
          </form>
        </div>
      )}

      {/* ШАГ 2: Выбор меню */}
      {step === 2 && (
        <>
          <div style={{ 
            background: '#E3F2FD', 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{client.company}</div>
              <div style={{ fontSize: 14, color: '#666' }}>{client.contact} • {client.phone}</div>
            </div>
            <button 
              onClick={() => setStep(1)}
              style={{ background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer', fontSize: 14 }}
            >
              Изменить
            </button>
          </div>

          {/* Выбор типа питания */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 8 }}>Тип питания:</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {FOOD_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => { setFoodType(type.id); setSelectedDishes([]) }}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: foodType === type.id ? '2px solid #2196F3' : '2px solid #ddd',
                    borderRadius: 8,
                    background: foodType === type.id ? '#E3F2FD' : '#fff',
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}
                >
                  {type.emoji} {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Смешанный состав */}
          {foodType === 'regular' && (
            <div style={{ marginBottom: 16, background: '#FFF3E0', padding: 12, borderRadius: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={mixedStaff}
                  onChange={(e) => setMixedStaff(e.target.checked)}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <span style={{ fontSize: 14 }}>В заказе есть сотрудники, которым нужно <b>без свинины</b></span>
              </label>
            </div>
          )}

          {/* Выбор дня */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 8 }}>День недели:</label>
            <select
              value={day}
              onChange={(e) => { setDay(e.target.value); setSelectedDishes([]) }}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: 16,
                borderRadius: 8,
                border: '2px solid #ddd'
              }}
            >
              {DAYS.map(d => (
                <option key={d} value={d}>{DAYS_RU[d]}</option>
              ))}
            </select>
          </div>

          {/* Меню */}
          {Object.entries(groupedMenu).map(([category, dishes]) => (
            <div key={category} style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, color: '#666', marginBottom: 8, textTransform: 'uppercase' }}>
                {CATEGORIES[category] || category}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dishes.map(dish => (
                  <button
                    key={dish.id}
                    onClick={() => toggleDish(dish)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      border: isSelected(dish.id) ? '2px solid #4CAF50' : '2px solid #eee',
                      borderRadius: 8,
                      background: isSelected(dish.id) ? '#E8F5E9' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: 16
                    }}
                  >
                    <span>{dish.name}</span>
                    <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>{dish.price}₽</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Корзина */}
          {selectedDishes.length > 0 && (
            <div style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#fff',
              borderTop: '2px solid #4CAF50',
              padding: 16,
              boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{ maxWidth: 500, margin: '0 auto' }}>
                <div style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>
                  Выбрано: {selectedDishes.length} блюд
                  {mixedStaff && <span style={{ color: '#FF9800', marginLeft: 8 }}>⚠️ Без свинины</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 'bold' }}>Итого: {total}₽</span>
                  <button style={{
                    background: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    Заказать →
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ height: 100 }} />
        </>
      )}
    </div>
  )
}

export default App