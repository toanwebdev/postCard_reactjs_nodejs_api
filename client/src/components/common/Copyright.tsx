import { Link, Typography } from '@mui/material'

const Copyright = (props: any) => {
	return (
		<Typography
			variant='body2'
			color='text.secondary'
			align='center'
			{...props}>
			{'Copyright © '}
			<Link
				target='_blank'
				color='inherit'
				href='https://www.facebook.com/toando2001/'>
				facebook.com/toando2001
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	)
}

export default Copyright
