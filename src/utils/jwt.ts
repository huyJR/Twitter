import { config } from 'dotenv' // Import hàm config từ thư viện dotenv để nạp các biến môi trường từ file .env
import jwt, { SignOptions } from 'jsonwebtoken' // Import thư viện jsonwebtoken và kiểu SignOptions để tạo và xác thực JWT
import { resolve } from 'path' // Import hàm resolve từ thư viện path (không cần thiết trong đoạn mã này)

config() // Nạp các biến môi trường từ file .env vào process.env

// Định nghĩa hàm signToken và xuất nó để sử dụng trong các phần khác của ứng dụng
export const signToken = ({
  payload, // Dữ liệu muốn mã hóa vào token (có thể là chuỗi, buffer hoặc đối tượng)
  privateKey, // Khóa bí mật dùng để ký token
  options = {
    // Các tùy chọn bổ sung để ký token, mặc định sử dụng thuật toán 'HS256'
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object // Định nghĩa kiểu cho payload
  privateKey: string // Định nghĩa kiểu cho privateKey
  options?: SignOptions // Định nghĩa kiểu cho options, có thể tùy chọn
}) => {
  // Trả về một Promise mà khi thành công sẽ chứa token dưới dạng chuỗi
  return new Promise<string>((resolve, reject) => {
    // Sử dụng hàm jwt.sign để tạo token
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        return reject(error) // Nếu có lỗi, gọi hàm reject để trả về lỗi
      }
      resolve(token as string) // Nếu không có lỗi, gọi hàm resolve để trả về token dưới dạng chuỗi
    })
  })
}
