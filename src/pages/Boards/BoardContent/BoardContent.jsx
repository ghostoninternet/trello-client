import { useState } from 'react'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { DndContext, PointerSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { mapOrder } from '~/utils/sorts'

function BoardContent({ board }) {
  const [orderedColumns, setOrderedColumns] = useState([])

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

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return // If someone try to drag and drop at no where.

    // If the position change
    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id) // Old position of active
      const newIndex = orderedColumns.findIndex(c => c._id === over.id) // New position of active

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id) // For API

      setOrderedColumns(dndOrderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
