import { MinusCircleOutlined, PlusOutlined, DownloadOutlined, SettingOutlined } from '@ant-design/icons';
import { Select, Form, Input, Button, Space, notification, Progress, InputNumber } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import './Schema.css';
const { Option } = Select;


function getChoices() {
    let url = process.env.REACT_APP_BASE_URL;
    let choices;
    return fetch(url + "/api/column/list",
        {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
        })
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => console.log(error))
}




export default function Schema(props) {
    const [columns, setColumns] = useState(props?.location?.state?.columns || []);
    const history = useHistory();
    const [form] = Form.useForm()
    const [edited, setEdited] = useState(false);
    function onFinish(event) {
        event.columns.sort(function (a, b) { return a - b });
        for (let i = 0; i < event.columns.length; i++) {
            event.columns[i].order = i;
        }
        let url = process.env.REACT_APP_BASE_URL;
        let method, body = event;
        if (props?.location?.state?.id) {
            method = "PATCH";
            body.id = props.location.state.id;
        }
        else {
            method = "POST";
        }
        fetch(url + "/api/schema/",
            {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(result => {
                history.push("/reports")
                setEdited(false);
            }).catch((error) => {
                notification.open({
                    message: error.message || error.body,
                    description: error,
                })
            });
    }


    function onFormChanged() {
        setEdited(true);
    }
    const { isLogined } = useSelector(({ auth }) => auth)
    useEffect(async () => {
        if (!isLogined) {
            history.push('/login')
        }
    }, [isLogined])
    const [choices, setChoices] = useState();

    const [progress, setProgress] = useState(0);
    useEffect(async () => {
        let res = await getChoices()
        setChoices(res)

    }, [])
    return (
        <Form form={form} onFieldsChange={onFormChanged} initialValues={{ columns }} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
            <Form.Item initialValue={props?.location?.state?.name || ''} label="Schema Name"
                name="name"

                rules={[{ required: true, message: 'Please input schema name!' }]}>
                < Input size="large" />
            </Form.Item>
            <div style={{ display: "flex" }}>
                < Form.Item
                    label="Delimeter"
                    initialValue={props?.location?.state?.delimeter || ''}
                    name="delimeter"
                    rules={[{ required: true, message: 'Missing delimeter' }]}

                >
                    <Select style={{ width: 130 }}>
                        <Option value='Comma (,)'>
                            Comma (,)
                    </Option>
                        <Option value='Tab (   )'>
                            Tab (   )
                    </Option>
                        <Option value='Semicolon (;)'>
                            Semicolon (;)
                    </Option>
                        <Option value='Pipe (|)'>
                            Pipe (|)
                    </Option>
                    </Select>
                </Form.Item>
                < Form.Item
                    style={{ marginLeft: "5%" }}
                    label="Quote"
                    initialValue={props?.location?.state?.quote || ''}
                    name="quote"
                    rules={[{ required: true, message: 'Missing quote' }]}

                >
                    <Select style={{ width: 130 }}>
                        <Option value="Single-quote (')">
                            Single-quote (')
                    </Option>
                        <Option value='Double-qoute (")'>
                            Double-qoute (")
                    </Option>
                    </Select>
                </Form.Item>
            </div>
            <Form.List name="columns">
                {(columns, { add, remove }) => (
                    <>
                        {columns.map(column => (
                            < Space key={column.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    {...column}
                                    name={[column.name, 'name']}
                                    fieldKey={[`name_${column.id}`, 'name']}
                                    rules={[{ required: true, message: 'Missing column name' }]}
                                >
                                    < Input size="large" placeholder="type here" />
                                </Form.Item>

                                <Form.Item
                                    noStyle
                                    dependencies={[column.name, column.id, column.order, column.col_type]}
                                    shouldUpdate={true
                                    }
                                >
                                    {(columns) => (
                                        <div key={`div_${column.id}`}>
                                            < Form.Item
                                                {...column}
                                                label="Type"

                                                name={[column.name, 'col_type']}
                                                fieldKey={[`type_${column.id}`, 'col_type']}
                                                rules={[{ required: true, message: 'Missing type' }]}

                                            >
                                                <Select style={{ width: 130 }}>
                                                    {choices?.map(item => (
                                                        <Option key={item.id} value={item}>
                                                            {item}
                                                        </Option>

                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                {...column}
                                                label="Order"
                                                name={[column.name, 'order']}
                                                key={`order_${column.id}`}
                                                fieldKey={[`order_${column.id}`, 'order']}
                                                rules={[{ required: true, message: 'Missing order' }]}>
                                                <InputNumber />
                                            </Form.Item>
                                            {(columns.getFieldsValue(column.id)?.columns ? columns.getFieldsValue(column.id).columns[column.name]?.col_type : '') === "Integer" &&
                                                <div style={{ display: "flex" }}>
                                                    <Form.Item
                                                        {...column}
                                                        label="From"
                                                        name={[column.name, 'from']}
                                                        key={`from_${column.id}`}
                                                        fieldKey={[`from_${column.id}`, 'from']}
                                                        rules={[{ required: true, message: 'Missing from range' }]}>
                                                        <InputNumber />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...column}
                                                        label="To"
                                                        name={[column.name, 'to']}
                                                        key={`to_${column.id}`}
                                                        fieldKey={[`to_${column.id}`, 'to']}
                                                        rules={[{ required: true, message: 'Missing to range' }]}>
                                                        <InputNumber />
                                                    </Form.Item>
                                                </div>

                                            }
                                            {(columns.getFieldsValue(column.id)?.columns ? columns.getFieldsValue(column.id).columns[column.name]?.col_type : '') === "Text" &&
                                                <div style={{ display: "flex" }}>
                                                    <Form.Item
                                                        {...column}
                                                        label="Length"
                                                        name={[column.name, 'length']}
                                                        key={`length_${column.id}`}
                                                        fieldKey={[`length_${column.id}`, 'length']}
                                                        rules={[{ required: true, message: 'Missing length range' }]}>
                                                        <InputNumber />
                                                    </Form.Item>
                                                </div>

                                            }
                                        </div>
                                    )}
                                </Form.Item>



                                <MinusCircleOutlined onClick={() => remove(column.name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add field
              </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item>
                {edited &&
                    < Button type="primary" htmlType="submit" style={{
                        marginLeft: "2%"
                    }}>
                        Submit
                        </Button>
                }

            </Form.Item>
        </Form >

    )
}