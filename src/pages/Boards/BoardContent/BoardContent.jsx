import { useState, useEffect } from 'react'
import { cloneDeep } from 'lodash'
import Box from '@mui/material/Box'
import {
  DndContext,
  // PointerSensor,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import ListColumns from './ListColumns/ListColumns'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { mapOrder } from '~/utils/sorts'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  const [orderedColumns, setOrderedColumns] = useState([])

  // At one moment, either card or column can be dragged
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // If we use pointerSensor then we have to use CSS property touch-action: none at draggable components, but there are still bugs
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Requires the mouse to move 10px to active the drag event, fix calling event when click
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // Requires hold for 250ms and tolerance of movement to active the drag event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  // Recommend using both mouse and touch sensor for best mobile experience
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // Find index position of overCard in overColumn
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // Logic to calculate new index of activeCard when drag to overColumn (code is taken from dnd-kit library)
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
              active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      if (nextActiveColumn) {
        // Delete the activeCard
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        // Update cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      if (nextOverColumn) {
        // Check if activeCard is existing in OverColumn, if yes then delete it first
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Update columnId of activeDraggingCard
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // Add activeCard to OverColumn according to newCardIndex position
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        // Update cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trigger when we are dragging a column or a card
  const handleDragOver = (event) => {
    // End the function if column is being dragged
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Do something if card is being dragged
    // console.log('handleDragOver: ', event)
    const { active, over } = event
    // Make sure that both active and over are existing, to ensure that if someone is dragging column or card outside
    // the container then we won't do anything (to prevent the web page get crashed)
    if (!active || !over) return

    // activeDraggingCardId: The card that is being dragged
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCardId: The card that is interacting with the activeDraggingCardId
    const { id: overCardId } = over

    // Find 2 columns by cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    // Processing logic here only when we dragging over 2 different columns
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    // Make sure that both active and over are existing, to ensure that if someone is dragging column or card outside
    // the container then we won't do anything (to prevent the web page get crashed)
    if (!active || !over) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCardId: The card that is being dragged
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCardId: The card that is interacting with the activeDraggingCardId
      const { id: overCardId } = over

      // Find 2 columns by cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Drag and drop in the same column
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId) // Old position of active
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId) // New position of active
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)

          const targetColumns = nextColumns.find(column => column._id === overColumn._id)
          targetColumns.cards = dndOrderedCards
          targetColumns.cardOrderIds = dndOrderedCards.map(card => card._id)

          return nextColumns
        })
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // If the position change
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id) // Old position of active
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id) // New position of active

        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id) // For API

        setOrderedColumns(dndOrderedColumns)
      }
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  return (
    <DndContext
      sensors={sensors}
      // collision detection algorithm: to fix bug can't drag card with large cover through difference columns
      // and in the same column (the reason of bug is because of the conflict between card and column)
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData}/>}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
