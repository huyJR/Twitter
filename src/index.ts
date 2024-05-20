import express from 'express'
import UsersRouter from './routes/user.routes'
import DatabaseService from '~/services/database.services' // Đảm bảo rằng đường dẫn đến file này đúng

const app = express()
const port = 4000

app.post('/', (req, res) => {
  res.send('hello world')
})

app.use(express.json())
app.use('/users', UsersRouter)
// Kết nối cơ sở dữ liệu
DatabaseService.connect() // Cần đảm bảo kết nối DB trước khi server bắt đầu lắng nghe

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
