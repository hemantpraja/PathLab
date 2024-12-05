// import React from 'react';
// import Stack from '@mui/material/Stack';
// import { LineChart } from '@mui/x-charts/LineChart';

// const data = [0, 3000, 2000, null, 1890, 2390, 3490];
// const xData = ['12-10-2024', '14-10-24', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];

// export default function LineChartConnectNulls() {
//   return (
//     <Stack sx={{ width: '100%' }}>
//       <LineChart
//         xAxis={[{ data: xData, scaleType: 'point' }]}
//         series={[{ data, connectNulls: true }]}
//         height={200}
//         margin={{ top: 10, bottom: 20 }}
//       />
//     </Stack>
//   );
// }

// import React, { useState } from 'react';
// import { DatePicker, Space } from 'antd';
// import 'antd/dist/reset.css'; // Import Ant Design styles
// const { RangePicker } = DatePicker;

// const App = () => {
//   const [dates, setDates] = useState([]);
//   const [formattedDates, setFormattedDates] = useState([]);

//   const handleChange = (dates, dateStrings) => {
//     setDates(dates);
//     setFormattedDates(dateStrings);
//   };

//   console.log(formattedDates)

//   return (
//     <div className="container mx-auto p-4">
//       <Space direction="vertical" size={12}>
//         <RangePicker onChange={handleChange} />
//       </Space>
//     </div>
//   );
// };

// export default App;


import React from 'react'

const Dashboard = () => {
  return (
    <div className='h-screen w-full flex justify-center items-center font-regular text-lg'>Work in Progress</div>
  )
}

export default Dashboard;