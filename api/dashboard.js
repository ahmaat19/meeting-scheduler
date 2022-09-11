import dynamicAPI from './dynamicAPI'
import { useQuery } from 'react-query'

const url = '/api/dashboard'

export default function useDashboardHook(props) {
  const getDashboard = useQuery(
    'dashboard',
    async () => await dynamicAPI('get', `${url}`, {}),
    { retry: 3 }
  )

  return {
    getDashboard,
  }
}
