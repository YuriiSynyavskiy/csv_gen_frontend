import React, { useState, useEffect } from 'react';
import { MinusCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Select, Collapse, Button, Popconfirm, Row, Col, Divider, InputNumber } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import './Schema.css';
import Schema from './Schema';
const style = { padding: '8px 0' };
const { Panel } = Collapse;
const columns = [
    {
        title: '#',
        dataIndex: 'index',
    },
    {
        title: 'Created',
        dataIndex: 'created_at',
        render: (created_at) => new Date(created_at).toLocaleDateString(),
    },
    {
        title: 'Status',
        dataIndex: 'status',
    },
    {
        title: 'Generating status',
        dataIndex: 'line_status',
    },
    {
        actions: 'Actions',
        dataIndex: 'file'
    },
];

function getSchemas() {
    let url = process.env.REACT_APP_BASE_URL;
    return fetch(url + "/api/schema/list",
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
            for (let i = 0; i < result.length; i++) {
                for (let j = 1; j <= result[i]?.columns?.length || 0; j++) {
                    result[i].columns[j - 1].from = result[i].columns[j - 1].col_filter.from
                    result[i].columns[j - 1].to = result[i].columns[j - 1].col_filter.to
                    result[i].columns[j - 1].length = result[i].columns[j - 1].col_filter.length
                }
            }
            for (let i = 0; i < result.length; i++) {
                for (let j = 1; j <= result[i]?.datasets?.length || 0; j++) {
                    result[i].datasets[j - 1].index = j
                }
            }
            return result;
        })
        .catch(error => console.log(error))
}

export default function Reports() {
    const { isLogined } = useSelector(({ auth }) => auth)
    const [row, setRow] = useState(500);
    const history = useHistory();
    useEffect(async () => {
        if (!isLogined) {
            history.push('/login')
        }
    }, [isLogined])
    const [schemas, setSchemas] = useState([]);
    useEffect(async () => {
        let res = await getSchemas()
        setSchemas(res)
    }, [])
    function onEditClick(schema) {
        history.push({ pathname: '/schema', state: schema })
    }
    function onDeleteClick(schema) {
        setSchemas(schemas.filter((elem) => elem.id !== schema.id))
        fetch(process.env.REACT_APP_BASE_URL + "/api/schema/",
            {
                method: 'DELETE', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(schema)
            })
    }
    function generateDataset(schema, row) {
        fetch(process.env.REACT_APP_BASE_URL + "/api/dataset/",
            {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ schema: schema.id, rows: row })
            })
            .then(response => response.json())
            .then(result => {
                result.index = (schema?.datasets?.length || 0) + 1
                for (let i = 0; i < schemas.length; i++) {
                    if (schemas[i].id == schema.id) {
                        schemas[i].datasets.push(result);
                    }

                }
                setSchemas([...schemas]);
                const interval = setInterval(() => {
                    fetch(process.env.REACT_APP_BASE_URL + `/api/dataset/?id=${result.id}`,
                        {
                            method: 'GET', // or 'PUT'
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Token ${localStorage.getItem('token')}`
                            },
                        }).then(response => response.json())
                        .then(result => {
                            if (result.status == "Ready") {
                                clearInterval(interval);
                            }
                            for (let i = 0; i < schemas.length; i++) {
                                for (let j = 0; j < schemas[i].datasets.length; j++) {
                                    if (schemas[i].datasets[j].id === result.id) {
                                        schemas[i].datasets[j].line_status = `${result.line_status}/${result.rows}`
                                        schemas[i].datasets[j].status = result.status
                                    }
                                }
                            }
                            setSchemas([...schemas]);

                        })
                }, 1000);
            })
            .catch(error => console.log(error))
    }
    return (
        <Collapse>
            {schemas.length &&
                schemas.map(schema => (

                    <Panel header={
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                {schema.name}
                            </div>
                            <div>
                                <Button onClick={() => onEditClick(schema)} icon={<EditOutlined />} shape="circle">
                                </Button>
                                <Popconfirm
                                    title="Are you sure to delete this schema?"
                                    onConfirm={() => onDeleteClick(schema)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button icon={<DeleteOutlined />} shape="circle">
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>} key={schema.id} >
                        <InputNumber defaultValue={row} onChange={setRow} />
                        <Button type="primary" onClick={() => generateDataset(schema, row)}>Generate</Button>
                        <Divider orientation="left"></Divider>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={3}>
                                <div style={style}>#</div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div style={style}>Created</div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div style={style}>Status</div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div style={style}>Generating Status</div>
                            </Col>
                            <Col className="gutter-row" span={3}>
                                <div style={style}>Actions</div>
                            </Col>
                        </Row>
                        {
                            schema?.datasets?.map((dataset, index) => (

                                <Row gutter={16}>
                                    <Col className="gutter-row" span={3}>
                                        <div style={style}>{index + 1}</div>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        <div style={style}>{dataset.created_at}</div>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        <div style={style}>{dataset.status}</div>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        <div style={style}>{dataset.line_status || `${dataset.rows}/${dataset.rows}`}</div>
                                    </Col>
                                    <Col className="gutter-row" span={3}>
                                        <div style={style}>{
                                            dataset.status == "Ready" &&
                                            <a href={`${process.env.REACT_APP_BASE_URL}/api/dataset/download/${dataset.id}`}>Download</a>}
                                        </div>
                                    </Col>
                                </Row>

                            ))
                        }

                    </Panel >
                ))
            }
        </Collapse >
    )
}