import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/**
 * Lưu ý:
 * Tất cả các function bên dưới sẽ chỉ request và lấy data từ response luôn, mà không có try catch hay then catch gì để bắt lỗi
 * Lý do là vì ở phía FE chúng ta không cần thiết làm như vậy đối với mọi request bởi nó sẽ gây ra dư thừa code catch quá nhiều
 * Giải pháp clean code là chúng ta sẽ catch lỗi tập trung tại một nơi bằng cách
 * tận dụng một thứ cực mạnh mẽ của Axios đó là Interceptors
 * Hiểu đơn giản Interceptors là cách mà chúng ta sẽ đánh chặn vào giữa request hoặc response để xử lý logic mà chúng ta muốn
 */

// Board
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Note: axios will return its result in its 'data' property
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  // Note: axios will return its result in its 'data' property
  return response.data
}

// Column
export const createColumnDetailsAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns/`, newColumnData)
  // Note: axios will return its result in its 'data' property
  return response.data
}

// Card
export const createCardDetailsAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards/`, newCardData)
  // Note: axios will return its result in its 'data' property
  return response.data
}