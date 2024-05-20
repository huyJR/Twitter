import { TokenType } from '~/constants/enum' // Import enum TokenType từ thư mục constants/enum
import User from '~/models/schemas/Users.schemas' // Import mô hình User từ thư mục models/schemas
import { RegisterReqBody } from '~/models/schemas/requests/users.resquest' // Import kiểu dữ liệu RegisterReqBody từ thư mục models/schemas/requests/users.resquest
import databaseService from '~/services/database.services' // Import dịch vụ cơ sở dữ liệu từ thư mục services
import { hashPassword } from '~/utils/crypto' // Import hàm hashPassword từ thư mục utils/crypto
import { signToken } from '~/utils/jwt' // Import hàm signToken từ thư mục utils/jwt

class UsersService {
  // Phương thức riêng tư signAccessToken để tạo Access Token cho người dùng
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id, // ID người dùng
        token_type: TokenType.AccessToken // Loại token là Access Token
      },
      privateKey: process.env.ACCESS_TOKEN_SECRET!, // Khóa bí mật để ký token, lấy từ biến môi trường
      options: {
        algorithm: 'HS256', // Thuật toán dùng để ký token
        expiresIn: '15m' // Thời gian hết hạn của token là 15 phút
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id, // ID người dùng
        token_type: TokenType.RefreshToken // Loại token là Access Token
      },
      privateKey: process.env.REFRESH_TOKEN_SECRET!, // Khóa bí mật để ký token, lấy từ biến môi trường
      options: {
        algorithm: 'HS256', // Thuật toán dùng để ký token
        expiresIn: '15m' // Thời gian hết hạn của token là 15 phút
      }
    })
  }

  // Phương thức đăng ký người dùng mới
  async register(payload: RegisterReqBody) {
    const { email, password } = payload
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth), // Chuyển đổi chuỗi ngày sinh thành đối tượng Date
        password: hashPassword(payload.password) // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
      })
    )
    // Chuyển đổi insertedId từ ObjectId thành chuỗi
    const user_id = result.insertedId.toString()

    // Sử dụng Promise.all để thực hiện đồng thời việc tạo Access Token và Refresh Token
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id), // Gọi phương thức signAccessToken để tạo Access Token cho user_id
      this.signRefreshToken(user_id) // Gọi phương thức signRefreshToken để tạo Refresh Token cho user_id
    ])

    // Trả về một đối tượng chứa Access Token và Refresh Token
    return {
      access_token, // Access Token vừa được tạo
      refresh_token // Refresh Token vừa được tạo
    }
  }

  // Phương thức kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    console.log(user) // In thông tin người dùng (nếu có) ra console
    return Boolean(user) // Trả về true nếu người dùng tồn tại, ngược lại trả về false
  }
}

// Tạo instance của UsersService và xuất nó ra để sử dụng trong các phần khác của ứng dụng
const usersService = new UsersService()
export default usersService
