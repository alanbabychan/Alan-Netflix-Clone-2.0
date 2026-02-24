import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Link,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from 'react-redux';
import { login } from 'src/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

interface User {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) setUsers(JSON.parse(storedUsers));
  }, []);

  const handleLogin = () => {
    const user = users.find(
      (u) =>
        (u.email === loginData.identifier || u.mobile === loginData.identifier) &&
        u.password === loginData.password
    );
    if (user) {
      dispatch(login(user));
      navigate('/browse');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      firstName: 'Guest',
      lastName: 'User',
      mobile: '',
      email: 'guest@netflix.com',
      password: '',
    };
    dispatch(login(guestUser));
    navigate('/browse');
  };

  const validateEmail = (email: string) => {
    return email.includes('@') && email.length > 0;
  };

  const validateMobile = (mobile: string) => {
    return /^\d{10}$/.test(mobile);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(password);
  };

  const handleSignup = () => {
    if (!signupData.firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!signupData.lastName.trim()) {
      setError('Last name is required');
      return;
    }
    if (!signupData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!signupData.mobile.trim()) {
      setError('Mobile number is required');
      return;
    }
    if (!signupData.password.trim()) {
      setError('Password is required');
      return;
    }
    if (!signupData.confirmPassword.trim()) {
      setError('Confirm password is required');
      return;
    }
    if (!validateEmail(signupData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!validateMobile(signupData.mobile)) {
      setError('Mobile number must be exactly 10 digits');
      return;
    }
    if (!validatePassword(signupData.password)) {
      setError('Password must be at least 6 characters with letters and numbers');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const existingUser = users.find(
      (u) => u.email === signupData.email || u.mobile === signupData.mobile
    );
    if (existingUser) {
      setError('User already exists with this email or mobile');
      return;
    }

    const newUser: User = {
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      mobile: signupData.mobile,
      email: signupData.email,
      password: signupData.password,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setError('');
    setTab('login');
  };

  const handleForgotPassword = () => {
    const user = users.find((u) => u.email === forgotEmail);
    if (user) {
      alert(`Your password is: ${user.password}`);
    } else {
      setError('Email not found');
    }
  };

  const handleToggleLoginPassword = () => setShowLoginPassword((s) => !s);
  const handleToggleSignupPassword = () => setShowSignupPassword((s) => !s);
  const handleToggleSignupConfirmPassword = () =>
    setShowSignupConfirmPassword((s) => !s);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%), url("https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-ecd7979cc88b/a3873901-5b7c-46eb-b9fa-12fea5197bd3/IN-en-20240311-popsignuptwoweeks-perspective_alpha_website_large.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Netflix Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: { xs: 2, md: 4 },
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#e50914',
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          NETFLIX
        </Typography>
        {tab !== 'login' && (
          <Button
            onClick={() => setTab('login')}
            sx={{
              color: 'white',
              border: '1px solid white',
              borderRadius: '4px',
              px: 2,
              py: 0.5,
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Sign In
          </Button>
        )}
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          pt: { xs: 10, md: 0 },
        }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(0,0,0,0.75)',
            borderRadius: '4px',
            p: { xs: 3, md: 4 },
            width: '100%',
            maxWidth: tab === 'login' ? '450px' : '500px',
            minHeight: tab === 'login' ? '600px' : 'auto',
            boxShadow: 'none',
          }}
        >
          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2, 
                bgcolor: '#e87c03',
                color: 'white',
                '& .MuiAlert-icon': {
                  color: 'white'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 3,
                  fontSize: { xs: '1.75rem', md: '2rem' },
                }}
              >
                Sign In
              </Typography>
              
              <TextField
                fullWidth
                placeholder="Email or phone number"
                value={loginData.identifier}
                onChange={(e) =>
                  setLoginData({ ...loginData, identifier: e.target.value })
                }
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#333',
                    borderRadius: '4px',
                    boxShadow: 'none',
                    '& fieldset': {
                      borderColor: '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: '#fff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fff',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                    padding: '16px 14px',
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#8c8c8c',
                    opacity: 1,
                  },
                }}
              />
              
              <TextField
                fullWidth
                placeholder="Password"
                type={showLoginPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#333',
                    borderRadius: '4px',
                    boxShadow: 'none',
                    '& fieldset': {
                      borderColor: '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: '#fff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fff',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                    padding: '16px 14px',
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#8c8c8c',
                    opacity: 1,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleLoginPassword}
                        edge="end"
                        sx={{ color: '#8c8c8c' }}
                      >
                        {showLoginPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
                sx={{
                  bgcolor: '#e50914',
                  color: 'white',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                  textTransform: 'none',
                  mb: 2,
                  '&:hover': {
                    bgcolor: '#f40612',
                  },
                }}
              >
                Sign In
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleGuestLogin}
                sx={{
                  borderColor: '#808080',
                  color: '#808080',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                  textTransform: 'none',
                  mb: 2,
                  '&:hover': {
                    borderColor: '#fff',
                    color: '#fff',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Continue as Guest
              </Button>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        color: '#b3b3b3',
                        '&.Mui-checked': {
                          color: '#b3b3b3',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: '#b3b3b3', fontSize: '0.875rem' }}>
                      Remember me
                    </Typography>
                  }
                />
                <Link
                  component="button"
                  onClick={() => setTab('forgot')}
                  sx={{
                    color: '#b3b3b3',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Need help?
                </Link>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ color: '#737373', fontSize: '1rem', mb: 1 }}>
                  New to Netflix?{' '}
                  <Link
                    component="button"
                    onClick={() => setTab('signup')}
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign up now
                  </Link>
                  .
                </Typography>
                <Typography sx={{ color: '#8c8c8c', fontSize: '0.8rem', lineHeight: 1.4 }}>
                  This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
                  <Link sx={{ color: '#0071eb', textDecoration: 'none' }}>Learn more.</Link>
                </Typography>
              </Box>
            </Box>
          )}

          {/* SIGN UP FORM */}
          {tab === 'signup' && (
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 3,
                  fontSize: { xs: '1.75rem', md: '2rem' },
                }}
              >
                Sign Up
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="First Name"
                  value={signupData.firstName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, firstName: capitalizeFirstLetter(e.target.value) })
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#333',
                      borderRadius: '4px',
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#fff',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#fff',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                      padding: '16px 14px',
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: '#8c8c8c',
                      opacity: 1,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  placeholder="Last Name"
                  value={signupData.lastName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, lastName: capitalizeFirstLetter(e.target.value) })
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#333',
                      borderRadius: '4px',
                      '& fieldset': {
                        borderColor: '#333',
                      },
                      '&:hover fieldset': {
                        borderColor: '#fff',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#fff',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'white',
                      padding: '16px 14px',
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: '#8c8c8c',
                      opacity: 1,
                    },
                  }}
                />
              </Box>
              
              <TextField
                fullWidth
                placeholder="Email or phone number"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#333',
                    borderRadius: '4px',
                    '& fieldset': {
                      borderColor: '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: '#fff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fff',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                    padding: '16px 14px',
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#8c8c8c',
                    opacity: 1,
                  },
                }}
              />
              
              <TextField
                fullWidth
                placeholder="Mobile Number"
                value={signupData.mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setSignupData({ ...signupData, mobile: value });
                }}
                inputProps={{ maxLength: 10 }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#333',
                    borderRadius: '4px',
                    '& fieldset': {
                      borderColor: '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: '#fff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fff',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                    padding: '16px 14px',
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#8c8c8c',
                    opacity: 1,
                  },
                }}
              />
              
              <TextField
                fullWidth
                placeholder="Password"
                type={showSignupPassword ? 'text' : 'password'}
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#333',
                    borderRadius: '4px',
                    '& fieldset': {
                      borderColor: '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: '#fff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fff',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                    padding: '16px 14px',
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#8c8c8c',
                    opacity: 1,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleSignupPassword}
                        edge="end"
                        sx={{ color: '#8c8c8c' }}
                      >
                        {showSignupPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                fullWidth
                placeholder="Confirm Password"
                type={showSignupConfirmPassword ? 'text' : 'password'}
                value={signupData.confirmPassword}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    confirmPassword: e.target.value,
                  })
                }
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#333',
                    borderRadius: '4px',
                    '& fieldset': {
                      borderColor: '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: '#fff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fff',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                    padding: '16px 14px',
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#8c8c8c',
                    opacity: 1,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleSignupConfirmPassword}
                        edge="end"
                        sx={{ color: '#8c8c8c' }}
                      >
                        {showSignupConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                fullWidth
                variant="contained"
                onClick={handleSignup}
                sx={{
                  bgcolor: '#e50914',
                  color: 'white',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                  textTransform: 'none',
                  mb: 3,
                  '&:hover': {
                    bgcolor: '#f40612',
                  },
                }}
              >
                Sign Up
              </Button>
              
              <Box>
                <Typography sx={{ color: '#737373', fontSize: '1rem', mb: 1 }}>
                  Already have an account?{' '}
                  <Link
                    component="button"
                    onClick={() => setTab('login')}
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign in now
                  </Link>
                  .
                </Typography>
                <Typography sx={{ color: '#8c8c8c', fontSize: '0.8rem', lineHeight: 1.4 }}>
                  This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
                  <Link sx={{ color: '#0071eb', textDecoration: 'none' }}>Learn more.</Link>
                </Typography>
              </Box>
            </Box>
          )}

          {/* FORGOT PASSWORD */}
          {tab === 'forgot' && (
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '1.75rem', md: '2rem' },
                }}
              >
                Forgot Password?
              </Typography>
              
              <Typography
                sx={{
                  color: '#b3b3b3',
                  mb: 3,
                  fontSize: '1rem',
                  lineHeight: 1.4,
                }}
              >
                We will send you an email with instructions on how to reset your password.
              </Typography>
              
              <TextField
                fullWidth
                placeholder="Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#333',
                    borderRadius: '4px',
                    '& fieldset': {
                      borderColor: '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: '#fff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fff',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'white',
                    padding: '16px 14px',
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#8c8c8c',
                    opacity: 1,
                  },
                }}
              />
              
              <Button
                fullWidth
                variant="contained"
                onClick={handleForgotPassword}
                sx={{
                  bgcolor: '#e50914',
                  color: 'white',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                  textTransform: 'none',
                  mb: 2,
                  '&:hover': {
                    bgcolor: '#f40612',
                  },
                }}
              >
                Email Me
              </Button>
              
              <Link
                component="button"
                onClick={() => setTab('login')}
                sx={{
                  color: '#0071eb',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  display: 'block',
                  textAlign: 'center',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Back to Sign In
              </Link>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
