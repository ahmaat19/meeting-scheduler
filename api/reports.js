import dynamicAPI from './dynamicAPI'
import { useQuery } from 'react-query'

const url = '/api/reports'

export default function useReportsHook(props) {
  const { page = 1, q = '', limit = 25, id = '' } = props

  const getMeetingsReport = useQuery(
    ['booking-report'],
    async () =>
      await dynamicAPI(
        'get',
        `${url}/meetings/?page=${page}&q=${q}&limit=${limit}`,
        {}
      ),
    { retry: 3 }
  )

  return {
    getMeetingsReport,
  }
}
