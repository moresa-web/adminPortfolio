import React, { useEffect, useRef, useState } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import axios from 'axios'
import Cookies from 'js-cookie'

const MainChart = ({ loading, setLoading, ChartType, setVisitCount, setVisitorCount, setUserCount }) => {
  const chartRef = useRef(null)
  const [visitorChart, setVisitorChart] = useState([]);
  const [visitChart, setVisitChart] = useState([]);
  const [userChart, setUserChart] = useState([]);

  // تابع گرفتن داده‌ها برای نمودارها
  const GetVisitsForChart = async (date, isVisitor) => {
    try {
      const response = await axios({
        method: 'GET',
        headers: { Authorization: 'Bearer ' + Cookies.get('token') },
        url: `https://localhost:7239/api/v1/Visitor/ForChart/${date}/` + isVisitor
      });
      if (isVisitor) {
        setVisitorChart(response.data.data);
        setVisitorCount(response.data.data.value.reduce((a, b) => a + parseInt(b, response.data.data.value.length), 0));
      } else {
        setVisitChart(response.data.data);
        setVisitCount(response.data.data.value.reduce((a, b) => a + parseInt(b, response.data.data.value.length), 0));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetUsersForChart = async (date) => {
    try {
      const response = await axios({
        method: 'GET',
        headers: { Authorization: 'Bearer ' + Cookies.get('token') },
        url: `https://localhost:7239/api/v1/User/Chart/${date}`
      });
      setUserChart(response.data.data);
      setUserCount(response.data.data.value.reduce((a, b) => a + parseInt(b, response.data.data.value.length), 0));
    } catch (error) {
      console.error(error);
    }
  };

  // تابع برای دریافت داده‌ها و به‌روزرسانی نمودارها
  const setData = () => {
    if (loading) {
      GetVisitsForChart(ChartType, false);
      GetVisitsForChart(ChartType, true);
      GetUsersForChart(ChartType);
      setLoading(false); // تغییر وضعیت loading به false بعد از دریافت داده‌ها
    }
  }

  useEffect(() => {
    // تنظیم اولیه داده‌ها و سپس تنظیم تایمر
    setData();

    const intervalId = setInterval(() => {
      setData(); // به‌روزرسانی داده‌ها هر 1 دقیقه (60000 میلی‌ثانیه)
    }, 60000);

    // پاک‌سازی تایمر وقتی که کامپوننت unmount می‌شود یا loading/ChartType تغییر می‌کند
    return () => clearInterval(intervalId);
  }, [loading, ChartType]); // وابستگی به loading و ChartType

  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: '300px', marginTop: '40px' }}
        data={{
          labels: visitorChart.display,
          datasets: [
            {
              label: 'Visit',
              backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
              borderColor: getStyle('--cui-info'),
              pointHoverBackgroundColor: getStyle('--cui-info'),
              borderWidth: 2,
              data: visitorChart.value,
              fill: true,
            },
            {
              label: 'User',
              backgroundColor: 'transparent',
              borderColor: getStyle('--cui-success'),
              pointHoverBackgroundColor: getStyle('--cui-success'),
              borderWidth: 2,
              data: userChart.value,
            },
            {
              label: 'Visitor',
              backgroundColor: 'transparent',
              borderColor: getStyle('--cui-danger'),
              pointHoverBackgroundColor: getStyle('--cui-danger'),
              borderWidth: 1,
              borderDash: [8, 5],
              data: visitChart.value,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                color: getStyle('--cui-border-color-translucent'),
                drawOnChartArea: false,
              },
              ticks: {
                color: getStyle('--cui-body-color'),
              },
            },
            y: {
              beginAtZero: true,
              border: {
                color: getStyle('--cui-border-color-translucent'),
              },
              grid: {
                color: getStyle('--cui-border-color-translucent'),
              },
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 5,
                stepSize: Math.ceil(1000 / 5),
              },
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3,
            },
          },
        }}
      />
    </>
  );
}

export default MainChart;
