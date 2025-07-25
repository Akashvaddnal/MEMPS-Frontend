// import * as React from 'react';
// import {
//   Button,
//   FormControl,
//   Checkbox,
//   FormControlLabel,
//   InputLabel,
//   OutlinedInput,
//   TextField,
//   InputAdornment,
//   Link,
//   Alert,
//   IconButton,
// } from '@mui/material';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import { AppProvider } from '@toolpad/core/AppProvider';
// import { SignInPage } from '@toolpad/core/SignInPage';
// import { useTheme } from '@mui/material/styles';

// const providers = [{ id: 'credentials', name: 'Email and Password' }];

// function CustomEmailField() {
//   return (
//     <TextField
//       id="input-with-icon-textfield"
//       label="Email"
//       name="email"
//       type="email"
//       size="small"
//       required
//       fullWidth
//       slotProps={{
//         input: {
//           startAdornment: (
//             <InputAdornment position="start">
//               <AccountCircle fontSize="inherit" />
//             </InputAdornment>
//           ),
//         },
//       }}
//       variant="outlined"
//     />
//   );
// }

// function CustomPasswordField() {
//   const [showPassword, setShowPassword] = React.useState(false);

//   const handleClickShowPassword = () => setShowPassword((show) => !show);

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   return (
//     <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
//       <InputLabel size="small" htmlFor="outlined-adornment-password">
//         Password
//       </InputLabel>
//       <OutlinedInput
//         id="outlined-adornment-password"
//         type={showPassword ? 'text' : 'password'}
//         name="password"
//         size="small"
//         endAdornment={
//           <InputAdornment position="end">
//             <IconButton
//               aria-label="toggle password visibility"
//               onClick={handleClickShowPassword}
//               onMouseDown={handleMouseDownPassword}
//               edge="end"
//               size="small"
//             >
//               {showPassword ? (
//                 <VisibilityOff fontSize="inherit" />
//               ) : (
//                 <Visibility fontSize="inherit" />
//               )}
//             </IconButton>
//           </InputAdornment>
//         }
//         label="Password"
//       />
//     </FormControl>
//   );
// }

// function CustomButton() {
//   return (
//     <Button
//       type="submit"
//       variant="outlined"
//       color="info"
//       size="small"
//       disableElevation
//       fullWidth
//       sx={{ my: 2 }}
//     >
//       Log In
//     </Button>
//   );
// }

// function SignUpLink() {
//   return (
//     <Link href="/" variant="body2">
//       Sign up
//     </Link>
//   );
// }

// function ForgotPasswordLink() {
//   return (
//     <Link href="/" variant="body2">
//       Forgot password?
//     </Link>
//   );
// }

// function Title() {
//   return <h2 style={{ marginBottom: 8 }}>Login</h2>;
// }

// function Subtitle() {
//   return (
//     <Alert sx={{ mb: 2, px: 1, py: 0.25, width: '100%' }} severity="warning">
//       We are investigating an ongoing outage.
//     </Alert>
//   );
// }

// function RememberMeCheckbox() {
//   const theme = useTheme();
//   return (
//     <FormControlLabel
//       label="Remember me"
//       control={
//         <Checkbox
//           name="remember"
//           value="true"
//           color="primary"
//           sx={{ padding: 0.5, '& .MuiSvgIcon-root': { fontSize: 20 } }}
//         />
//       }
//       slotProps={{
//         typography: {
//           color: 'textSecondary',
//           fontSize: theme.typography.pxToRem(14),
//         },
//       }}
//     />
//   );
// }

// export default function SlotsSignIn() {
//   const theme = useTheme();
//   return (
//     <AppProvider theme={theme}>
//       <SignInPage
//         signIn={(provider, formData) =>
//           alert(
//             `Logging in with "${provider.name}" and credentials: ${formData.get('email')}, ${formData.get('password')}, and checkbox value: ${formData.get('remember')}`,
//           )
//         }
//         slots={{
//           title: Title,
//           subtitle: Subtitle,
//           emailField: CustomEmailField,
//           passwordField: CustomPasswordField,
//           submitButton: CustomButton,
//           signUpLink: SignUpLink,
//           rememberMe: RememberMeCheckbox,
//           forgotPasswordLink: ForgotPasswordLink,
//         }}
//         slotProps={{ form: { noValidate: true } }}
//         providers={providers}
//       />
//     </AppProvider>
//   );
// }


import React, { useState } from "react";
import {
  Button,
  FormControl,
  Checkbox,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  Alert,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { AUTH_ENDPOINTS } from "../API_ENDPOINTS/API";

// Assuming these dashboard components exist and are imported as below
import DashboardLayoutAccountSidebar from "./DashboardLayoutAccountSidebar";
import AdminDashboard from "./AdminDashboard";
import SystemAdminDashboard from "./SystemAdminDashboard";

const providers = [{ id: "credentials", name: "Email and Password" }];

function CustomEmailField({ value, onChange }) {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Email"
      name="email"
      type="email"
      size="small"
      required
      fullWidth
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccountCircle fontSize="inherit" />
          </InputAdornment>
        ),
      }}
      variant="outlined"
    />
  );
}

