import { forwardRef } from 'react';
import { Input as BaseInput, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/system';

const Input = forwardRef(function CustomInput(props, ref) {
  return <BaseInput slots={{ input: InputElement }} {...props} ref={ref} />;
});

export default function UnstyledInputIntroduction({ type, options = [], ...props }) {
  if (type === 'select') {
    return (
      <Select {...props}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    );
  }

  return <Input type={type} {...props} />;
}

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const InputElement = styled('input')(({ theme }) => `
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #6f6f6f;
  // border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  // background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  // color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};

  &::before {
    border-bottom: 0 !important;
  }

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    outline: none;
  }
`);