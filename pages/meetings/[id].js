import React from 'react'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import { useRouter } from 'next/router'
import useMeetingsHook from '../../api/meetings'
import { Message, Spinner } from '../../components'
import moment from 'moment'
import {
  FaArrowAltCircleDown,
  FaClock,
  FaFileAlt,
  FaLayerGroup,
  FaMapMarkedAlt,
} from 'react-icons/fa'

const MeetingDetails = () => {
  const router = useRouter()
  const { id } = router.query

  const { getMeetingById } = useMeetingsHook({ id })
  const { data, isLoading, isError, error } = getMeetingById

  return (
    <div className='container'>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div className='row'>
          <div className='col-lg-8 col-md-10 col-12 bg-light p-3 mx-auto'>
            <div className='mb-2 text-center'>
              <h5 className='fw-bold text-uppercase text-center'>
                {data?.title}
              </h5>
              <div
                className={`badge ${
                  data?.status === 'on schedule'
                    ? 'bg-primary'
                    : data?.status === 'not held'
                    ? 'bg-danger'
                    : 'bg-success'
                }`}
              >
                {data?.status}
              </div>
            </div>
            <div className='mb-2'>
              <div className='text-end mb-2'>
                <FaClock className='mb-1' />
                <span className='ms-1'>Start Date</span>
                <br />
                <span className='fw-bold'>
                  {moment(data?.start).format('MMM Do YY, h:mm:ss')}
                </span>
              </div>
              <div className='text-end'>
                <FaClock className='mb-1' />
                <span className='ms-1'>End Date</span>
                <br />
                <span className='fw-bold'>
                  {moment(data?.end).format('MMM Do YY, h:mm:ss')}
                </span>
              </div>
            </div>
            <div className='mb-2'>
              <span className=''>
                <FaMapMarkedAlt className='mb-1' /> Meeting Location
              </span>
              <br />
              <span className='fw-bold'>
                {data?.location?.charAt(0).toUpperCase() +
                  data?.location?.slice(1)}
              </span>
            </div>

            <div className='mb-2'>
              <span className=''>
                <FaLayerGroup className='mb-1' /> Category
              </span>
              <br />
              <span className='fw-bold'>{data?.category?.name}</span>
            </div>

            <div className='mb-2'>
              <span className=''>
                <FaFileAlt className='mb-1' /> Details
              </span>
              <br />
              <p>{data?.description}</p>
            </div>

            <div className='table-responsive mt-4'>
              <table class='table table-striped'>
                <caption className='caption-top'>Meeting Participants</caption>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Mobile</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.participants?.map((p) => (
                    <tr key={p._id}>
                      <td>{p?.name}</td>
                      <td>{p?.title}</td>
                      <td>{p?.mobile}</td>
                      <td>{p?.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(MeetingDetails)), {
  ssr: false,
})
