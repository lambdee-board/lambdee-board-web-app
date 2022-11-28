import React from 'react'
import { useParams } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'

import apiClient, { swrCacheKey } from '../../../api/api-client'
import useBoard from '../../../api/board'
import { isManager } from '../../../internal/permissions'
import { calculateNewOrder } from '../../../internal/component-position-service'
import { dndListId, dbId } from '../../../utils/dnd'
import { listGetterKey, mutateList } from '../../../api/list'
import { uniqueArrayBy, uniqueArrayByFilter } from '../../../utils/unique-array'

import { TaskList, TaskListSkeleton } from '../../../components/TaskList'
import SortableTaskList from '../../../components/SortableTaskList'

import './BoardWorkView.sass'
import useAppAlertStore from '../../../stores/app-alert'
import TaskCardListItem from '../../../components/TaskCardListItem'

export default function BoardWorkView() {
  const { cache } = useSWRConfig()
  const [dragged, setDragged] = React.useState(null)
  const addAlert = useAppAlertStore((store) => store.addAlert)
  const [sortedTaskLists, setNewTaskListOrder] = React.useState([])
  const { boardId } = useParams()
  const { data: board, mutate: mutateBoard, isLoading, isError } = useBoard({ id: boardId, axiosOptions: { params: { lists: 'visible' } } })
  const listDragSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3, },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const updateListPos = (id, newPos, updatedLists) => {
    setNewTaskListOrder(updatedLists)

    const updatedList = {
      id,
      pos: newPos,
    }

    apiClient.put(`/api/lists/${id}`, updatedList)
      .then(() => {
        mutateBoard((boardData) => ({ ...boardData, lists: updatedLists }))
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const updateTaskPos = (id, newPos, updatedTasks, listId) => {
    const updatedTask = {
      id,
      listId,
      pos: newPos,
    }

    mutateList({
      id: listId,
      data: (list) => ({ ...list, tasks: updatedTasks }),
      axiosOptions: { params: { tasks: 'visible' } },
      options: { revalidate: false }
    })
    apiClient.put(`/api/tasks/${id}`, updatedTask)
      .then((response) => {
        // mutateList({ id: listId, axiosOptions: { params: { tasks: 'visible' } } })
      })
      .catch((error) => {
        // failed or rejected
        addAlert({ severity: 'error', message: 'Something went wrong!' })
      })
  }

  const updateTaskListOrder = (updatedLists, updatedElementIndex) => {
    const [updatedElementId, updatedElementPos, reorderedLists] = calculateNewOrder(updatedLists, updatedElementIndex)
    if ((updatedElementId ?? true) === true) return

    updateListPos(updatedElementId, updatedElementPos, reorderedLists)
  }

  const updateTaskOrder = (updatedTasks, updatedElementIndex, listId) => {
    const [updatedElementId, updatedElementPos, reorderedTasks] = calculateNewOrder(updatedTasks, updatedElementIndex)
    if ((updatedElementId ?? true) === true) return

    updateTaskPos(updatedElementId, updatedElementPos, reorderedTasks, listId)
  }

  function findDndItem(item) {
    const id = dbId(item.id)
    const { type } = item.data.current

    const list = findDndList(item)
    if (type === 'list') return list

    return { ...list.tasks.find((task) => task.id === id), type: 'task' }
  }

  function findDndTask(dndItem) {
    const item = findDndItem(dndItem)
    if (item.type === 'task') return item

    return item.tasks[0]
  }

  function findDndList(item) {
    const { type, listId } = item.data.current

    if (type === 'list') {
      const id = dbId(item.id)
      return { ...sortedTaskLists.find((list) => list.id === id), type: 'list' }
    } else if (type === 'task') {
      return { ...cache.get(swrCacheKey(listGetterKey(listId, { params: { tasks: 'visible' } }))), type: 'list' }
    }
  }

  function onDragStart(event) {
    const { active } = event
    setDragged(findDndItem(active))
  }

  function onDragOver({ active, over }) {
    if (active?.data?.current?.type?.[0] === 'l') return

    const overId = dbId(over.id)
    const overList = findDndList(over)
    const fromList = findDndList(active)
    if (!overList || !fromList) return
    if (overList.id === fromList.id) return

    if (over.data.current.type === 'task-list') return // TODO

    const isBelowOverItem =
      over &&
      active.rect.current.translated &&
      active.rect.current.translated.offsetTop >
      over.rect.offsetTop + over.rect.height
    const modifier = isBelowOverItem ? 1 : 0
    const overIndex = overList.tasks.findIndex((task) => task.id === overId)
    const newIndex = overIndex >= 0 ? overIndex + modifier : overList.tasks.length + 1

    mutateList({
      id: fromList.id,
      data: {
        ...fromList,
        tasks: uniqueArrayByFilter(fromList.tasks, (task) => task.id, (task) => task.id !== dragged.id)
      },
      axiosOptions: { params: { tasks: 'visible' } },
      options: { revalidate: false }
    })
    mutateList({
      id: overList.id,
      data: {
        ...overList,
        tasks: uniqueArrayBy(
          [
            ...overList.tasks.slice(0, newIndex),
            { ...dragged, listId: overList.id },
            ...overList.tasks.slice(newIndex, overList.tasks.length)
          ],
          (task) => task.id
        )
      },
      axiosOptions: { params: { tasks: 'visible' } },
      options: { revalidate: false }
    })
  }

  function onDragEnd(event) {
    const { active, over } = event
    const draggedId = dbId(active?.id)
    const overId = dbId(over?.id)
    if (overId == null || draggedId == null) return setDragged(null)

    const overList = findDndList(over)
    if (dragged?.type === 'list') {
      if (draggedId !== overList.id) {
        const oldIndex = sortedTaskLists.findIndex((list) => list.id === draggedId)
        const newIndex = sortedTaskLists.findIndex((list) => list.id === overList.id)
        const updatedLists = arrayMove(sortedTaskLists, oldIndex, newIndex)
        updateTaskListOrder(updatedLists, newIndex)
      }

      setDragged(null)
    } else if (dragged?.type === 'task') {
      const fromList = findDndList(active)
      const overTask = findDndTask(over)
      if (!fromList || !overList) return setDragged(null)

      if (fromList.id !== overList.id) {
        // mutateList({
        //   id: overList.id,
        //   data: {
        //     ...overList,
        //     tasks: [...overList.tasks, { ...dragged, listId: overList.id }]
        //   },
        //   axiosOptions: { params: { tasks: 'visible' } },
        //   options: { revalidate: false }
        // })
        // mutateList({
        //   id: fromList.id,
        //   data: {
        //     ...fromList,
        //     tasks: fromList.tasks.filter((task) => task.id !== dragged.id)
        //   },
        //   axiosOptions: { params: { tasks: 'visible' } },
        //   options: { revalidate: false }
        // })
      } else {
        console.log(over, active)
        const newIndex = overList.tasks.findIndex((task) => task.id === overTask.id)
        let updatedTasks
        if (dragged.id !== overTask.id) {
          const oldIndex = overList.tasks.findIndex((task) => task.id === dragged.id)
          updatedTasks = arrayMove(overList.tasks, oldIndex, newIndex)
        } else {
          updatedTasks = overList.tasks
        }
        console.log(overList, newIndex)
        // const updatedTasks = arrayMove(overList.tasks, oldIndex, newIndex)
        updateTaskOrder(updatedTasks, newIndex, overList.id)
        // mutateList({
        //   id: overList.id,
        //   axiosOptions: { params: { tasks: 'visible' } }
        // })
      }

      setDragged(null)
    }
  }

  const dndCollisionDetection = (args) => {
    if (dragged && dragged.type === 'list') {
      return closestCenter({
        ...args,
        droppableContainers: args.droppableContainers.filter(
          (container) => container.id?.[0] === 'l'
        )
      })
    }

    if (dragged && dragged.type === 'task') {
      // console.log(args.droppableContainers.filter(
      //   (container) => container.id?.[0] === 't'
      // ), closestCenter({
      //   ...args,
      //   droppableContainers: args.droppableContainers.filter(
      //     (container) => container.id?.[0] === 't'
      //   )
      // }))
      return closestCorners({
        ...args,
        droppableContainers: args.droppableContainers.filter(
          (container) => container.id?.[0] === 't'
        )
      })
    }
  }

  React.useEffect(() => {
    if (!board) return

    const sortedList = [...board.lists].sort((a, b) => (a.pos > b.pos ? 1 : -1))
    setNewTaskListOrder([...sortedList])
  }, [board])

  if (isLoading || isError) return (
    <div className='BoardView'>
      <div className='BoardWorkView'>
        <div className='TaskLists-scrollable' >
          <div className='TaskLists-wrapper'>
            {[0, 1, 2].map((index) => (
              <TaskListSkeleton key={index} />
            ))}
            <div className='TaskLists-spacer'></div>
          </div>
        </div>
      </div>
    </div>
  )

  const TaskListComponent = isManager() ? SortableTaskList : TaskList

  let draggedItem

  if (dragged && dragged.type === 'list') {
    draggedItem = (
      <TaskList key={dragged.id}
        title={dragged.name}
        pos={dragged.pos}
        id={dragged.id}
        visible={dragged.visible}
        dragged={true}
      />
    )
  } else if (dragged && dragged.type === 'task') {
    draggedItem = (<TaskCardListItem key={dragged.id}
      id={dragged.id}
      label={dragged.name}
      tags={dragged.tags}
      priority={dragged.priority}
      assignedUsers={dragged.users}
      points={dragged.points}
      pos={dragged.pos}
      listId={dragged.listId}
    />)
  }

  return (
    <DndContext
      sensors={listDragSensors}
      collisionDetection={dndCollisionDetection}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <SortableContext
        id='lists'
        items={sortedTaskLists.map((list) => dndListId(list.id))}
        strategy={horizontalListSortingStrategy}
      >
        <div className='BoardWorkView'>
          <div className='TaskLists-scrollable' >
            <div className='TaskLists-wrapper'>
              {sortedTaskLists.map((taskList) => (
                <TaskListComponent key={taskList.id}
                  title={taskList.name}
                  pos={taskList.pos}
                  id={taskList.id}
                  visible={taskList.visible}
                />
              ))}
            </div>
          </div>
        </div>
        <DragOverlay>
          {draggedItem}
        </DragOverlay>
      </SortableContext>
    </DndContext>
  )
}
