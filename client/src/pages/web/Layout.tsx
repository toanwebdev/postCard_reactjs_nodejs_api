import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from '../../components/web/Header/Header'

const Layout = () => {
	return (
		<Box>
			<Header />
			<Outlet />
		</Box>
	)
}

export default Layout
