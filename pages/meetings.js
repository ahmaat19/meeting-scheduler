import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from 'react-hook-form'
import useMeetingsHook from '../api/meetings'
import useCategoriesHook from '../api/categories'
import useParticipantsHook from '../api/participants'
import { Spinner, Pagination, Message, Confirm } from '../components'
import {
  dynamicInputSelect,
  inputDateTime,
  inputText,
  inputTextArea,
  staticInputSelect,
} from '../utils/dynamicForm'
import TableView from '../components/TableView'
import FormView from '../components/FormView'
import moment from 'moment'

const Meetings = () => {
  const [page, setPage] = useState(1)
  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [q, setQ] = useState('')

  const { getMeetings, postMeeting, updateMeeting, deleteMeeting } =
    useMeetingsHook({
      page,
      q,
    })
  const { getCategories } = useCategoriesHook({
    page: 1,
    limit: 1000000,
  })
  const { getParticipants } = useParticipantsHook({
    page: 1,
    limit: 1000000,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      auth: true,
    },
  })

  let { data, isLoading, isError, error, refetch } = getMeetings
  const { data: categoriesData } = getCategories
  const { data: participantsData } = getParticipants

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: mutateAsyncUpdate,
  } = updateMeeting

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: mutateAsyncDelete,
  } = deleteMeeting

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: mutateAsyncPost,
  } = postMeeting

  useEffect(() => {
    if (isSuccessPost || isSuccessUpdate) formCleanHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessPost, isSuccessUpdate])

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

  // TableView
  const table = {
    header: ['Title', 'Location', 'Category'],
    body: ['title', 'location', 'category.name'],
    status: 'status',
    startDate: 'start',
    endDate: 'end',
    data: data,
  }

  const editHandler = (item) => {
    setId(item._id)

    table.body.map((t) => setValue(t, item[t]))
    setValue('category', item?.category?._id)
    setValue('description', item?.description)
    setValue('status', item?.status)
    setValue(
      'participants',
      item?.participants?.map((p) => p?._id)
    )
    setValue('start', moment(item?.start).format('YYYY-MM-DD HH:mm'))
    setValue('end', moment(item?.end).format('YYYY-MM-DD HH:mm'))
    setEdit(true)
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => mutateAsyncDelete(id)))
  }

  const name = 'Meetings List'
  const label = 'Meeting'
  const modal = 'meeting'
  const searchPlaceholder = 'Search by name'

  // FormView
  const formCleanHandler = () => {
    reset()
    setEdit(false)
  }

  const submitHandler = (data) => {
    edit
      ? mutateAsyncUpdate({
          _id: id,
          ...data,
        })
      : mutateAsyncPost(data)
  }

  const form = [
    inputText({
      register,
      errors,
      label: 'Title',
      name: 'title',
      placeholder: 'Enter title',
    }),
    staticInputSelect({
      register,
      errors,
      label: 'Location',
      name: 'location',
      placeholder: 'Select location',
      data: [{ name: 'physical' }, { name: 'online' }],
    }),
    inputDateTime({
      register,
      errors,
      label: 'Start Date',
      name: 'start',
      placeholder: 'Enter start',
    }),
    inputDateTime({
      register,
      errors,
      label: 'End Date',
      name: 'end',
      placeholder: 'Enter end',
    }),

    dynamicInputSelect({
      register,
      errors,
      label: 'Category',
      name: 'category',
      placeholder: 'Select category',
      value: 'name',
      data: categoriesData?.data,
    }),
    staticInputSelect({
      register,
      errors,
      label: 'Status',
      name: 'status',
      placeholder: 'Select status',
      data: [
        { name: 'on schedule' },
        { name: 'not held' },
        { name: 'completed' },
      ],
    }),
    dynamicInputSelect({
      register,
      errors,
      label: 'Participants',
      name: 'participants',
      placeholder: 'Select participants',
      value: 'name',
      data: participantsData?.data?.filter((p) => p?.status === 'active'),
      multiple: true,
    }),
    inputTextArea({
      register,
      errors,
      label: 'Description',
      name: 'description',
      placeholder: 'Enter description',
    }),
  ]

  const row = true
  const column = 'col-md-6 col-12'
  const modalSize = 'modal-lg'

  return (
    <>
      <Head>
        <title>Meetings</title>
        <meta property='og:title' content='Meetings' key='title' />
      </Head>

      {isSuccessDelete && (
        <Message variant='success'>
          {label} has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {isSuccessUpdate && (
        <Message variant='success'>
          {label} has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessPost && (
        <Message variant='success'>
          {label} has been Created successfully.
        </Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}

      <div className='ms-auto text-end'>
        <Pagination data={table.data} setPage={setPage} />
      </div>

      <FormView
        edit={edit}
        formCleanHandler={formCleanHandler}
        form={form}
        watch={watch}
        isLoadingUpdate={isLoadingUpdate}
        isLoadingPost={isLoadingPost}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        modal={modal}
        label={label}
        column={column}
        row={row}
        modalSize={modalSize}
      />

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <TableView
          table={table}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
          searchHandler={searchHandler}
          isLoadingDelete={isLoadingDelete}
          name={name}
          label={label}
          modal={modal}
          setQ={setQ}
          q={q}
          searchPlaceholder={searchPlaceholder}
          searchInput={true}
          addBtn={true}
        />
      )}
    </>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Meetings)), {
  ssr: false,
})
