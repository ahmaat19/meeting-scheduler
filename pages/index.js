import moment from 'moment'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import { FaClock } from 'react-icons/fa'
import useDashboardHook from '../api/dashboard'
import { Message, Spinner } from '../components'

const Home = () => {
  const { getDashboard } = useDashboardHook()

  const { data, isLoading, isError, error } = getDashboard

  const previousMeetings = data?.previousMeetings
  const upcomingMeetings = data?.upcomingMeetings
  const totalPreviousMeetings = data?.totalPreviousMeetings
  const totalUpcomingMeetings = data?.totalUpcomingMeetings
  const noOfParticipantsParticipated = data?.noOfParticipantsParticipated
  const noOfCategoriesInMeeting = data?.noOfCategoriesInMeeting
  return (
    <div className='container'>
      <div className='row bg-light p-3'>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <>
            <div className='col-lg-4 col-md-6 col-12'>
              <h6 className='text-uppercase fw-bold'> Previous meetings.</h6>
              {previousMeetings?.map((meeting) => (
                <div
                  key={meeting?._id}
                  className='card bg-danger text-light mb-2'
                >
                  <div className='card-body'>
                    <h5 className='card-title'>{meeting?.title}</h5>
                    <div className='card-text'>
                      <p>{meeting?.description}</p>
                      <div className='badge bg-warning text-dark'>
                        <FaClock className='mb-1 me-1' />
                        {moment(meeting?.start).format('MMM Do YY, h:mm:ss')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='col-lg-4 col-md-6 col-12'>
              <h6 className='text-uppercase fw-bold'>
                Upcoming scheduled meetings.
              </h6>
              {upcomingMeetings?.map((meeting) => (
                <div
                  key={meeting?._id}
                  className='card bg-success text-light mb-2'
                >
                  <div className='card-body'>
                    <h5 className='card-title'>{meeting?.title}</h5>
                    <div className='card-text'>
                      <p>{meeting?.description}</p>
                      <div className='badge bg-warning text-dark'>
                        <FaClock className='mb-1 me-1' />
                        {moment(meeting?.start).format('MMM Do YY, h:mm:ss')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='col-lg-4 col-md-6 col-12'>
              <h6 className='text-uppercase fw-bold'>Number of meetings.</h6>
              <div className='card shadow-sm border-0 mb-2'>
                <div className='card-body d-flex justify-content-between'>
                  Total Previous Scheduled Meeting:{' '}
                  <span className='badge bg-warning rounded-pill'>
                    {totalPreviousMeetings}
                  </span>
                </div>
              </div>
              <div className='card shadow-sm border-0 mb-2'>
                <div className='card-body d-flex justify-content-between'>
                  Total Upcoming Scheduled Meeting:{' '}
                  <span className='badge bg-warning rounded-pill'>
                    {totalUpcomingMeetings}
                  </span>
                </div>
              </div>

              <div className='mt-5'>
                <h6 className='text-uppercase fw-bold'>
                  List of people who attended previous meetings
                </h6>
                <ol className='list-group list-group-numbered'>
                  {noOfParticipantsParticipated?.map((participant) => (
                    <li
                      key={participant?._id}
                      className='list-group-item d-flex justify-content-between align-items-start'
                    >
                      <div className='ms-2 me-auto'>
                        <div className='fw-bold'>{participant?.name}</div>
                        {participant?.email}
                      </div>
                      <span className='badge bg-warning rounded-pill'>
                        {participant?.times}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className='mt-5'>
                <h6 className='text-uppercase fw-bold'>Meeting by groups</h6>
                <ol className='list-group list-group-numbered'>
                  {noOfCategoriesInMeeting?.map((cat) => (
                    <li
                      key={cat?._id}
                      className='list-group-item d-flex justify-content-between align-items-start'
                    >
                      <div className='ms-2 me-auto'>
                        <div className='fw-bold'>{cat?.name}</div>
                      </div>
                      <span className='badge bg-warning rounded-pill'>
                        {cat?.times}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
