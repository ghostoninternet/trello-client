import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

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

function BoardBar() {
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
      borderBottom: '1px solid white',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          icon={<DashboardIcon />}
          label="Phuc Phuc"
          clickable
          sx={MENU_STYLES}
        />
        <Chip
          icon={<VpnLockIcon />}
          label=" Public/Private Workspace"
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
        <AvatarGroup
          max={5}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none'
            }
          }}
        >
          <Tooltip title="Phuc Phuc">
            <Avatar alt="Phuc Phuc" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Phuc Phuc">
            <Avatar alt="Phuc Phuc" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Phuc Phuc">
            <Avatar alt="Phuc Phuc" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Phuc Phuc">
            <Avatar alt="Phuc Phuc" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Phuc Phuc">
            <Avatar alt="Phuc Phuc" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Phuc Phuc">
            <Avatar alt="Phuc Phuc" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Phuc Phuc">
            <Avatar alt="Phuc Phuc" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Phuc Phuc">
            <Avatar alt="Phuc Phuc" src="/static/images/avatar/1.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>

    </Box>
  )
}

export default BoardBar
