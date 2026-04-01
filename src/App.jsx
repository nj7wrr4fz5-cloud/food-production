import { useState, useEffect } from 'react'

function App() {
  const [menu, setMenu] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Пока тестовые данные, потом заменим на GitHub JSON
    setTimeout(() => {
      setMenu({
        regular: {
          monday: [{ id: 'r1', name: 'Борщ', price: 120, category: 'soup' }]
        },
        halal: {
          monday: [{ id: 'h1', name: 'Лагман', price: 150, category: 'soup' }]
        }
      })
      setLoading(false)
    }, 500)
  }, [])

  if (loading) return <div style={{padding: 40}}>Загрузка меню...</div>

  return (
    <div style={{padding: 20, maxWidth: 800, margin: '0 auto'}}>
      <h1>🍽️ Питание СПБ</h1>
      <h2>Тестовое меню (пока)</h2>
      <pre>{JSON.stringify(menu, null, 2)}</pre>
      <p style={{color: 'green', marginTop: 20}}>✅ Скелет работает!</p>
    </div>
  )
}

export default App