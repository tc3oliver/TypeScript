import React from 'react';
import { Form, Input, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import './login.css';

interface LoginFormProps {
  password: string;
}

const NormalLoginForm = () => {
  const onFinish = (values: LoginFormProps) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className='login-page'>
      <Form
        name='normal_login'
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
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
};

export default NormalLoginForm;
