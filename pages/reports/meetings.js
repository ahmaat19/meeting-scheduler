import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import useReportsHook from '../../api/reports'
import { Message, Pagination, Spinner } from '../../components'
import { FaInfoCircle, FaSearch } from 'react-icons/fa'
import Link from 'next/link'
import moment from 'moment'

const Meetings = () => {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const { getMeetingsReport } = useReportsHook({ page, q })
  const { data, isLoading, isError, error, refetch } = getMeetingsReport

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!q) refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const searchHandler = (e) => {
    e.preventDefault()
    refetch()
    setPage(1)
  }

  return (
    <>
      <Head>
        <title>Meeting Report</title>
        <meta property='og:title' content='Meeting Report' key='title' />
      </Head>

      {isError && <Message variant='danger'>{error}</Message>}

      <div className='ms-auto text-end'>
        <Pagination data={data} setPage={setPage} />
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div className='table-responsive bg-light p-3 mt-2'>
          <div className='d-flex align-items-center flex-column mb-2'>
            <h3 className='fw-light text-muted'>
              Meeting Report List
              <sup className='fs-6'> [{data?.total}] </sup>
            </h3>

            <div className='col-auto'>
              <form onSubmit={searchHandler}>
                <div className='input-group'>
                  <input
                    type='month'
                    className='form-control'
                    aria-label='Month'
                    onChange={(e) => setQ(e.target.value)}
                    value={q}
                  />
                  <div className='input-group-append'>
                    <button type='submit' className='btn btn-outline-secondary'>
                      <FaSearch />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <table className='table table-sm table-border'>
            <thead className='border-0'>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Category</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((obj) => (
                <tr key={obj?._id}>
                  <td>{obj?.title}</td>
                  <td>
                    {obj?.location?.charAt(0).toUpperCase() +
                      obj?.location?.slice(1)}
                  </td>
                  <td>{obj?.category?.name}</td>
                  <td>{moment(obj?.start).format('MMM Do YY, h:mm:ss')}</td>
                  <td>{moment(obj?.end).format('MMM Do YY, h:mm:ss')}</td>
                  <td>
                    <span>
                      {obj?.status === 'on schedule' && (
                        <span className='badge bg-primary'>{obj?.status}</span>
                      )}
                      {obj?.status === 'completed' && (
                        <span className='badge bg-success'>{obj?.status}</span>
                      )}

                      {obj?.status === 'not held' && (
                        <span className='badge bg-danger'>{obj?.status}</span>
                      )}
                    </span>
                  </td>
                  <td>
                    <Link href={`/meetings/${obj?._id}`}>
                      <a className='btn btn-outline-warning btn-sm'>
                        <FaInfoCircle className='mb-1 me-1' />
                        Details
                      </a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Meetings)), {
  ssr: false,
})
