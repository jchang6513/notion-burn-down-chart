import {queryDatabase} from '../src/services';
import { Line } from 'react-chartjs-2';
import {DailyEffort, getDailyEfforts} from '../src/helpers/getDailyEfforts';
import {effortsTable, sprintTable} from '../src/helpers/envVariables';
import dayjs from 'dayjs';

export default function Home({ dailyEfforts }: { dailyEfforts: DailyEffort[] }) {
  console.log(dailyEfforts)
  const data = {
    labels: dailyEfforts.map(de => dayjs(de.day, 'SSS').format('MM/DD')),
    datasets: [
      {
        label: 'Remaining Efforts',
        data: dailyEfforts.map(de => de.remainingEfforts),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Ideal Remaining Efforts',
        data: dailyEfforts.map(de => de.idealRemainingEfforts),
        fill: false,
        backgroundColor: 'transparent',
        borderColor: 'grey',
        borderDash: [8, 10],
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    scales: {
      xAxes: [
        {
          title: "time",
          type: 'time',
          time: {
            displayFormats: {
              quarter: 'MMM YYYY'
            }
          },
          ticks: {
            fontSize: 40
          }
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontSize: 24,
          }
        },
      ],
    },
  };
  return (
    <Line type="line" data={data} options={options} />
  )
}

Home.getInitialProps = async () => {
  const sprintData = await queryDatabase(sprintTable);
  const effortsData = await queryDatabase(effortsTable);
  const dailyEfforts = getDailyEfforts(effortsData, sprintData);

  return { dailyEfforts };
}
