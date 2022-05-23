import { Box, TextareaAutosize, TextField, Tooltip } from '@mui/material'
import { useField } from 'formik'
import { useState } from 'react'

interface InputFieldProps {
	name: string
	placeholder?: string
	label?: string
	type: string
	textarea?: boolean
	required?: boolean
	value?: string | number
	fullWidth?: boolean
	autoFocus?: boolean
}

const InputField = ({ textarea, ...props }: InputFieldProps) => {
	const [field, { error, touched }] = useField(props)
	const [onShow, setOnShow] = useState(false)

	let body
	if (textarea) {
		body = <TextareaAutosize {...field} id={field.name} {...props} />
	} else {
		body = (
			<Box sx={{ position: 'relative' }}>
				<TextField
					margin='dense'
					error={error && touched ? true : false}
					helperText={error && touched ? error : null}
					{...field}
					id={field.name}
					{...props}
					type={
						props.type === 'password'
							? `${onShow ? 'text' : 'password'}`
							: props.type
					}
				/>
				{props.type === 'password' ? (
					<Box
						sx={{
							position: 'absolute',
							top: '8px',
							right: '0px',
							fontSize: '22px',
							height: '55px',
							width: '55px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Tooltip title={onShow ? 'Ẩn' : 'Hiển thị'} arrow placement='top'>
							<i
								className={`bx bx-${onShow ? 'show-alt' : 'hide'}`}
								style={{ cursor: 'pointer' }}
								onClick={() => setOnShow(!onShow)}></i>
						</Tooltip>
					</Box>
				) : null}
			</Box>
		)
	}

	return <>{body}</>
}

export default InputField
