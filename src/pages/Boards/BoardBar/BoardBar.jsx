import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatter'
import BoardUserGroup from './BoardUserGroup'

const MENU_STYLES = {
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  return (
    <Box sx={{
      px: 2,
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
            sx={MENU_STYLES}
          />
        </Tooltip>
        <Chip
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
          sx={MENU_STYLES}
        />
        <Chip
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
          sx={MENU_STYLES}
        />
        <Chip
          icon={<BoltIcon />}
          label="Automation"
          clickable
          sx={MENU_STYLES}
        />
        <Chip
          icon={<FilterListIcon />}
          label="Filter"
          clickable
          sx={MENU_STYLES}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant='outlined'
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white'
            }
          }}
        >
          Invite
        </Button>
        <BoardUserGroup boardUsers={board?.FE_allUsers} limit={4} />
      </Box>

    </Box>
  )
}

export default BoardBar
