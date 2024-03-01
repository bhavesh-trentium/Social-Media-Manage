import React from 'react'
import { Form, Input } from 'antd'
import TextField from '@mui/material/TextField';


export const Inputs = (props: any) => {
    return (<>

        <TextField
            name={props.nam}
            style={props.style}
            onChange={props.change}
            type={props.typs}
            value={props.value}
            fullWidth sx={{ m: 1 }}
            className='text-field'
            id="standard-basic" label={`Enter ${props.holder}`} variant="standard" />
    </>
    )
}


export const Inputdefault = (props: any) => {
    return (<>
        <Form.Item
            name={props.nam}
            className={props.class}
        >
            <Input
                bordered={props.border}
                placeholder={`Enter ${props.holder}`}
                type={props.typs} />
        </Form.Item>
    </>
    )
}