import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, message } from 'antd';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';
import moment from 'moment';
import './style.css';

interface ApiResult {
  data: {
    result: boolean;
    errMsg: string;
    data: any;
  };
}

interface MovieItem {
  name: string;
  level: string;
}

interface State {
  isLogin: boolean;
  loaded: boolean;
  data: {
    [key: string]: MovieItem[];
  };
}

class Home extends Component {
  state: State = {
    isLogin: true,
    loaded: false,
    data: {},
  };

  componentDidMount() {
    axios.get('/api/isLogin').then((res: ApiResult) => {
      this.setState({
        isLogin: res.data.data,
        loaded: true,
      });
    });

    axios.get('/api/showData').then((res: ApiResult) => {
      if (res.data.result) {
        this.setState({
          data: res.data.data,
        });
      }
    });
  }

  handleLogoutClick: (event: React.MouseEvent) => void = () => {
    axios.get('/api/logout').then((res: ApiResult) => {
      this.setState({
        isLogin: !res.data.result,
      });
      if (!res.data.result) {
        message.error('登出失敗');
      }
    });
  };

  handleCrawlerClick: (event: React.MouseEvent) => void = () => {
    axios.get('/api/getData').then((res: ApiResult) => {
      if (res.data.result) {
        message.success('爬蟲成功');
      } else {
        message.error('爬蟲失敗');
      }
    });
  };

  getOption: () => echarts.EChartOption = () => {
    const { data } = this.state;
    const time = moment(Number(Object.keys(data).shift()));
    const movieName: string[] = [];
    const movieLevel: number[] = [];
    if (time.isValid()) {
      const mn = Object.values(data).shift();
      mn?.forEach((mi) => {
        movieName.push(mi.name);
        movieLevel.push(Number(mi.level.replace('%', '')));
      });
    }

    return {
      title: {
        text: time.format('MM-DD HH:mm'),
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: movieName,
      },
      series: [
        {
          type: 'bar',
          data: movieLevel,
        },
      ],
    };

    // return {
    //   title: {
    //     text: time.format('MM-DD HH:mm'),
    //   },
    //   xAxis: {
    //     type: 'category',
    //     data: movieName,
    //   },
    //   yAxis: {
    //     type: 'value',
    //   },
    //   series: [
    //     {
    //       data: movieLevel,
    //       type: 'bar',
    //       showBackground: true,
    //       backgroundStyle: {
    //         color: 'rgba(220, 220, 220, 0.8)',
    //       },
    //     },
    //   ],
    // };
  };

  render() {
    const { isLogin, loaded } = this.state;
    if (isLogin) {
      if (loaded) {
        return (
          <div className='home-page'>
            <div className='buttons'>
              <Button type='primary' onClick={this.handleCrawlerClick}>
                爬蟲
              </Button>
              <Button type='primary' onClick={this.handleLogoutClick}>
                登出
              </Button>
            </div>

            <ReactEcharts option={this.getOption()} />
          </div>
        );
      }
      return null;
    }
    return <Redirect to='/login' />;
  }
}

export default Home;
