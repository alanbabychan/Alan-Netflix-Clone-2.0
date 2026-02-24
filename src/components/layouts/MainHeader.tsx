import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useOffSetTop from "src/hooks/useOffSetTop";
import { APP_BAR_HEIGHT } from "src/constant";
import Logo from "../Logo";
import SearchBox from "../SearchBox";
import NetflixNavigationLink from "../NetflixNavigationLink";
import { logout } from "src/store/slices/authSlice";
import type { RootState } from "src/store";

const pages = ["My List", "Movies", "Tv Shows"];

const MainHeader = () => {
  const isOffset = useOffSetTop(APP_BAR_HEIGHT);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [editProfileOpen, setEditProfileOpen] = React.useState(false);
  const [changeAvatarOpen, setChangeAvatarOpen] = React.useState(false);
  const [profileData, setProfileData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    avatar: '/avatar.png'
  });
  
  const avatarOptions = [
    '/avatar.png',
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2'
  ];
  
  const user = useSelector((state: RootState) => state.auth.user);
  
  React.useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        avatar: user.avatar || '/avatar.png'
      });
    }
  }, [user]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleEditProfile = () => {
    setEditProfileOpen(true);
  };

  const handleCloseEditProfile = () => {
    setEditProfileOpen(false);
  };

  const handleSaveProfile = () => {
    // Update user data in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.email === user.email ? { ...u, ...profileData } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update Redux state (you might need to create an updateUser action)
    console.log('Profile updated:', profileData);
    setEditProfileOpen(false);
  };

  const handleChangeAvatar = () => {
    setChangeAvatarOpen(true);
  };

  const handleCloseChangeAvatar = () => {
    setChangeAvatarOpen(false);
  };

  const handleSelectAvatar = (avatarUrl: string) => {
    setProfileData({...profileData, avatar: avatarUrl});
    
    // Update user data in localStorage immediately
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.email === user.email ? { ...u, avatar: avatarUrl } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    console.log('Avatar changed to:', avatarUrl);
    setChangeAvatarOpen(false);
  };

  return (
    <AppBar
      sx={{
        // px: "4%",
        px: "60px",
        height: APP_BAR_HEIGHT,
        backgroundImage: "none",
        ...(isOffset
          ? {
              bgcolor: "primary.main",
              boxShadow: (theme) => theme.shadows[4],
            }
          : { boxShadow: 0, bgcolor: "transparent" }),
      }}
    >
      <Toolbar disableGutters>
        <Logo sx={{ mr: { xs: 2, sm: 4 } }} />

        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Typography
          variant="h5"
          noWrap
          component="a"
          href=""
          sx={{
            mr: 2,
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            fontWeight: 700,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Netflix
        </Typography>
        <Stack
          direction="row"
          spacing={3}
          sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
        >
          {pages.map((page) => (
            <NetflixNavigationLink
              to=""
              variant="subtitle1"
              key={page}
              onClick={handleCloseNavMenu}
            >
              {page}
            </NetflixNavigationLink>
          ))}
        </Stack>

        <Box sx={{ flexGrow: 0, display: "flex", gap: 2 }}>
          <SearchBox />
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="user_avatar" src={profileData.avatar} variant="rounded" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="avatar-menu"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {user?.email === 'guest@netflix.com' ? [
              <MenuItem key="guest-info" disabled>
                <Typography textAlign="center" sx={{ color: '#8c8c8c' }}>Logged in as Guest</Typography>
              </MenuItem>,
              <MenuItem
                key="login"
                onClick={() => {
                  handleCloseUserMenu();
                  dispatch(logout());
                  navigate("/login");
                }}
                sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                <Typography textAlign="center">Login</Typography>
              </MenuItem>
            ] : (
              ["Edit Profile", "Change Avatar", "Logout"].map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    handleCloseUserMenu();
                    if (setting === "Logout") {
                      dispatch(logout());
                      navigate("/login");
                    } else if (setting === "Edit Profile") {
                      handleEditProfile();
                    } else if (setting === "Change Avatar") {
                      handleChangeAvatar();
                    }
                  }}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))
            )}
          </Menu>
        </Box>
      </Toolbar>
      
      {/* Edit Profile Dialog */}
      <Dialog 
        open={editProfileOpen} 
        onClose={handleCloseEditProfile}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.9)',
            color: 'white',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="First Name"
            value={profileData.firstName}
            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
            margin="normal"
            InputLabelProps={{ style: { color: '#8c8c8c' } }}
            InputProps={{ 
              style: { color: 'white' },
              sx: {
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#fff' },
                  '&.Mui-focused fieldset': { borderColor: '#e50914' },
                }
              }
            }}
          />
          <TextField
            fullWidth
            label="Last Name"
            value={profileData.lastName}
            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
            margin="normal"
            InputLabelProps={{ style: { color: '#8c8c8c' } }}
            InputProps={{ 
              style: { color: 'white' },
              sx: {
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#fff' },
                  '&.Mui-focused fieldset': { borderColor: '#e50914' },
                }
              }
            }}
          />
          <TextField
            fullWidth
            label="Email"
            value={profileData.email}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
            margin="normal"
            disabled
            InputLabelProps={{ style: { color: '#8c8c8c' } }}
            InputProps={{ 
              style: { color: '#8c8c8c' },
              sx: {
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333' },
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseEditProfile}
            sx={{ color: '#8c8c8c' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveProfile}
            variant="contained"
            sx={{
              bgcolor: '#e50914',
              '&:hover': { bgcolor: '#f40612' }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Change Avatar Dialog */}
      <Dialog 
        open={changeAvatarOpen} 
        onClose={handleCloseChangeAvatar}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0,0,0,0.9)',
            color: 'white',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Choose Avatar</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, py: 2 }}>
            {avatarOptions.map((avatarUrl, index) => (
              <Box
                key={index}
                sx={{
                  cursor: 'pointer',
                  border: profileData.avatar === avatarUrl ? '3px solid #e50914' : '3px solid transparent',
                  borderRadius: '8px',
                  p: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: '3px solid #fff',
                  }
                }}
                onClick={() => handleSelectAvatar(avatarUrl)}
              >
                <Avatar 
                  src={avatarUrl} 
                  sx={{ width: 80, height: 80 }}
                  variant="rounded"
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseChangeAvatar}
            sx={{ color: '#8c8c8c' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};
export default MainHeader;