function CustomPasswordField({ value, onChange }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined" size="small">
      <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        name="password"
        value={value}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? <VisibilityOff fontSize="inherit" /> : <Visibility fontSize="inherit" />}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

function CustomButton({ loading }) {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
      disabled={loading}
    >
      {loading ? <CircularProgress size={24} /> : "Log In"}
    </Button>
  );
}

function SignUpLink() {
  return (
    <Link href="/" variant="body2" underline="hover">
      Sign up
    </Link>
  );
}

function ForgotPasswordLink() {
  return (
    <Link href="/" variant="body2" underline="hover">
      Forgot password?
    </Link>
  );
}

function Title() {
  return (
    <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
      Login
    </Typography>
  );
}

function Subtitle() {
  return (
    <Alert sx={{ mb: 2, px: 1, py: 0.5, width: "100%" }} severity="warning">
      We are investigating an ongoing outage.
    </Alert>
  );
}

function RememberMeCheckbox({ checked, onChange }) {
  const theme = useTheme();
  return (
    <FormControlLabel
      label="Remember me"
      control={
        <Checkbox
          name="remember"
          value="true"
          color="primary"
          checked={checked}
          onChange={onChange}
          sx={{ padding: 0.5, "& .MuiSvgIcon-root": { fontSize: 20 } }}
        />
      }
      sx={{ mb: 2 }}
      componentsProps={{
        typography: {
          color: "text.secondary",
          fontSize: theme.typography.pxToRem(14),
        },
      }}
    />
  );
}

function DashboardPage() {
  // Dashboard page showing all three components as requested
  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
      <DashboardLayoutAccountSidebar />
      <AdminDashboard />
      <SystemAdminDashboard />
    </Box>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage(errorText || "Login failed");
        setLoading(false);
        return;
      }

      const token = await response.text(); // your backend returns token as plain string
      if (!token) {
        setErrorMessage("Failed to retrieve authentication token.");
        setLoading(false);
        return;
      }

      // Store token (using localStorage, can customize)
      localStorage.setItem("authToken", token);

      // Optionally store remember me in localStorage or cookies
      if (remember) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      setLoading(false);

      // Navigate to dashboard page on successful login
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Network or server error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 360,
          mx: "auto",
          mt: 6,
          px: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Title />
        <Subtitle />
        {errorMessage && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
          <CustomEmailField value={email} onChange={(e) => setEmail(e.target.value)} />
          <CustomPasswordField value={password} onChange={(e) => setPassword(e.target.value)} />
          <RememberMeCheckbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <CustomButton loading={loading} />
        </Box>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <SignUpLink />
          <ForgotPasswordLink />
        </Box>
      </Box>
    </>
  );
}
