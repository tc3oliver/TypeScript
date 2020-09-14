import React, { Component } from 'react';
import axios from 'axios';
import qs from 'qs';
import { Form, Input, Button, message } from 'antd';
import { Redirect } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';
import './style.css';

interface LoginFormFields {
  password: string;
}

interface ApiResult {
  data: {
    result: boolean;
    errMsg: string;
    data: any;
  };
}

class LoginForm extends Component {
  state = {
    isLogin: false,
  };

  onFinish = (values: LoginFormFields) => {
    axios
      .post('/api/login', qs.stringify({ password: values.password }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((res: ApiResult) => {
        this.setState({
          isLogin: res.data.result,
        });
        if (!res.data.result) {
          message.error(res.data.errMsg);
        }
      });
  };

  render() {
    const { isLogin } = this.state;

    return isLogin ? (
      <Redirect to='/' />
    ) : (
      <div className='login-page'>
        <Form
          name='normal_login'
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
        >
          <Form.Item
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input prefix={<LockOutlined className='site-form-item-icon' />} type='password' placeholder='Password' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' className='login-form-button'>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default LoginForm;
