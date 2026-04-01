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

function App() {
  const [foodType, setFoodType] = useState('regular')
  const [day, setDay] = useState('monday')
  const [selectedDishes, setSelectedDishes] = useState([])
  const [loading] = useState(false)

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

  return (
    <div style={{ padding: 16, maxWidth: 500, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>🍽️ Питание СПБ</h1>
      <p style={{ color: '#666', marginTop: 0 }}>Система заказа питания</p>

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
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Загрузка...</div>
      ) : (
        <div>
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
        </div>
      )}

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

      <div style={{ height: 80 }} />
    </div>
  )
}

export default App