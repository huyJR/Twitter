import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import databaseService from '../services/database.services'
import usersService from '~/services/user.services'
import { RegisterReqBody } from '~/models/schemas/requests/users.resquest'
import { Result } from 'express-validator'

export const LoginController = (req: Request, res: Response) => {
  const { email, password } = req.body

  // Kiểm tra cứng cho một email và mật khẩu cụ thể
  if (email === 'duthanhduoc@gmail.com' && password === '123456') {
    // Nếu thông tin xác thực khớp, gửi một thông điệp thành công
    return res.json({
      message: 'Đăng nhập thành công'
    })
  }

  // Nếu thông tin xác thực không khớp, gửi một thông điệp lỗi với mã trạng thái 400
  return res.status(400).json({
    error: 'Đăng nhập thất bại'
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await usersService.register(req.body)
    console.log(result)

    return res.json({
      message: 'Register Success',
      result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Register failed'
    })
  }
}
