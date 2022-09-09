import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'

// imports
import { Scheduler } from '@aldabil/react-scheduler'

const Home = () => {
  const events = [
    {
      title: 'Website Re-Design Plan',
      start: new Date('2022/9/9 9:35'),
      end: new Date('2022/9/9 11:30'),
      event_id: 0,
      status: 'completed',
    },
    {
      title: 'Book Flights to San Fran for Sales Trip',
      start: new Date('2022/9/9 9:40'),
      end: new Date('2022/9/9 11:30'),
      event_id: 1,
    },
    {
      title: 'Install New Router in Dev Room',
      start: new Date('2022/9/9 14:30'),
      end: new Date('2022/9/9 15:35'),
      event_id: 2,
    },
    {
      title: 'Approve Personal Computer Upgrade Plan',
      start: new Date('2022/9/9 11:00'),
      end: new Date('2022/9/9 11:30'),
      event_id: 3,
    },
    {
      title: 'Final Budget Review',
      start: new Date('2022/9/9 12:0'),
      end: new Date('2022/9/9 13:35'),
      event_id: 4,
      status: 'notHeld',
    },
    {
      title: 'New Brochures',
      start: new Date('2022/9/9 14:30'),
      end: new Date('2022/9/9 15:45'),
      event_id: 5,
      status: 'completed',
    },
  ]
  const onConfirmHandler = (event, action) => {
    console.log('done')
    console.log({ event, action })
  }
  const onDeleteHandler = (event) => {
    console.log('DELETED: ', event)
  }
  const onEventDropHandler = (originalEvent, droppedOn, updatedEvent) => {
    console.log({ originalEvent, droppedOn, updatedEvent })
  }

  const remoteEventHandler = (query) => {
    // fetch the event from the server
    console.log('REMOTE EVENT: ', query)
    // ?start=Sat May 08 2021 00:00:00 GMT+0100 (British Summer Time)&end=Thu May 13 2021 23:59:59 GMT+0100 (British Summer Time).
  }
  return (
    <div className='container'>
      <div className='p-3 bg-white'>
        <Scheduler
          view='month'
          week={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 6,
            startHour: 8,
            endHour: 16,
            step: 60,
          }}
          month={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 6,
            startHour: 8,
            endHour: 16,
          }}
          day={{
            startHour: 8,
            endHour: 16,
            step: 60,
          }}
          fields={[
            {
              name: 'participants',
              type: 'input',
              config: {
                label: 'Participants',
                required: true,
                min: 5,
                email: false,
                variant: 'outlined',
              },
            },
            {
              name: 'description',
              type: 'input',
              config: {
                label: 'Description',
                required: true,
                min: 3,
                email: false,
                variant: 'outlined',
              },
            },
            {
              name: 'location',
              options: [
                { id: 1, text: 'Physical', value: 'physical' },
                { id: 2, text: 'Online', value: 'online' },
              ],
              type: 'select',
              config: {
                label: 'Location',
                required: true,
                min: 3,
                email: false,
                variant: 'outlined',
              },
            },
            {
              name: 'status',
              options: [
                { id: 1, text: 'On Schedule', value: 'onSchedule' },
                { id: 2, text: 'Not Held', value: 'notHeld' },
                { id: 3, text: 'Completed', value: 'completed' },
              ],
              type: 'select',
              config: {
                label: 'Status',
                required: true,
                min: 3,
                email: false,
                variant: 'outlined',
              },
            },
          ]}
          remoteEvents={(query) => remoteEventHandler(query)}
          loading={false}
          onConfirm={(event, action) => onConfirmHandler(event, action)}
          onDelete={(event) => onDeleteHandler(event)}
          onEventDrop={(droppedOn, updatedEvent, originalEvent) =>
            onEventDropHandler(originalEvent, droppedOn, updatedEvent)
          }
          events={events}
          className='bg-danger'
        />
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Home)), { ssr: false })
